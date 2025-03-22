
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';
import { logger } from '@/utils/logManager';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  
  useEffect(() => {
    // Debug theme application
    logger.debug('AppLayout', 'Component mounted');
    logger.debug('AppLayout', 'Theme class on HTML:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    logger.debug('AppLayout', 'Root element background:', document.documentElement.style.backgroundColor);
  }, []);
  
  return (
    <div 
      className="flex flex-col min-h-screen w-full bg-background text-foreground transition-colors duration-300"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      {/* Header navigation */}
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Main content */}
        <main 
          className="flex-1 w-full pb-16 md:pb-0 bg-background"
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
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
