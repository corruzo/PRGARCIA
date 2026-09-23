import { Calculator, CircleHelp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { InfoModal } from './InfoModal';
import { UserMenu } from './UserMenu';

export function Header({ onOpenProfile }) {
  const { dark, toggle } = useTheme();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="app-header sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl">
            <Calculator size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">PRGARCÍA</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Calculadora de Préstamos · Venezuela</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => setShowInfo(true)} aria-label="Ver cómo se calcula el préstamo" title="Cómo se calcula" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
            <CircleHelp size={18} />
          </button>
          <button type="button" onClick={toggle} aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'} title={dark ? 'Modo claro' : 'Modo oscuro'} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-0.5" />
          <UserMenu onOpenProfile={onOpenProfile} />
        </div>
      </div>
      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
    </header>
  );
}
