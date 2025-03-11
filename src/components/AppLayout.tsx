
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
  
  // Add debug logging
  console.log("AppLayout rendering with path:", location.pathname);
  console.log("Theme state:", { isDark, mounted });
  
  // Only hide header on the main dashboard page
  const showHeader = location.pathname !== '/';
  
  // Apply theme class to document when component mounts and whenever isDark changes
  useEffect(() => {
    if (!mounted) return;
    
    console.log("Theme mounted, applying isDark:", isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
  }, [isDark, mounted]);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      {showHeader && <Header />}
      <main className={`container mx-auto ${isMobile ? 'max-w-full p-2' : 'max-w-5xl p-4'}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
