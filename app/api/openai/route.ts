// app/api/openai/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { auth, getAuth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  const { model, systemPrompt, prompt, isFinal } = await request.json();
  const { userId } = getAuth(request);

  // If this is the final, full policy generation call, enforce per-user quota
  // using Clerk privateMetadata (policyGenerationsUsed vs policyGenerationLimit).
  if (isFinal === true) {
    try {
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const pm = (user.privateMetadata || {}) as Record<string, unknown>;
      const limit = (typeof pm.policyGenerationLimit === 'number' ? pm.policyGenerationLimit : 1);
      const used = (typeof pm.policyGenerationsUsed === 'number' ? pm.policyGenerationsUsed : 0);
      if (used >= limit) {
        return NextResponse.json({ error: 'Generation limit reached. Please upgrade or contact support.' }, { status: 429 });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read user quota';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 1,
      max_tokens: 25000,
      top_p: 0.4,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    
    // If final call succeeded, increment the user's used counter.
    if (isFinal === true) {
      try {
        if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const pm = (user.privateMetadata || {}) as Record<string, unknown>;
        const limit = (typeof pm.policyGenerationLimit === 'number' ? pm.policyGenerationLimit : 1);
        const used = (typeof pm.policyGenerationsUsed === 'number' ? pm.policyGenerationsUsed : 0);
        const newUsed = used + 1;
        await client.users.updateUser(userId, {
          privateMetadata: {
            ...pm,
            policyGenerationLimit: limit,
            policyGenerationsUsed: newUsed,
          }
        });
        // Return the model message along with an updated quota snapshot.
        return NextResponse.json({
          ...response.choices[0].message,
          quota: { used: newUsed, limit, remaining: Math.max(limit - newUsed, 0) }
        });
      } catch (err) {
        // If increment fails, still return content but include a warning.
        const warning = err instanceof Error ? err.message : 'Failed to update quota';
        return NextResponse.json({
          ...response.choices[0].message,
          quotaWarning: warning
        });
      }
    }
    
    // Non-final calls just return the model message.
    return NextResponse.json(response.choices[0].message);
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
