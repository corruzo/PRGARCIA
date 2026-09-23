import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, Lock, X, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register } = useAuth();
  const [tab, setTab] = useState(authModalTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const emailInputRef = useRef(null);

  useEffect(() => {
    setTab(authModalTab);
    setError('');
  }, [authModalTab, isAuthModalOpen]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isAuthModalOpen, tab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }

    setCargando(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err?.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setCargando(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm animate-fade-in"
      role="presentation"
      onClick={closeAuthModal}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="notice-modal modal-surface w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <header className="relative flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              {tab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 id="auth-title" className="text-base font-bold text-gray-900 dark:text-white">
                {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-[11px] text-gray-400">PRGARCÍA · Calculadora Financiera</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {/* Pestañas Login / Registro */}
        <div className="grid grid-cols-2 p-1 bg-gray-100/70 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario con Animación Smooth Tab */}
        <form key={tab} onSubmit={handleSubmit} className="p-6 space-y-4 animate-fade-in">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
              <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <span className="text-xs text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {tab === 'register' && (
            <div className="animate-fade-in">
              <label className="label-base">Nombre completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ej: María González"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="label-base">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={emailInputRef}
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label-base">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition-all duration-200 active:scale-95 disabled:opacity-50 mt-2"
          >
            {cargando ? 'Procesando…' : tab === 'login' ? 'Entrar a la calculadora' : 'Crear mi cuenta'}
          </button>

          <p className="text-center text-[11px] text-gray-400 pt-2">
            {tab === 'login' ? (
              <span>¿No tienes cuenta? <button type="button" onClick={() => setTab('register')} className="text-brand-600 font-bold hover:underline">Regístrate aquí</button></span>
            ) : (
              <span>¿Ya tienes cuenta? <button type="button" onClick={() => setTab('login')} className="text-brand-600 font-bold hover:underline">Inicia sesión</button></span>
            )}
          </p>
        </form>
      </section>
    </div>,
    document.body,
  );
}
