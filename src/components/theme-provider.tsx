
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

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

  // Apply theme to document element and handle system preference
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove existing theme classes
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      body.classList.add(systemTheme);
      return;
    }

    // Apply theme class to both root and body elements
    root.classList.add(theme);
    body.classList.add(theme);
    
    // Also set data-theme attribute for components that use it
    root.setAttribute('data-theme', theme);
    
    // Store theme preference
    localStorage.setItem(storageKey, theme);
  }, [theme, attribute, enableSystem, storageKey]);

  // Listen for system theme changes and update if using system theme
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        const body = window.document.body;
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        
        root.classList.remove("light", "dark");
        body.classList.remove("light", "dark");
        
        root.classList.add(systemTheme);
        body.classList.add(systemTheme);
        root.setAttribute('data-theme', systemTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem, theme]);

  // Force an initial theme check on mount with a stronger approach
  useEffect(() => {
    // Apply theme immediately on mount
    const root = window.document.documentElement;
    const body = window.document.body;
    
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    let themeToApply = defaultTheme;
    
    if (savedTheme) {
      themeToApply = savedTheme;
    } else if (enableSystem) {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    
    root.classList.add(themeToApply);
    body.classList.add(themeToApply);
    root.setAttribute('data-theme', themeToApply);
    
    // Update state if different
    if (theme !== themeToApply) {
      setTheme(themeToApply);
    }

    // Force a repaint to ensure theme is applied
    document.body.style.display = 'none';
    setTimeout(() => {
      document.body.style.display = '';
    }, 0);
  }, []);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
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
