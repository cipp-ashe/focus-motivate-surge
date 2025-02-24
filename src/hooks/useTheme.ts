
import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, [isDark, setTheme]);

  return {
    isDark,
    toggleTheme: () => setIsDark(prev => !prev)
  };
};
