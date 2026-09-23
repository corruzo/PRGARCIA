import { useCallback, useMemo, useState } from 'react';

export const USER_PREFS_KEY = 'prgarcia.user.preferences';

export const DEFAULT_USER_PREFERENCES = {
  tasaDiaria: '7',
  tasaSemanal: '7',
  tasaMensual: '7',
  frecuenciaPago: 'quincenal',
};

function safeReadPreferences() {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;

  try {
    const raw = localStorage.getItem(USER_PREFS_KEY);
    if (!raw) return DEFAULT_USER_PREFERENCES;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

function safeWritePreferences(value) {
  if (typeof window === 'undefined') return value;
  localStorage.setItem(USER_PREFS_KEY, JSON.stringify(value));
  return value;
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(() => safeReadPreferences());

  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      return safeWritePreferences(next);
    });
  }, []);

  const savePreferences = useCallback((nextPrefs) => {
    const merged = { ...DEFAULT_USER_PREFERENCES, ...nextPrefs };
    setPreferences(merged);
    safeWritePreferences(merged);
    return merged;
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_USER_PREFERENCES);
    safeWritePreferences(DEFAULT_USER_PREFERENCES);
    return DEFAULT_USER_PREFERENCES;
  }, []);

  const preferenceMap = useMemo(() => ({
    tasaDiaria: preferences.tasaDiaria,
    tasaSemanal: preferences.tasaSemanal,
    tasaMensual: preferences.tasaMensual,
    frecuenciaPago: preferences.frecuenciaPago === 'mensual' ? 'quincenal' : preferences.frecuenciaPago,
  }), [preferences]);

  return {
    preferences,
    preferenceMap,
    updatePreference,
    savePreferences,
    resetPreferences,
  };
}
