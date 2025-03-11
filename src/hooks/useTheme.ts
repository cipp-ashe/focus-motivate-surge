
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
    
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    console.log("Theme initialization - saved theme:", savedTheme);
    
    if (savedTheme === 'dark' || !savedTheme) {
      // Apply dark theme by default or if explicitly set
      document.documentElement.classList.add('dark');
      setTheme('dark');
      setIsDark(true);
    } else {
      // Apply light theme if saved
      document.documentElement.classList.remove('dark');
      setTheme('light');
      setIsDark(false);
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const userTheme = localStorage.getItem('theme');
      if (!userTheme) {
        // Only apply system preference if user hasn't explicitly chosen
        const systemPrefersDark = mediaQuery.matches;
        setIsDark(systemPrefersDark);
        setTheme(systemPrefersDark ? 'dark' : 'light');
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme, mounted]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    console.log("Theme changed:", isDark ? "dark" : "light");
    
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
