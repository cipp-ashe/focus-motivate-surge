
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';
import { logger } from '@/utils/logManager';
import { useThemeDebug } from '@/hooks/theme/useThemeDebug';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  
  // Use the theme debug hook to consistently log theme information
  useThemeDebug('AppLayout');
  
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
