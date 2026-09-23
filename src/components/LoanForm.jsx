import { UserRound, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';
import { BCVField } from './BCVField';

const MODALIDADES = [
  { value: 'diaria',   label: 'Diaria' },
  { value: 'semanal',  label: 'Semanal (7d)' },
  { value: 'quincenal', label: 'Quincenal (15d)' },
];

const FRECUENCIAS = [
  { value: 'diario',    label: 'Diario',     sub: '1 día' },
  { value: 'semanal',   label: 'Semanal',    sub: '7 días' },
  { value: 'quincenal', label: 'Quincenal',  sub: '15 días' },
];

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} className="currency-accent" />
      <span className="currency-accent text-xs font-bold uppercase tracking-widest">{children}</span>
    </div>
  );
}

function FieldGroup({ children, className = '' }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function LoanForm({ values, onChange }) {
  const set = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    onChange(key, val);
  };

  return (
    <div className="space-y-6">

      {/* ── Cliente ── */}
      <section>
        <SectionTitle icon={UserRound}>Cliente</SectionTitle>
        <div>
          <label className="label-base" htmlFor="nombre-cliente">Nombre del cliente</label>
          <input
            id="nombre-cliente"
            type="text"
            autoComplete="name"
            placeholder="Ej: María González"
            value={values.nombreCliente}
            onChange={set('nombreCliente')}
            className="input-base"
          />
        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* ── Capital ── */}
      <section>
        <SectionTitle icon={DollarSign}>Capital</SectionTitle>
        <FieldGroup>

          {/* Moneda toggle */}
          <div>
            <label className="label-base flex items-center justify-between">
              <span>Moneda del Préstamo</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {values.moneda === 'USD' ? 'Dólares (Divisa)' : 'Bolívares (Digital)'}
              </span>
            </label>
            <div className="relative grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner">
              {/* Indicador deslizante animado */}
              <span
                aria-hidden="true"
                className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl shadow-md transition-all duration-300 cubic-bezier(0.4,0,0.2,1) ${
                  values.moneda === 'USD'
                    ? 'translate-x-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25'
                    : 'translate-x-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25'
                }`}
              />

              {/* Opción USD */}
              <button
                type="button"
                onClick={() => onChange('moneda', 'USD')}
                className={`relative z-10 flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  values.moneda === 'USD'
                    ? 'text-white scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                aria-pressed={values.moneda === 'USD'}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${values.moneda === 'USD' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  $
                </span>
                <span>USD · Divisas</span>
              </button>

              {/* Opción VES */}
              <button
                type="button"
                onClick={() => onChange('moneda', 'VES')}
                className={`relative z-10 flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  values.moneda === 'VES'
                    ? 'text-white scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                aria-pressed={values.moneda === 'VES'}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${values.moneda === 'VES' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  Bs
                </span>
                <span>VES · Digital</span>
              </button>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="label-base">Monto a prestar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                {values.moneda === 'USD' ? '$' : 'Bs.'}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.monto}
                onChange={set('monto')}
                className="currency-input input-base pl-9 font-mono text-base"
              />
            </div>
          </div>

          {/* Tasa BCV */}
          <BCVField value={values.tasaBCV} onChange={(v) => onChange('tasaBCV', v)} />
        </FieldGroup>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* ── Interés ── */}
      <section>
        <SectionTitle icon={Percent}>Tasa de Interés</SectionTitle>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            {/* Tasa numérica */}
            <div>
              <label className="label-base">Tasa (%)</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values.tasa}
                  onChange={set('tasa')}
                  className="input-base pr-7 font-mono transition-all duration-200 focus:scale-[1.01]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">%</span>
              </div>
            </div>

            {/* Modalidad */}
            <div>
              <label className="label-base flex items-center justify-between">
                <span>Modalidad</span>
                <span className="text-[10px] text-gray-400 font-normal normal-case">Base de la tasa</span>
              </label>
              <select
                value={values.modalidadTasa}
                onChange={set('modalidadTasa')}
                className="input-base cursor-pointer transition-all duration-200"
              >
                {MODALIDADES.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">
            La modalidad define el período base al que corresponde el porcentaje ingresado.
          </p>
        </FieldGroup>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* ── Plazo ── */}
      <section>
        <SectionTitle icon={Calendar}>Plazo del Préstamo</SectionTitle>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="label-base">Fecha de inicio</label>
              <input
                type="date"
                aria-label="Fecha de inicio del préstamo"
                value={values.fechaInicio}
                onChange={set('fechaInicio')}
                className="input-base transition-all duration-200"
              />
            </div>
            <div>
              <label className="label-base">Fecha de fin</label>
              <input
                type="date"
                aria-label="Fecha de fin del préstamo"
                value={values.fechaFin}
                onChange={set('fechaFin')}
                min={values.fechaInicio}
                className="input-base transition-all duration-200"
              />
            </div>
          </div>
        </FieldGroup>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* ── Frecuencia de pago ── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <SectionTitle icon={BarChart3}>Frecuencia de Cobro</SectionTitle>
          <span className="text-[10px] text-gray-400 font-normal">Periodicidad del abono</span>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3 italic">
          Cada cuántos días el cliente realizará sus pagos. Si la última cuota dura menos días, se cobrarán únicamente los días exactos transcurridos.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {FRECUENCIAS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange('frecuenciaPago', f.value)}
              className={`currency-frequency flex min-h-12 flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all duration-200 active:scale-95 shadow-sm ${
                values.frecuenciaPago === f.value ? 'currency-selected ring-2 ring-brand-500/20 shadow-md scale-[1.02]' : ''} ${
                values.frecuenciaPago === f.value
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-brand-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className="text-xs sm:text-sm font-semibold">{f.label}</span>
              <span className={`text-[10px] sm:text-xs mt-0.5 ${values.frecuenciaPago === f.value ? 'text-blue-100' : 'text-gray-400'}`}>{f.sub}</span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
