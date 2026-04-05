import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and auth API routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    // If user is already authenticated and trying to access login, redirect to home
    if (pathname === "/login") {
      const sessionToken = request.cookies.get("session")?.value;
      if (sessionToken) {
        const session = await validateSessionToken(sessionToken);
        if (session) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await validateSessionToken(sessionToken);
  if (!session) {
    // No valid session - redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Valid session - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
