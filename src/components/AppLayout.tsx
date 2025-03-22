
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';
import { logger } from '@/utils/logManager';
import { useThemeDebug } from '@/hooks/theme/useThemeDebug';
import { useTheme } from '@/components/theme-provider';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  const { theme } = useTheme();
  
  // Use the theme debug hook to consistently log theme information
  useThemeDebug('AppLayout');
  
  // Force theme application on mount and update
  useEffect(() => {
    // Determine the effective theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    
    // Force the theme class on document elements
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(effectiveTheme);
    
    // Set the color-scheme property directly
    document.documentElement.style.colorScheme = effectiveTheme;
    
    // Log theme application
    logger.debug('AppLayout', `Forcing theme application: ${theme} (effective: ${effectiveTheme})`);
    
    // Additional check to verify CSS variables are applied
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
    logger.debug('AppLayout', `Background variable: ${bgColor}`);
    
    // Force a refresh of backgrounds after a short delay
    const timeoutId = setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        // Trigger a repaint by briefly changing a property
        mainElement.classList.add('theme-refresh');
        setTimeout(() => mainElement.classList.remove('theme-refresh'), 10);
      }
    }, 50);
    
    // Force all SVGs to inherit color in dark mode
    if (effectiveTheme === 'dark') {
      const style = document.createElement('style');
      style.id = 'dark-mode-svg-fix';
      style.innerHTML = `
        .dark svg:not([class*="text-"]) { color: inherit !important; }
        .dark *[class*="border-"] { border-color: hsl(var(--border)) !important; }
        .dark input, .dark select, .dark textarea { background-color: hsl(var(--card)) !important; color: hsl(var(--foreground)) !important; }
        .dark button { color: inherit !important; }
      `;
      document.head.appendChild(style);
    } else {
      const existingStyle = document.getElementById('dark-mode-svg-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [theme]);
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      {/* Header navigation */}
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Main content */}
        <main className="flex-1 w-full pb-16 md:pb-0 bg-background">
          <div className="relative z-10 container mx-auto px-4 py-4">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default AppLayout;
