import { useState, useEffect } from 'react';
import { getThemeFromStorage, getSystemTheme, applyTheme, setThemeInStorage } from '@/lib/theme';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference, then default to light
    const savedTheme = getThemeFromStorage();
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Check system preference
    return getSystemTheme() === 'dark';
  });

  useEffect(() => {
    applyTheme(isDark ? 'dark' : 'light');
    setThemeInStorage(isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = getThemeFromStorage();
      if (!savedTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
  };

  return {
    theme: isDark ? 'dark' : 'light',
    isDark,
    toggleTheme,
    setTheme
  };
};
