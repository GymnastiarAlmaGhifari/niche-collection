import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client for public reads (browser & server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for writes (server ONLY)
// We only initialize this if we're on the server, to avoid crashing client components
// that happen to import this file (e.g. via lib/data.ts)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = (typeof window === 'undefined' && serviceKey)
  ? createClient(supabaseUrl, serviceKey)
  : supabase; // Fallback to anon client on the browser to prevent crash on evaluate
