import { cookies } from 'next/headers';
import type { DemoUser } from './demoData';
import { demoUser } from './demoData';

const COOKIE_NAME = 'aisf-demo-session';
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

interface DemoSessionPayload {
  email: string;
  role: DemoUser['role'];
}

const encode = (payload: DemoSessionPayload) => Buffer.from(JSON.stringify(payload)).toString('base64');

const decode = (value: string): DemoSessionPayload | null => {
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf-8')) as DemoSessionPayload;
  } catch {
    return null;
  }
};

export const getDemoUserFromCookies = (): DemoUser | null => {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) {
    return null;
  }
  const payload = decode(cookie.value);
  if (!payload) {
    return null;
  }
  return {
    ...demoUser,
    email: payload.email,
    role: payload.role
  };
};

export const createDemoSessionCookie = (email: string, role: DemoUser['role']) => ({
  name: COOKIE_NAME,
  value: encode({ email, role }),
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE
});

export const clearDemoSessionCookie = () => ({
  name: COOKIE_NAME,
  value: '',
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0
});
