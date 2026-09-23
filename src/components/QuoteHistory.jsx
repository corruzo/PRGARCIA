import { Clock3, History, RotateCcw, Trash2 } from 'lucide-react';
import { formatearMoneda } from '../utils/calculator';

export function QuoteHistory({ items, onOpen, onDelete, onClear }) {
  return (
    <section className="history-panel" aria-labelledby="history-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow"><History size={13} /> Registro de cotizaciones</div>
          <h2 id="history-title" className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Historial reciente</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Recupera una propuesta sin volver a llenar el formulario.</p>
        </div>
        {items.length > 0 && (
          <button type="button" onClick={onClear} className="btn-ghost min-h-10 text-xs">Borrar historial</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="history-empty">
          <Clock3 size={22} />
          <p>Aún no hay cotizaciones guardadas.</p>
          <span>Cuando guardes una propuesta aparecerá aquí.</span>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="history-item">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900 dark:text-white">{item.values.nombreCliente || 'Cliente sin nombre'}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.values.moneda} · {item.values.modalidadTasa} · {item.values.frecuenciaPago}</p>
                </div>
                <span className={`history-currency ${item.values.moneda === 'USD' ? 'history-currency-usd' : 'history-currency-ves'}`}>{item.values.moneda}</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</span>
                  <strong className="font-mono text-lg text-gray-900 dark:text-white">{formatearMoneda(item.resultado.totalPagar, item.values.moneda)}</strong>
                  <span className="block text-[11px] text-gray-400">{new Date(item.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => onOpen(item)} aria-label="Abrir cotización" title="Abrir cotización" className="icon-action"><RotateCcw size={16} /></button>
                  <button type="button" onClick={() => onDelete(item.id)} aria-label="Eliminar cotización" title="Eliminar cotización" className="icon-action icon-action-danger"><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
