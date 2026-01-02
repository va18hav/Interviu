import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nfgforfzxarpjauiycar.supabase.co'
const supabaseKey = 'sb_publishable_3jcEXhWkwMXxLHIyzP2b9w_90EUHSUf'

export const supabase = createClient(supabaseUrl, supabaseKey)