
import React, { ReactNode, useEffect } from 'react';
import { logger } from '@/utils/logManager';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Debug theme in dashboard layout
    logger.debug('DashboardLayout', 'Component mounted');
    logger.debug('DashboardLayout', 'Theme class on HTML:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    
    // Try to understand computed background values
    const computedStyle = window.getComputedStyle(document.documentElement);
    logger.debug('DashboardLayout', 'Computed --background CSS variable:', 
      computedStyle.getPropertyValue('--background'));
  }, []);
  
  return (
    <div className="dashboard-debug min-h-screen w-full py-4 sm:py-8 px-2 sm:px-6 relative overflow-hidden bg-background text-foreground transition-colors duration-300"
         style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/10 rounded-full filter blur-3xl opacity-40 dark:opacity-20 animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-purple-500/10 rounded-full filter blur-3xl opacity-30 dark:opacity-15" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] right-[15%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-violet-400/10 rounded-full filter blur-3xl opacity-20 dark:opacity-10" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
