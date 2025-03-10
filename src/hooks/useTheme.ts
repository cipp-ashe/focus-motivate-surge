
import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (!mounted) return;
    
    // Check if theme exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme state
    const initialIsDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialIsDark);
    setTheme(initialIsDark ? 'dark' : 'light');
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
