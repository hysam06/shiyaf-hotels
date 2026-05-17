import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env file.\n' +
    'Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY'
  );
}

// Create Supabase client with service role (for backend operations)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key (for client-side operations)
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase initialized successfully');
console.log(`📦 Project URL: ${supabaseUrl}`);
console.log('🗄️  Database and Storage ready');

export default supabase;
