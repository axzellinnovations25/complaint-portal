import { createClient } from '@supabase/supabase-js'
import { readRequiredEnv } from '../env'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  readRequiredEnv('VITE_SUPABASE_URL'),
  readRequiredEnv('VITE_SUPABASE_ANON_KEY'),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
