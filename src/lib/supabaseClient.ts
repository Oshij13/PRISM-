/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dgopgdfvsbaucsjejimk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';

/**
 * Helper to check if Supabase is properly configured in env variables
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseAnonKey && supabaseAnonKey.trim().length > 0 && supabaseAnonKey !== 'YOUR_SUPABASE_PUBLIC_ANON_KEY_HERE';
}

// Only call createClient if keys are present to avoid the immediate "@supabase/supabase-js: supabaseKey is required" crash
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;
