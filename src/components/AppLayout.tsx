
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './layout/Header';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDark, mounted } = useTheme();
  const isMobile = useIsMobile();
  
  // Only hide header on the main dashboard page
  const showHeader = location.pathname !== '/';
  
  // Apply theme class to document when component mounts and whenever isDark changes
  useEffect(() => {
    if (!mounted) return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-30" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-violet-400/10 rounded-full filter blur-3xl opacity-20" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      </div>
      
      {showHeader && <Header />}
      
      <main className={`relative z-10 ${isMobile ? 'max-w-full px-3 py-3 pb-20' : 'max-w-5xl mx-auto px-5 py-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
