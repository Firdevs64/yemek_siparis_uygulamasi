// Supabase JS kütüphanesini import edin
import { createClient } from "@supabase/supabase-js";

// Supabase projenizin URL ve anon key bilgilerini .env dosyasından okuyun
// Bu bilgileri Supabase dashboard'dan (Settings -> API) alabilirsiniz.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Supabase client'ı oluşturun ve dışa aktarın
export const supabase = createClient(supabaseUrl, supabaseAnonKey);