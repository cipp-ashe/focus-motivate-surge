
import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  const [isDark, setIsDark] = useState(true); // Default to dark
  const [mounted, setMounted] = useState(false);
  
  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (!mounted) return;
    
    // Force dark theme by default
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    setTheme('dark');
    setIsDark(true);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') !== 'light') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
        setTheme('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme, mounted]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  }, [isDark, setTheme, mounted]);

  return {
    isDark,
    toggleTheme: () => setIsDark(prev => !prev),
    mounted
  };
};
