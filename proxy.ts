import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import OSConfig from "@/ostack.config";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // hide home page if user is signed in
  if (sessionCookie && pathname === "/") {
    console.log("Redirecting to library");
    return NextResponse.redirect(new URL("/library", request.url));
  }

  // redirect to home if user is not signed in
  if (!sessionCookie && OSConfig.proxy.protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
