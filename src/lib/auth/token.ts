// Shared by the edge middleware and Node API routes, so this only uses Web Crypto.

export const AUTH_COOKIE = 'nail-polish-auth';

// The cookie holds an HMAC derived from PASSWORD rather than a plain flag, so it
// can't be forged, and changing PASSWORD invalidates every existing session.
export async function createAuthToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode('nail-polish-auth-v1'));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidAuthToken(token: string | undefined): Promise<boolean> {
  const password = process.env.PASSWORD;
  if (!password || !token) return false;
  return safeEqual(token, await createAuthToken(password));
}
