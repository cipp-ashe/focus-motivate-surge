
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-yellow-300" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
