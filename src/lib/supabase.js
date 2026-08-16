import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev rather than silently breaking auth calls later
  // eslint-disable-next-line no-console
  console.warn(
    'Missing Supabase environment variables. Copy .env.example to .env and add your project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
