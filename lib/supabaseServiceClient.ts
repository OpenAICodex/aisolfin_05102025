import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

let cachedClient: SupabaseClient<Database> | null | undefined;

/**
 * Lazily loads a Supabase client configured with the service role key when
 * available. Returns `null` when no service role key is configured. The client
 * instance is cached to avoid re-instantiating the underlying connection
 * helpers on every request.
 */
export const getSupabaseServiceClient = async (): Promise<SupabaseClient<Database> | null> => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  if (cachedClient !== undefined) {
    return cachedClient;
  }
  const { createServerSupabaseClient } = await import('@/server/supabase');
  cachedClient = createServerSupabaseClient() as SupabaseClient<Database>;
  return cachedClient;
};
