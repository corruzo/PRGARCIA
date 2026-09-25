/**
 * src/utils/supabase/client.js
 *
 * Cliente Supabase para Vite + React SPA.
 * Compatible con:
 *   - anon key  (eyJ...)              — formato clásico @supabase/supabase-js
 *   - publishable key (sb_publishable_...) — nuevo formato Supabase v2
 *
 * Variables de entorno (en .env.local local o en Vercel Dashboard):
 *   VITE_SUPABASE_URL             → https://xxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY        → eyJ...  ← usa esta (anon public key)
 *   VITE_SUPABASE_PUBLISHABLE_KEY → sb_publishable_... (alternativa)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Acepta ambos nombres de variable, prioriza ANON_KEY (formato clásico)
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  console.error(
    '[PRGARCIA] ⚠️ Falta VITE_SUPABASE_URL en las variables de entorno.\n' +
    'Agrégala en Vercel → Settings → Environment Variables.'
  );
}
if (!supabaseKey) {
  console.error(
    '[PRGARCIA] ⚠️ Falta VITE_SUPABASE_ANON_KEY en las variables de entorno.\n' +
    'Ve a Supabase → Settings → API → "anon public" y agrégala en Vercel.'
  );
}

/**
 * Cliente Supabase singleton.
 * Null si las variables no están configuradas (la app sigue cargando,
 * pero el AuthContext bloqueará el acceso con un aviso claro).
 *
 * Opciones de sesión estilo red social:
 *  - persistSession: true    → Sesión guardada en localStorage (no expira al cerrar)
 *  - autoRefreshToken: true  → Renueva el token automáticamente antes de vencer
 *  - detectSessionInUrl: true → Captura redirects de confirmación de email
 */
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'prgarcia-auth',
      },
    })
  : null;

export default supabase;
