
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
  
  // Immediate theme application on page load
  useEffect(() => {
    // Force immediate theme application without transitions
    document.documentElement.style.transition = 'none';
    document.body.style.transition = 'none';
    
    // Forcefully disable outlines
    const style = document.createElement('style');
    style.id = 'outline-reset';
    style.innerHTML = `
      * { outline: none !important; }
      *.dark { outline: none !important; }
      *.light { outline: none !important; }
      [class*="border"] { border-style: solid !important; }
      .card, .border { border-style: solid !important; }
    `;
    document.head.appendChild(style);
    
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
    logger.debug('AppLayout', `Immediate theme application: ${theme} (effective: ${effectiveTheme})`);
    
    // Additional check to verify CSS variables are applied
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
    logger.debug('AppLayout', `Background variable: ${bgColor}`);
    
    // Re-enable transitions after a small delay
    setTimeout(() => {
      document.documentElement.style.transition = '';
      document.body.style.transition = '';
    }, 100);
    
    // Force all SVGs to inherit color in dark mode
    if (effectiveTheme === 'dark') {
      const style = document.createElement('style');
      style.id = 'dark-mode-svg-fix';
      style.innerHTML = `
        .dark svg:not([class*="text-"]) { color: inherit !important; }
        .dark *[class*="border-"] { border-color: hsl(var(--border) / 0.05) !important; border-style: solid !important; }
        .dark .card, .dark .border { border-color: hsl(var(--border) / 0.05) !important; border-style: solid !important; }
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
    
    return () => {
      // Clean up when component unmounts
      const outlineReset = document.getElementById('outline-reset');
      if (outlineReset) {
        outlineReset.remove();
      }
    };
  }, [theme]);
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground" style={{ outline: 'none' }}>
      {/* Background decorative elements - with immediate visibility */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ outline: 'none' }}>
        <div className="absolute inset-0 bg-background" style={{ outline: 'none' }}></div>
      </div>
      <BackgroundDecorations />
      
      {/* Header navigation */}
      <Header />
      
      <div className="flex flex-1 w-full" style={{ outline: 'none' }}>
        {/* Main content */}
        <main className="flex-1 w-full pb-16 md:pb-0 bg-background" style={{ outline: 'none' }}>
          <div className="relative z-10 container mx-auto px-4 py-4" style={{ outline: 'none' }}>
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
