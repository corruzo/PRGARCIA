import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
};

export function NoticeModal({ open, title, message, type = 'error', onClose }) {
  if (!open) return null;

  const Icon = ICONS[type] || AlertCircle;
  const accent = type === 'success'
    ? 'text-gain-600 dark:text-gain-400 bg-gain-50 dark:bg-gain-900/20'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/35 p-3 backdrop-blur-[2px] sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        className="notice-modal w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accent}`}>
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="notice-title" className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        <button type="button" onClick={onClose} className="btn-primary mt-5 w-full">
          Entendido
        </button>
      </div>
    </div>
  );
}
