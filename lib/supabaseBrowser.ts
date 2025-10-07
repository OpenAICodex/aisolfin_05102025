import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};

const client = createClient();

const fallbackClient = {
  auth: {
    async signInWithOtp() {
      throw new Error('Supabase is not configured.');
    },
    async signOut() {
      return { error: null } as const;
    },
    async exchangeCodeForSession() {
      throw new Error('Supabase is not configured.');
    },
    async getSession() {
      return { data: { session: null }, error: null } as const;
    }
  }
};

export const supabaseBrowser = (client ?? (fallbackClient as unknown)) as SupabaseClient<Database>;
