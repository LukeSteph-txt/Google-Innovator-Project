// app/api/quota/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, getAuth, clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId, sessionId } = getAuth(request);
  if (!userId) {
    // Return a consistent shape so the client can render a clear state
    return NextResponse.json({ used: 0, limit: 1, remaining: 0, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const pm = (user.privateMetadata || {}) as Record<string, unknown>;
    const limit = (typeof pm.policyGenerationLimit === 'number' ? pm.policyGenerationLimit : 1);
    const used = (typeof pm.policyGenerationsUsed === 'number' ? pm.policyGenerationsUsed : 0);
    const remaining = Math.max(limit - used, 0);
    
    // Initialize quota variables if they don't exist
    if (typeof pm.policyGenerationLimit !== 'number' || typeof pm.policyGenerationsUsed !== 'number') {
      await client.users.updateUser(userId, {
        privateMetadata: {
          ...pm,
          policyGenerationLimit: 1,
          policyGenerationsUsed: 0,
        }
      });
    }
    
    return NextResponse.json({ used, limit, remaining, userId, sessionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read quota';
    return NextResponse.json({ used: 0, limit: 1, remaining: 0, error: message }, { status: 500 });
  }
}


