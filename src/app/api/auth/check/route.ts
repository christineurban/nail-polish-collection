import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE, isValidAuthToken } from '@/lib/auth/token';

export async function GET() {
  const cookieStore = cookies();
  const isAuthenticated = await isValidAuthToken(cookieStore.get(AUTH_COOKIE)?.value);

  return NextResponse.json({ isAuthenticated });
}
