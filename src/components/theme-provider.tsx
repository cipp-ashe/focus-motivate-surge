
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { logger } from "@/utils/logManager";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  // Apply theme to document element with better debug logging
  const applyTheme = React.useCallback((newTheme: Theme) => {
    logger.debug('ThemeProvider', `Applying theme: ${newTheme}`);
    
    const root = window.document.documentElement;
    
    // Start by removing all theme classes
    root.classList.remove("light", "dark");
    
    // Calculate effective theme (accounting for system preference if needed)
    let effectiveTheme = newTheme;
    
    if (newTheme === "system" && enableSystem) {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      logger.debug('ThemeProvider', `System preference detected: ${effectiveTheme}`);
    }
    
    // Apply the theme class
    root.classList.add(effectiveTheme);
    
    // Force color-scheme property both on html element and as a CSS variable
    root.style.colorScheme = effectiveTheme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Apply to body as well for extra certainty
    document.body.classList.remove("light", "dark");
    document.body.classList.add(effectiveTheme);
    
    // Store theme preference
    localStorage.setItem(storageKey, newTheme);
    
    logger.debug('ThemeProvider', `Theme applied: ${effectiveTheme}`);
    
    // Log computed variables to help debugging
    if (typeof window !== 'undefined') {
      const computedStyle = window.getComputedStyle(document.documentElement);
      const bgVar = computedStyle.getPropertyValue('--background').trim();
      const fgVar = computedStyle.getPropertyValue('--foreground').trim();
      logger.debug('ThemeProvider', `CSS Variables - background: ${bgVar}, foreground: ${fgVar}`);
    }
  }, [enableSystem, storageKey]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem, theme, applyTheme]);

  // Initial theme application on mount
  useEffect(() => {
    // Apply theme immediately 
    const savedTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    applyTheme(savedTheme);
    
    // If saved theme is different from state, update state
    if (theme !== savedTheme) {
      setTheme(savedTheme);
    }
    
    logger.debug('ThemeProvider', `Initial theme applied: ${savedTheme}`);
    
    // Force a re-check after a brief delay to catch any race conditions
    const timeoutId = setTimeout(() => {
      applyTheme(savedTheme);
      logger.debug('ThemeProvider', 'Forced re-check of theme application');
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      logger.debug('ThemeProvider', `Setting theme to: ${newTheme}`);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
