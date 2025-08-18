// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

// Enable Clerk's request auth context for all pages and API routes.
// This does not force authentication; it makes auth() usable in route handlers.
export default clerkMiddleware();

// Apply to all routes including API, excluding static files and _next assets
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)'
  ]
};




