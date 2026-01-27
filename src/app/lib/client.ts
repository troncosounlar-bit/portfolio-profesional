// src/app/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'; 

// Usamos el operador de aserción o fallback para evitar el error de tipos
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseUrl.startsWith('https')) {
  console.warn("⚠️ CUIDADO: VITE_SUPABASE_URL no está configurada correctamente en .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);