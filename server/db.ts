import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

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