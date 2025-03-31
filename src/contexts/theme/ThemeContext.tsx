
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode; 
  defaultTheme?: Theme;
  storageKey?: string;
}> = ({ 
  children, 
  defaultTheme = 'system', 
  storageKey = 'vite-ui-theme' 
}) => {
  // Use local storage with the provided storage key
  const [theme, setThemeValue] = useLocalStorage<Theme>(storageKey, defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Function to set theme that updates local storage
  const setTheme = (newTheme: Theme) => {
    setThemeValue(newTheme);
    console.log(`Theme changed to: ${newTheme}`);
  };

  useEffect(() => {
    const updateTheme = () => {
      const root = window.document.documentElement;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const activeTheme = theme === 'system' ? systemTheme : theme;
      
      // Clean up previous theme classes
      root.classList.remove('light', 'dark');
      
      // Add the current theme class
      root.classList.add(activeTheme);
      
      // Set dark mode state
      setIsDarkMode(activeTheme === 'dark');
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = { theme, setTheme, isDarkMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
