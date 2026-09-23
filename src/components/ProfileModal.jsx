import { createPortal } from 'react-dom';
import { User, Mail, Calendar, ShieldCheck, LogOut, X, Bookmark, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ProfileModal({ open, onClose, totalQuotes = 0 }) {
  const { user, logout } = useAuth();

  if (!open || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const fechaRegistro = user.createdAt
    ? format(new Date(user.createdAt), "d 'de' MMMM, yyyy", { locale: es })
    : 'Cuenta Activa';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm animate-fade-in"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="notice-modal modal-surface w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <header className="relative flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 font-extrabold text-xl backdrop-blur">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 id="profile-title" className="text-base font-bold leading-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-100">
                <ShieldCheck size={12} /> Usuario Registrado
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {/* Detalles del Perfil */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/50 p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
              <Mail size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">Correo Electrónico</span>
                <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 truncate block">{user.email}</span>
              </div>
            </div>

            <div className="border-t border-gray-200/60 dark:border-gray-800 pt-2.5 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
              <Calendar size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">Miembro desde</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{fechaRegistro}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas del usuario */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-start p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">
                <Bookmark size={13} /> Cotizaciones
              </span>
              <span className="font-mono text-xl font-bold text-gray-900 dark:text-white mt-1">
                {totalQuotes}
              </span>
              <span className="text-[10px] text-gray-400">guardadas en historial</span>
            </div>

            <div className="flex flex-col items-start p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                <Smartphone size={13} /> Modo Calle
              </span>
              <span className="font-mono text-xl font-bold text-gray-900 dark:text-white mt-1">
                Activo
              </span>
              <span className="text-[10px] text-gray-400">cálculo ultrarrápido</span>
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 active:scale-95 mt-2"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
