import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client — initialized once, imported everywhere.
 *
 * Configuration comes from Vite env vars (see .env.example):
 *   VITE_SUPABASE_URL              your project URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY  the publishable (or legacy anon) key
 *
 * The publishable key is safe to ship in the browser bundle — all data
 * access is governed by Row Level Security and the SECURITY DEFINER
 * functions in supabase/migrations/.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        // Persist the session and refresh tokens automatically.
        // NATIVE APPS: swap storage for SecureStore/Keychain via the
        // `storage` option when wrapping with Capacitor/React Native.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // handles email-confirmation redirects
      },
    })
  : null;
