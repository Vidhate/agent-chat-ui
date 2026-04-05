// Stateless session management using signed tokens
// This works across Edge Runtime (middleware) and Node.js Runtime (API routes)

const SECRET = process.env.SESSION_SECRET || "default-secret-change-in-production";

// Create a simple signed session token
export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    username,
    createdAt: Date.now(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = await generateSignature(payloadBase64);

  return `${payloadBase64}.${signature}`;
}

// Validate and decode session token
export async function validateSessionToken(token: string): Promise<{ username: string } | null> {
  try {
    const [payloadBase64, signature] = token.split(".");

    if (!payloadBase64 || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = await generateSignature(payloadBase64);
    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());

    return { username: payload.username };
  } catch (error) {
    console.error("[Session] Validation error:", error);
    return null;
  }
}

// Generate HMAC signature using Web Crypto API (works in both Edge and Node runtimes)
async function generateSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return Buffer.from(signature).toString("base64");
}
