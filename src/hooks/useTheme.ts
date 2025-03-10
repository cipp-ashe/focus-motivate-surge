
import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  const [isDark, setIsDark] = useState(false);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if theme exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme state
    const initialIsDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialIsDark);
    setTheme(initialIsDark ? 'dark' : 'light');
  }, [setTheme]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  }, [isDark, setTheme]);

  return {
    isDark,
    toggleTheme: () => setIsDark(prev => !prev)
  };
};
