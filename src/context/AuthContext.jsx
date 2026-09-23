/**
 * AuthContext.jsx — Proveedor global de autenticación para PRGARCIA.
 *
 * Estrategia dual:
 *  1. Supabase Auth (si VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY están configurados)
 *  2. Fallback localStorage (para desarrollo local sin credenciales de Supabase)
 *
 * El cliente Supabase se importa desde src/utils/supabase/client.js que usa
 * @supabase/ssr > createBrowserClient — la forma recomendada para SPAs.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

const AUTH_STORAGE_KEY = 'prgarcia.auth.user.v1';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  authModalTab: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normaliza un usuario de Supabase al formato interno */
function mapSupabaseUser(sbUser) {
  return {
    id:          sbUser.id,
    email:       sbUser.email,
    name:        sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
    avatarUrl:   sbUser.user_metadata?.avatar_url || null,
    createdAt:   sbUser.created_at,
    isSupabase:  true,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab]   = useState('login');

  // ── Inicialización de sesión ────────────────────────────────────────────────
  useEffect(() => {
    if (supabase) {
      // Recupera la sesión activa (si el usuario ya inició sesión antes)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          loadLocalUser();
        }
        setLoading(false);
      });

      // Escucha cambios de sesión en tiempo real (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }

    // Sin Supabase → modo local
    loadLocalUser();
    setLoading(false);
  }, []);

  // ── localStorage fallback ──────────────────────────────────────────────────

  const loadLocalUser = () => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      setUser(saved ? JSON.parse(saved) : null);
    } catch {
      setUser(null);
    }
  };

  const saveLocalUser = (u) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // ── Auth actions ───────────────────────────────────────────────────────────

  const login = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.user) {
        const u = mapSupabaseUser(data.user);
        setUser(u);
        closeAuthModal();
        return u;
      }
    }

    // Fallback: autenticación local simple
    const localUser = {
      id:        `usr_${Date.now()}`,
      email,
      name:      email.split('@')[0],
      createdAt: new Date().toISOString(),
      isLocal:   true,
    };
    saveLocalUser(localUser);
    closeAuthModal();
    return localUser;
  };

  const register = async (name, email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw new Error(error.message);
      if (data.user) {
        const u = mapSupabaseUser(data.user);
        setUser(u);
        closeAuthModal();
        return u;
      }
    }

    // Fallback: registro local simple
    const localUser = {
      id:        `usr_${Date.now()}`,
      email,
      name:      name.trim() || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isLocal:   true,
    };
    saveLocalUser(localUser);
    closeAuthModal();
    return localUser;
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      // onAuthStateChange → SIGNED_OUT → limpia user
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        supabaseReady: Boolean(supabase),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
