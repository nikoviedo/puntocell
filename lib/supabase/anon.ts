import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Cliente anon sin cookies, para la vista pública /r/[token].
export function createAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
