import { useState } from 'react';
import { ChevronDown, ChevronUp, Table } from 'lucide-react';
import { formatearMoneda } from '../utils/calculator';

export function CronogramaTable({ resultado, cronograma }) {
  const [open, setOpen] = useState(false);

  if (!resultado?.valido || !cronograma?.length) return null;

  const { moneda, monedaAlterna } = resultado;
  const fmtP = (v) => formatearMoneda(v, moneda);
  const fmtA = (v) => formatearMoneda(v, monedaAlterna);

  return (
    <section className="mt-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-600 transition-colors group"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Table size={15} className="text-brand-600" />
          Cronograma de pagos
          <span className="text-xs font-normal text-gray-400">({cronograma.length} cuotas)</span>
        </div>
        {open
          ? <ChevronUp size={16} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
          : <ChevronDown size={16} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
        }
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  {['#', 'Fecha', 'Días', 'Capital', 'Interés', 'Cuota', 'Saldo'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-[10px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cronograma.map((row, i) => (
                  <tr
                    key={row.cuota}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      i === cronograma.length - 1 ? 'font-semibold' : ''
                    }`}
                  >
                    <td className="px-3 py-2.5 font-mono text-gray-400">{row.cuota}</td>
                    <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.fecha}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {row.diasPeriodo}d
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-gray-700 dark:text-gray-300">{fmtP(row.capital)}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-gain-600 dark:text-gain-500">{fmtP(row.interes)}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div>
                        <span className="font-mono text-brand-600 dark:text-brand-500 font-semibold">{fmtP(row.total)}</span>
                        <div className="font-mono text-gray-400 text-[10px]">{fmtA(row.totalAlterna)}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-500 dark:text-gray-400">{fmtP(row.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
