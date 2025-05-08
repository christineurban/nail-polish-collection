import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.has('auth');

  return NextResponse.json({ isAuthenticated });
}
