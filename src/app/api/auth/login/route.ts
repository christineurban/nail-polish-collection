import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, createAuthToken, safeEqual } from '@/lib/auth/token';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const expected = process.env.PASSWORD;

    if (expected && typeof password === 'string' && safeEqual(password, expected)) {
      cookies().set(AUTH_COOKIE, await createAuthToken(expected), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  }
  catch {
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
