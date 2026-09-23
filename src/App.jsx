import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Header } from './components/Header';
import { LoanForm } from './components/LoanForm';
import { ResultPanel } from './components/ResultPanel';
import { CronogramaTable } from './components/CronogramaTable';
import { QuoteHistory } from './components/QuoteHistory';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { QuickCalculator } from './components/QuickCalculator';
import { SavedQuotesView } from './components/SavedQuotesView';
import { NavigationTabs } from './components/NavigationTabs';
import { AuthProvider } from './context/AuthContext';
import { simularPrestamo, generarCronograma } from './utils/calculator';

const HOY = format(new Date(), 'yyyy-MM-dd');
const DEFAULTS = {
  nombreCliente:  '',
  monto:         '',
  moneda:        'USD',
  tasa:          '7',
  modalidadTasa: 'quincenal',
  fechaInicio:   HOY,
  fechaFin:      '',
  frecuenciaPago:'quincenal',
  tasaBCV:       '',
};
const DRAFT_KEY = 'prgarcia.loan.draft.v1';
const HISTORY_KEY = 'prgarcia.quotes.history.v1';

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return DEFAULTS;
    const draft = { ...DEFAULTS, ...JSON.parse(saved) };
    if (draft.modalidadTasa === 'mensual') draft.modalidadTasa = 'quincenal';
    if (draft.frecuenciaPago === 'mensual') draft.frecuenciaPago = 'quincenal';
    return draft;
  } catch {
    return DEFAULTS;
  }
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'advanced' | 'saved'
  const [showProfile, setShowProfile] = useState(false);
  const [values, setValues] = useState(loadDraft);
  const [history, setHistory] = useState(loadHistory);

  const currencyColors = values.moneda === 'USD'
    ? {
      '--currency-main': '#2563eb',
      '--currency-dark-accent': '#93c5fd',
      '--currency-soft': '#eff6ff',
      '--currency-border': '#bfdbfe',
    }
    : {
      '--currency-main': '#059669',
      '--currency-dark-accent': '#6ee7b7',
      '--currency-soft': '#ecfdf5',
      '--currency-border': '#a7f3d0',
    };

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  }, [values]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const resultado = useMemo(() => {
    const { monto, tasa, fechaFin, tasaBCV } = values;
    if (!monto || !tasa || !fechaFin || !tasaBCV) return null;
    return simularPrestamo({
      ...values,
      monto:   parseFloat(monto)   || 0,
      tasa:    parseFloat(tasa)    || 0,
      tasaBCV: parseFloat(tasaBCV) || 0,
    });
  }, [values]);

  const cronograma = useMemo(() => generarCronograma(resultado), [resultado]);

  const guardarCotizacion = () => {
    if (!resultado?.valido) return false;
    const item = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      values: { ...values },
      resultado: { ...resultado },
    };
    setHistory(previous => [item, ...previous].slice(0, 30));
    return true;
  };

  const abrirCotizacion = (item) => {
    setValues({ ...DEFAULTS, ...item.values });
    setActiveTab('advanced');
  };

  return (
    <div
      className="currency-app app-canvas min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-300"
      style={currencyColors}
    >
      <Header onOpenProfile={() => setShowProfile(true)} />

      <main className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-9">

        {/* Barra de Navegación por Modos */}
        <NavigationTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          historyCount={history.length}
        />

        {/* 1. MODO CALCULADORA RÁPIDA (CALLE) */}
        {activeTab === 'quick' && (
          <QuickCalculator tasaBCV={values.tasaBCV || 36.5} />
        )}

        {/* 2. MODO SIMULADOR AVANZADO */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start">
              {/* Formulario */}
              <section>
                <div className="page-intro mb-5">
                  <div>
                    <h1 className="currency-accent text-xl font-bold leading-tight transition-colors duration-300">
                      Simulador Avanzado de Préstamo
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Interés simple · Días reales · Doble moneda USD / VES
                    </p>
                  </div>
                  <span className="workspace-badge">Modo Avanzado</span>
                </div>

                <div className="currency-panel rounded-2xl border bg-white dark:bg-gray-900/50 p-5 shadow-sm backdrop-blur">
                  <LoanForm values={values} onChange={handleChange} />
                </div>
              </section>

              {/* Resultados */}
              <aside className="mt-6 lg:mt-0 lg:sticky lg:top-20">
                <div className="mb-4 hidden lg:block">
                  <h2 className="currency-accent text-base font-bold transition-colors duration-300">Resumen</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Resultados en tiempo real</p>
                </div>

                <div className="currency-panel rounded-2xl border bg-white dark:bg-gray-900/50 p-5 shadow-sm backdrop-blur">
                  <div className="lg:hidden mb-4">
                    <h2 className="currency-accent text-base font-bold transition-colors duration-300">Resumen</h2>
                  </div>
                  <ResultPanel resultado={resultado} nombreCliente={values.nombreCliente} onSaveQuote={guardarCotizacion} />
                </div>
              </aside>
            </div>

            {/* Cronograma de pagos */}
            <CronogramaTable resultado={resultado} cronograma={cronograma} />
          </div>
        )}

        {/* 3. MODO MIS COTIZACIONES GUARDADAS */}
        {activeTab === 'saved' && (
          <SavedQuotesView
            items={history}
            onOpen={abrirCotizacion}
            onDelete={(id) => setHistory(prev => prev.filter(item => item.id !== id))}
            onClear={() => setHistory([])}
          />
        )}

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            PRGARCÍA · Soluciones de préstamo · Propuestas sujetas a validación.
            Verifica la tasa BCV en{' '}
            <a href="https://www.bcv.org.ve" target="_blank" rel="noopener noreferrer"
               className="underline hover:text-brand-600 transition-colors">bcv.org.ve</a>
          </p>
        </footer>

      </main>

      <AuthModal />
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        totalQuotes={history.length}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
