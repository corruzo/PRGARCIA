import { Calculator, CircleHelp, Moon, Sun, Menu, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { InfoModal } from './InfoModal';
import { UserMenu } from './UserMenu';
import { SidebarMobile } from './SidebarMobile';

export function Header({ activeTab, onChangeTab, onOpenProfile, historyCount = 0 }) {
  const { dark, toggle } = useTheme();
  const [showInfo, setShowInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <header className="app-header sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        
        {/* Marca + Hamburguesa Móvil */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChangeTab?.('calculator')}>
            <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl shadow-md">
              <Calculator size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">PRGARCÍA</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Calculadora de Préstamos · Venezuela</p>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN TOPBAR - Solo visible en Laptops (lg:) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-gray-100/70 dark:bg-gray-900/60 p-1 rounded-xl border border-gray-200/60 dark:border-gray-800">
          <button
            type="button"
            onClick={() => onChangeTab?.('calculator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'calculator'
                ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Calculator size={14} />
            <span>Calculadora</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab?.('saved')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Bookmark size={14} />
            <span>Cotizaciones Guardadas</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Acciones del Sistema */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label="Cómo se calcula"
            title="Cómo se calcula"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <CircleHelp size={18} />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label="Cambiar tema"
            title="Cambiar tema"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-0.5 hidden sm:block" />
          <UserMenu onOpenProfile={onOpenProfile} />
        </div>
      </div>

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
      <SidebarMobile
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        onOpenProfile={onOpenProfile}
        historyCount={historyCount}
      />
    </header>
  );
}
