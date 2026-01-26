import { useEffect, useState } from 'react';
import darkIcon from '../../assets/cineclub/dark/theme-toggle.webp';
import lightIcon from '../../assets/cineclub/light/theme-toggle.webp';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'cremunaflix-theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

/**
 * Toggles light and dark themes using a data-theme attribute.
 */
const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.sessionStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Ativar modo ${nextTheme === 'dark' ? 'escuro' : 'claro'}`}
      title={`Alternar para modo ${nextTheme === 'dark' ? 'escuro' : 'claro'}`}
    >
      <img src={theme === 'dark' ? darkIcon : lightIcon} alt="" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
