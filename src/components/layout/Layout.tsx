
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full pb-16 md:pb-0">
        <div className="container mx-auto py-4 px-4 pb-6">
          {children}
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;
