import { cookies } from "next/headers";

const COOKIE_NAME = "bun_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "";

function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await getKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(signature);
}

export async function createSessionValue(adminId: string): Promise<string> {
  const signature = await sign(adminId);
  return `${adminId}.${signature}`;
}

export async function verifySessionValue(sessionValue: string): Promise<string | null> {
  const [adminId, signature] = sessionValue.split(".");
  if (!adminId || !signature) return null;

  const expected = await sign(adminId);
  if (expected.length !== signature.length) return null;

  // constant-time-ish comparison
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return null;

  return adminId;
}

export async function setSessionCookie(adminId: string) {
  const cookieStore = await cookies();
  const value = await createSessionValue(adminId);
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifySessionValue(raw);
}

export { COOKIE_NAME };
