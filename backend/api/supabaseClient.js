import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://hlaicijsdwktsocygzre.supabase.co'
const supabaseKey = 'sb_publishable_9_t6qyaW9h4-SKi3f93Yrg_MU1Vgj0o'


export const supabase = createClient(supabaseUrl, supabaseKey)