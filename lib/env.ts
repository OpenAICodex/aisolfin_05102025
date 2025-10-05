declare global {
  interface Window {
    __SUPABASE_CONFIGURED__?: boolean;
  }
}

const isTruthy = (value: string | undefined) => {
  if (!value) return false;
  const normalized = value.toLowerCase();
  if (normalized === 'false') return false;
  return normalized !== 'undefined' && normalized !== 'null' && normalized.trim() !== '';
};

const supabaseConfigured =
  !isTruthy(process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE) &&
  !isTruthy(process.env.ENABLE_DEMO_MODE) &&
  isTruthy(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  isTruthy(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const detectFromWindow = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return typeof window.__SUPABASE_CONFIGURED__ === 'boolean'
    ? window.__SUPABASE_CONFIGURED__
    : undefined;
};

export const isSupabaseConfigured = () => detectFromWindow() ?? supabaseConfigured;
export const isDemoMode = () => !isSupabaseConfigured();
