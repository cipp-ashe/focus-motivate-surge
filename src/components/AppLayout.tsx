
import React from 'react';
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
  
  // Log theme changes but avoid DOM manipulation
  React.useEffect(() => {
    // Log theme application
    logger.debug('AppLayout', `Theme application: ${theme}`);
    
    // Determine the effective theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    
    logger.debug('AppLayout', `Effective theme: ${effectiveTheme}`);
    
    // Add a class to the document body to disable outlines
    document.body.classList.add('no-outlines');
    
    // Add a style element to disable outlines globally
    const style = document.createElement('style');
    style.innerHTML = `
      .no-outlines, .no-outlines *, .no-outlines *:focus, .no-outlines *:focus-visible {
        outline: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up
      document.body.classList.remove('no-outlines');
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [theme]);
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground focus:outline-none focus-visible:outline-none outline-none">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-background"></div>
      </div>
      <BackgroundDecorations />
      
      {/* Header navigation */}
      <Header />
      
      <div className="flex flex-1 w-full focus:outline-none outline-none">
        {/* Main content */}
        <main className="flex-1 w-full pb-16 md:pb-0 bg-background focus:outline-none focus-visible:outline-none outline-none">
          <div className="relative z-10 container mx-auto px-4 py-4 focus:outline-none outline-none">
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
