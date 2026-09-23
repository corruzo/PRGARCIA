import { Calculator, LogIn, UserPlus, Zap, Shield, DollarSign, ArrowRight, CheckCircle2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function WelcomeLanding() {
  const { openAuthModal } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-gray-100 flex flex-col justify-between app-canvas">
      {/* Navbar de Recibidor */}
      <header className="app-header sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2.5">
            <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl shadow-md">
              <Calculator size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">PRGARCÍA</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Soluciones Financieras · Venezuela</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Cambiar tema"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-3.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
            >
              <LogIn size={14} className="text-brand-600 dark:text-brand-400" />
              <span>Ingresar</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-3.5 text-xs font-bold text-white shadow-md shadow-brand-600/20 transition-all active:scale-95"
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Crear Cuenta</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <main className="mx-auto max-w-5xl px-4 py-12 lg:py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-50/70 dark:bg-brand-950/40 px-4 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 backdrop-blur mb-6 animate-fade-in">
          <Shield size={14} /> Acceso Exclusivo para Usuarios Registrados
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-tight">
          Calculadora de Préstamos e Intereses Simple para <span className="currency-accent">Venezuela</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl font-normal leading-relaxed">
          Cálculos exactos por días reales transcurridos, cobro bimoneda USD / VES a la tasa oficial del BCV y generación instantánea de cotizaciones para WhatsApp.
        </p>

        {/* Llamado a la Acción Principal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <LogIn size={18} />
            <span>Iniciar Sesión para Usar</span>
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-7 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-brand-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
          >
            <UserPlus size={18} className="text-brand-600 dark:text-brand-400" />
            <span>Registrarme Gratis</span>
          </button>
        </div>

        {/* Tarjetas de Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 w-full text-left">
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-600 dark:text-brand-400 mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cálculo Día a Día</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Cobra exactamente los días devengados sin redondeos forzados. Ni tú ni tu cliente pierden.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Bimoneda USD / VES</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Conversión automática a la tasa del Banco Central de Venezuela (BCV) en tiempo real.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cotizaciones Listas</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Genera imágenes descargables y mensajes formateados para compartir por WhatsApp en 1-clic.
            </p>
          </div>
        </div>
      </main>

      {/* Footer del Recibidor */}
      <footer className="py-6 border-t border-gray-200/80 dark:border-gray-800 text-center text-xs text-gray-400">
        PRGARCÍA · Sistema Privado de Préstamos · Venezuela
      </footer>
    </div>
  );
}
