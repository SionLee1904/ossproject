import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // CRA에서는 런타임에 env가 없으면 여기서 바로 티가 남
  // eslint-disable-next-line no-console
  console.error("Missing Supabase env. Check REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
