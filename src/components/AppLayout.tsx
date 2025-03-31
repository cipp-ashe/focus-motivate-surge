
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  const location = useLocation();
  
  // Add console log to help diagnose routing issues
  React.useEffect(() => {
    console.log('AppLayout: Route changed to', location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 w-full">
        <main className="flex-1 w-full pb-16 md:pb-0">
          <div className="container mx-auto px-4 py-4">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {isMobile && <BottomNav />}
    </div>
  );
};

export default AppLayout;
