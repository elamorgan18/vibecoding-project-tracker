import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../data/model.js';
import { useLocalStorage } from './useLocalStorage.js';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Light / dark mode. Until the user picks one, the app follows the system
 * preference (and keeps following it if that changes). Once they toggle,
 * their choice is saved to localStorage and wins from then on.
 *
 * The `dark` class goes on <html>, which is what Tailwind's
 * `darkMode: 'class'` and the `.dark` colour variables look for.
 * index.html applies the same rule before the first paint.
 *
 * @returns {[boolean, () => void]} [isDark, toggle]
 */
export function useTheme() {
  const [saved, setSaved] = useLocalStorage(STORAGE_KEYS.theme, null);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (e) => setSystemDark(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const isDark = saved ? saved === 'dark' : systemDark;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, () => setSaved(isDark ? 'light' : 'dark')];
}
