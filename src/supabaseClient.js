import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ibwdqtsuotxeounmcjir.supabase.co";
const supabaseKey = "sb_publishable_Vbju01evSrrOWaEK2CHpFg_TkfpeS4z";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});