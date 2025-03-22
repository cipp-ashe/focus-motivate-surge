
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
    // Force the theme class on body and html
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      theme);
      
    // Log theme application
    logger.debug('AppLayout', `Forcing theme application: ${theme}`);
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
      <BottomNav />
    </div>
  );
};

export default AppLayout;
