import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

console.log('🔐 Checking Supabase environment variables...');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
console.log('SUPABASE_URL preview:', process.env.SUPABASE_URL?.substring(0, 30) + '...');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set. Did you forget to add Supabase credentials?",
  );
}

// Create Supabase client for API operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Export supabase as db for compatibility
export const db = supabase;