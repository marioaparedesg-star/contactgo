import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for browser/client components.
 * Uses anonymous key — respects RLS policies.
 * Do NOT use for server-side admin operations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// NOTE: createServerSupabaseClient is in @/lib/supabase-server
// Do NOT import it from here — it would use the browser client
// which cannot read server-side cookies for auth.
