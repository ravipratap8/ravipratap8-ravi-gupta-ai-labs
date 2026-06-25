// Supabase browser client (PLACEHOLDER).
// When ready: npm i @supabase/supabase-js @supabase/ssr
//
// import { createBrowserClient } from '@supabase/ssr'
// export const createClient = () =>
//   createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function createClient() {
  throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY and enable lib/supabase/client.js')
}
