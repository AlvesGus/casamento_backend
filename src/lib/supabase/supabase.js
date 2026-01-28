import { createClient } from '@supabase/supabase-js'
import 'dotenv/config.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis do Supabase não definidas')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
