// app/api/openai/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  const { model, systemPrompt, prompt } = await request.json();
  
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
    
    return NextResponse.json(response.choices[0].message);
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
