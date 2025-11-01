import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Auth pages that signed-in users shouldn't access
  const authPages = ["/sign-in", "/sign-up", "/"];

  // Protected pages that require authentication
  const protectedPages = ["/dashboard"];

  // If user is signed in and tries to access auth pages, redirect to library
  if (sessionCookie && authPages.includes(pathname)) {
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }

  // If user is not signed in and tries to access protected pages, redirect to home
  if (!sessionCookie && protectedPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/sign-in", "/sign-up", "/"], // Apply middleware to these routes
};
