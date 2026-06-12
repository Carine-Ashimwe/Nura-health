import { SignJWT, jwtVerify } from "jose";

// Edge-safe (no Node APIs) so this can be used in middleware too.
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "nura-health-dev-secret-change-me-please-32chars",
);

export const SESSION_COOKIE = "nura_session";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.id),
      email: String(payload.email),
      fullName: String(payload.fullName),
    };
  } catch {
    return null;
  }
}
