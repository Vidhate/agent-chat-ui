import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { createSessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Read credentials from environment variable or logins.json (fallback for local dev)
    let credentials: Record<string, string>;

    if (process.env.AUTH_CREDENTIALS) {
      // Production: read from environment variable
      credentials = JSON.parse(process.env.AUTH_CREDENTIALS);
    } else {
      // Local development: fallback to logins.json
      const loginsPath = join(process.cwd(), "logins.json");
      const loginsData = readFileSync(loginsPath, "utf-8");
      credentials = JSON.parse(loginsData) as Record<string, string>;
    }

    // Validate credentials
    if (credentials[username] !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = await createSessionToken(username);

    // Set httpOnly cookie (session cookie - no maxAge)
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // No maxAge/expires → Session cookie (cleared on browser close)
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
