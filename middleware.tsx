import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteMatcher } from '@clerk/nextjs/server'

// Define the routes you want to exclude from protection
const isExcludedRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/public/:path*'])

export default clerkMiddleware(async (auth, request) => {
  if (!isExcludedRoute(request)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};