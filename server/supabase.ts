import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createDemoSupabaseClient } from '@/lib/demoSupabaseClient';

/**
 * Creates a Supabase client that can be used on the server. When a service key is
 * available it will be used to enable privileged operations (e.g. inserting
 * embeddings). If not, the anonymous key is used. In demo mode or when the
 * environment variables are missing we fall back to a static in-memory client
 * that mimics the relevant Supabase APIs.
 */
export const createServerSupabaseClient = (): SupabaseClient => {
  const demoMode = process.env.DEMO_MODE === 'true';
  const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey: string | undefined = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (demoMode || !supabaseUrl || !anonKey) {
    if (!demoMode && (!supabaseUrl || !anonKey)) {
      console.warn('Supabase server environment missing. Using demo client.');
    }
    return createDemoSupabaseClient();
  }

  const key = serviceKey ?? anonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false
    }
  });
};