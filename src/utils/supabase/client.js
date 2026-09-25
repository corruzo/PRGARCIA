/**
 * src/utils/supabase/client.js
 *
 * Supabase browser client para Vite + React SPA.
 * Usa @supabase/ssr createBrowserClient que maneja la sesión y cookies
 * de forma correcta en el navegador (y es compatible con SSR si en el
 * futuro se migra a un framework con servidor).
 *
 * Variables de entorno esperadas (en .env.local o en Vercel Dashboard):
 *   VITE_SUPABASE_URL              → Project URL (https://xxx.supabase.co)
 *   VITE_SUPABASE_PUBLISHABLE_KEY  → Publishable Key (sb_publishable_...)
 *
 * NOTA: En una SPA de Vite NO existe "server client" ni "middleware".
 * Solo necesitamos createBrowserClient.
 */

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY; // compatibilidad con key anterior

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Variables de entorno no encontradas.\n' +
    'Crea un archivo .env.local con:\n' +
    '  VITE_SUPABASE_URL=...\n' +
    '  VITE_SUPABASE_PUBLISHABLE_KEY=...\n' +
    'La app funcionará en modo local (sin Supabase).'
  );
}

/**
 * Cliente Supabase singleton para el navegador.
 * Retorna null si las variables de entorno no están configuradas.
 *
 * Opciones de sesión:
 *  - persistSession: true  → Guarda la sesión en localStorage (como WhatsApp/Instagram)
 *  - detectSessionInUrl: true → Maneja redirect de confirmación de email / OAuth
 *  - autoRefreshToken: true   → Renueva el token automáticamente antes de expirar
 */
export const supabase = supabaseUrl && supabaseKey
  ? createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'prgarcia-auth',
      },
    })
  : null;

export default supabase;
