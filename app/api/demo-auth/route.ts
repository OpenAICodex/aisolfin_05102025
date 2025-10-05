import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/env';
import { createDemoSessionCookie, clearDemoSessionCookie } from '@/lib/demoSession';

const determineRole = (email: string) => (email.toLowerCase().startsWith('admin') ? 'admin' : 'user');

export async function POST(req: NextRequest) {
  if (isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Demo mode disabled' }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const payload = body as Record<string, unknown> | null;
  const rawEmail = payload && typeof payload.email === 'string' ? (payload.email as string) : '';
  const email = rawEmail.trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'E-Mail ist erforderlich' }, { status: 400 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(createDemoSessionCookie(email, determineRole(email)));
  return response;
}

export async function DELETE() {
  if (isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Demo mode disabled' }, { status: 404 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearDemoSessionCookie());
  return response;
}
