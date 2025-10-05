import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { createDemoSupabaseBrowserClient } from '@/lib/demoSupabaseClient';

// Create a Supabase browser client using the `@supabase/ssr` helper. This
// helper uses the PKCE flow by default and persists the session in
// cookies instead of localStorage, enabling server-side rendering
// support. It also automatically exchanges the auth code returned via
// the query string for a session and manages cookie storage. When
// environment variables are missing, we fall back to a lightweight demo
// client so the UI remains usable without backend credentials.
export const supabaseBrowser = (() => {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (demoMode || !supabaseUrl || !supabaseKey) {
    if (!demoMode && (!supabaseUrl || !supabaseKey)) {
      console.warn('Missing Supabase browser environment variables. Using demo auth client.');
    }
    return createDemoSupabaseBrowserClient();
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
})();