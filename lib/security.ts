const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "editalflash-secret-key-salt-audit-2026-compliance-14133";

export interface SessionPayload {
  email: string;
  exp: number; // timestamp in seconds
}

/**
 * Standard Web Crypto API HMAC implementation compatible with Edge Runtime and Node.js
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a signed token in format: base64(payload).signature
 */
export async function createSignedSessionToken(email: string, durationSeconds: number = 1800): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + durationSeconds;
  const payload: SessionPayload = { email, exp };
  const enc = new TextEncoder();
  const encodedPayload = bufferToBase64Url(enc.encode(JSON.stringify(payload)));

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload));
  const signature = bufferToBase64Url(signatureBuffer);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  try {
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const sigBytes = base64UrlToUint8Array(signature);

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes as any, enc.encode(encodedPayload));
    if (!isValid) {
      return null;
    }

    const payloadBytes = base64UrlToUint8Array(encodedPayload);
    const dec = new TextDecoder();
    const payloadStr = dec.decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
