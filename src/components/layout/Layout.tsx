
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-2 pb-16' : 'px-4 pb-6'}`}>
        <div className="container-fancy mx-auto py-4">
          <Outlet />
        </div>
        
        {/* Background decoration elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[10%] w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-30" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
          <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-violet-400/10 rounded-full filter blur-3xl opacity-20" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
