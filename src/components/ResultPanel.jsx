import { useState } from 'react';
import { Download, Save, Share2, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { convertirMoneda, formatearMoneda, generarCronograma } from '../utils/calculator';
import { format } from 'date-fns';

function Stat({ label, value, alt, highlight = false, accent = 'blue' }) {
  const colorMap = {
    blue:  'text-brand-600 dark:text-brand-500',
    green: 'text-gain-600 dark:text-gain-500',
    gray:  'text-gray-700 dark:text-gray-200',
  };

  return (
    <div className="result-card flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`result-value ${highlight ? colorMap[accent] : 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </span>
      {alt && <span className="result-alt">{alt}</span>}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{label}</span>
      <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
    </div>
  );
}

export function ResultPanel({ resultado, nombreCliente = '', onSaveQuote }) {
  const [imagenPreparada, setImagenPreparada] = useState(false);
  const [cotizacionGuardada, setCotizacionGuardada] = useState(false);
  if (!resultado) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 dark:text-gray-600 gap-3">
        <TrendingUp size={36} className="opacity-30" />
        <p className="text-sm font-medium">Completa el formulario para ver la simulación</p>
        <p className="text-xs">Los resultados aparecerán aquí en tiempo real</p>
      </div>
    );
  }

  if (!resultado.valido) {
    return (
      <div className="space-y-2 py-4">
        {resultado.errores.map((err, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <span className="text-xs text-red-700 dark:text-red-300">{err}</span>
          </div>
        ))}
      </div>
    );
  }

  const {
    moneda, monedaAlterna,
    diasTotales, numeroCuotas,
    monto, interes, totalPagar, montoCuota, cuotaFinal,
    interesAlterna, totalAlterna, cuotaAlterna,
    rendimientoPorcentaje, tasaBCV,
    frecuenciaPago,
  } = resultado;

  const fmtP  = (v) => formatearMoneda(v, moneda);
  const fmtA  = (v) => formatearMoneda(v, monedaAlterna);
  const fmtConverted = (v, from, to) => formatearMoneda(convertirMoneda(v, tasaBCV, from, to), to);
  const pct   = rendimientoPorcentaje.toFixed(2);
  const frecLabels = {
    diario: 'diaria', semanal: 'semanal', quincenal: 'quincenal', mensual: 'mensual',
  };

  const cronogramaLocal = resultado?.valido ? generarCronograma(resultado) : [];
  const cuotasDetalleTexto = cronogramaLocal
    .map(c => {
      const montoUSD = moneda === 'USD' ? c.total : c.totalAlterna;
      const montoVES = moneda === 'VES' ? c.total : c.totalAlterna;
      const fmtUSD = formatearMoneda(montoUSD, 'USD');
      const fmtVES = formatearMoneda(montoVES, 'VES');

      if (moneda === 'VES') {
        return `• Cuota ${c.cuota} (${c.fecha}): ${fmtUSD} USD (Ref. hoy: ${fmtVES})`;
      } else {
        return `• Cuota ${c.cuota} (${c.fecha}): ${fmtUSD} USD`;
      }
    })
    .join('\n');

  const fechaHoyStr = format(new Date(), 'dd/MM/yyyy');
  const nombre = nombreCliente.trim() || 'Estimado cliente';

  const equivalenteBolivaresStr = moneda === 'USD'
    ? `(equivalente en Bs.: ${fmtA(totalAlterna)})`
    : `(equivalente en USD: ${fmtA(totalAlterna)})`;

  const notaIndexacion = moneda === 'VES'
    ? `*Protección de pago en Bs.:* Aunque el préstamo esté calculado en Bolívares (Bs.), todas las cuotas futuras están indexadas a su valor base en Dólares ($ USD) para evitar pérdidas por depreciación. Si cancelas en Bolívares, se calculará al tipo de cambio oficial del BCV vigente en la fecha exacta de tu pago.`
    : `*Nota:* Todas las cuotas se cobran en Dólares ($ USD). Si se efectúa el pago en Bolívares (Bs.), se liquidará a la tasa oficial del BCV en la fecha exacta de tu pago.`;

  const whatsappMessage = encodeURIComponent(
    `Hola ${nombre}, los datos de tu solicitud de préstamo son:\n\n` +
    `• Monto del préstamo: ${fmtP(monto)}\n` +
    `• Plazo de pago: ${diasTotales} días\n` +
    `• Intereses Generados: ${fmtP(interes)}\n` +
    `• Total a cobrar: ${fmtP(totalPagar)} ${equivalenteBolivaresStr}\n\n` +
    `*Cuotas de pago (base en USD):*\n` +
    `${cuotasDetalleTexto}\n\n` +
    `• Tasa del dólar BCV hoy: Bs. ${parseFloat(tasaBCV).toFixed(2)}\n` +
    `• Fecha de hoy: ${fechaHoyStr}\n\n` +
    `${notaIndexacion}`
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const crearImagenCotizacion = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1450;
    const context = canvas.getContext('2d');
    const padding = 86;

    context.fillStyle = '#f8fafc';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#2563eb';
    context.fillRect(0, 0, canvas.width, 230);
    context.fillStyle = '#ffffff';
    context.font = '700 48px Arial';
    context.fillText('PRGARCÍA', padding, 92);
    context.font = '400 28px Arial';
    context.fillText('Cotización de Préstamo', padding, 142);
    context.font = '400 22px Arial';
    context.fillText(`Cliente: ${nombre} · ${fechaHoyStr}`, padding, 190);

    context.fillStyle = '#0f172a';
    context.font = '700 30px Arial';
    context.fillText('Resumen de Cotización', padding, 300);

    const lines = [
      ['Monto del préstamo', fmtP(monto)],
      ['Plazo de pago', `${diasTotales} días (${numeroCuotas} cuotas)`],
      ['Intereses Generados', fmtP(interes)],
      ['Total a cobrar', `${fmtP(totalPagar)} (≈ ${fmtA(totalAlterna)})`],
      ['Tasa BCV del día', `Bs. ${parseFloat(tasaBCV).toFixed(2)} por USD`],
    ];

    lines.forEach(([label, text], index) => {
      const y = 360 + index * 90;
      context.fillStyle = '#64748b';
      context.font = '400 22px Arial';
      context.fillText(label, padding, y);
      context.fillStyle = '#0f172a';
      context.font = '700 26px Arial';
      context.fillText(text, padding, y + 35);
      context.strokeStyle = '#e2e8f0';
      context.beginPath();
      context.moveTo(padding, y + 55);
      context.lineTo(canvas.width - padding, y + 55);
      context.stroke();
    });

    context.fillStyle = '#64748b';
    context.font = '400 20px Arial';
    context.fillText('Nota: Los montos en Bs. cambian según la tasa oficial BCV del día del pago.', padding, 1180);
    context.fillText('PRGARCÍA · Soluciones Financieras Venezuela', padding, 1340);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'cotizacion-prgarcia.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'Cotización PRGARCÍA', files: [file] });
    } else {
      const link = document.createElement('a');
      link.download = file.name;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
    setImagenPreparada(true);
    setTimeout(() => setImagenPreparada(false), 2200);
  };

  const guardarCotizacion = () => {
    const saved = onSaveQuote?.();
    if (saved) {
      setCotizacionGuardada(true);
      setTimeout(() => setCotizacionGuardada(false), 2200);
    }
  };

  const esUSD = moneda === 'USD';

  return (
    <div className="currency-results space-y-3 animate-fade-in">

      {/* Aviso de moneda */}
      {esUSD && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <Info size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            <strong>Préstamo en USD:</strong> El capital debe liquidarse en dólares.
            Los intereses pueden pagarse en Bs. a la tasa BCV del día de pago
            (hoy: <span className="font-mono">Bs. {parseFloat(tasaBCV).toFixed(2)}</span>).
          </p>
        </div>
      )}

      {!esUSD && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
          <Info size={13} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <strong>Protección cambiaria (VES):</strong> Aunque la cotización sea en Bolívares, todas las cuotas futuras quedan indexadas a su valor base en Dólares (<span className="font-mono">{formatearMoneda(cuotaAlterna, 'USD')} USD</span>) al cambio BCV del día (hoy: <span className="font-mono">Bs. {parseFloat(tasaBCV).toFixed(2)}</span>) para evitar pérdidas por depreciación.
          </p>
        </div>
      )}

      <Divider label="Plazo" />

      {/* Días y cuotas */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Stat
          label="Días totales"
          value={`${diasTotales}`}
          alt="días exactos"
          accent="gray"
        />
        <Stat
            label={`Cuotas (${frecLabels[frecuenciaPago]})`}
          value={`${numeroCuotas}`}
          alt={`pago c/ cuota`}
          accent="gray"
        />
      </div>

      <Divider label="Resumen financiero" />

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Stat
          label="Capital prestado"
          value={fmtP(monto)}
          alt={`≈ ${fmtConverted(monto, moneda, monedaAlterna)}`}
          accent="gray"
        />
        <Stat
          label="Ganancia por intereses"
          value={fmtP(interes)}
          alt={`≈ ${fmtA(interesAlterna ?? interes)}`}
          highlight
          accent="green"
        />
      </div>

      <div className="result-card compact-result-card">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Rendimiento total</span>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-mono text-3xl font-semibold text-gain-600 dark:text-gain-500">{pct}%</span>
          <span className="text-xs text-gray-400">sobre el capital</span>
        </div>
      </div>

      {/* Total a pagar */}
      <div className="result-card border-l-4 border-l-brand-600">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total a cobrar</span>
        <span className="result-value text-brand-600 dark:text-brand-500 block">{fmtP(totalPagar)}</span>
        <span className="result-alt">≈ {fmtA(totalAlterna ?? totalPagar)}</span>
      </div>

      <Divider label="Por cuota" />

      {/* Monto por cuota */}
      <div className="result-card border-l-4 border-l-brand-600 space-y-1.5">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          Desglose de Cuotas ({frecLabels[frecuenciaPago]})
        </span>

        {resultado.tieneCuotaRemanente ? (
          <div className="space-y-1 mt-1">
            <div className="flex items-baseline justify-between text-xs sm:text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                Cuotas 1 a {numeroCuotas - 1} ({resultado.diasPrimeraCuota} días c/u):
              </span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                {fmtP(montoCuota)}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs sm:text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                Cuota final ({resultado.diasUltimaCuota} días remanentes):
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {fmtP(cuotaFinal)}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800 italic">
              * Calculado estrictamente por días exactos ({resultado.diasUltimaCuota}d transcurridos). Sin cobranza de días no devengados.
            </p>
          </div>
        ) : (
          <div>
            <span className="font-mono text-2xl font-semibold text-brand-600 dark:text-brand-500 block mt-1">
              {fmtP(montoCuota)} <span className="text-xs font-normal text-gray-500">/ cuota</span>
            </span>
            <span className="result-alt block">
              {numeroCuotas} cuotas iguales de {resultado.diasPrimeraCuota} días exactos
            </span>
          </div>
        )}

        <span className="result-alt block pt-1 border-t border-gray-100 dark:border-gray-800">
          ≈ {fmtA(cuotaAlterna ?? montoCuota)} en moneda alternada
        </span>
      </div>

      <div className="space-y-2.5 pt-3">
        {/* Botón WhatsApp - Acción Principal */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.004 3.67 3.747-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>Enviar por WhatsApp</span>
        </a>

        {/* Acciones Secundarias en Grid 2 Cols */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={guardarCotizacion}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-brand-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
          >
            <Save size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="truncate">{cotizacionGuardada ? 'Guardada' : 'Guardar'}</span>
          </button>

          <button
            type="button"
            onClick={crearImagenCotizacion}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-brand-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
          >
            {imagenPreparada ? <Share2 size={16} className="text-emerald-600 shrink-0" /> : <Download size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />}
            <span className="truncate">{imagenPreparada ? 'Compartida' : 'Compartir imagen'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
