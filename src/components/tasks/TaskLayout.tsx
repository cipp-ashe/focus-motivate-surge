
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { logger } from '@/utils/logManager';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Debug the theme in TaskLayout
    logger.debug('TaskLayout', 'Component mounted');
    logger.debug('TaskLayout', 'Current theme:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    logger.debug('TaskLayout', 'Computed background color:', 
      window.getComputedStyle(document.documentElement).getPropertyValue('--background'));
    
    // More debugging of actual element styles
    const taskLayoutEl = document.querySelector('.task-layout-debug');
    if (taskLayoutEl) {
      const computedStyle = window.getComputedStyle(taskLayoutEl);
      logger.debug('TaskLayout', 'Element computed background:', computedStyle.backgroundColor);
    }
  }, []);
  
  // Different layout for mobile vs desktop
  if (isMobile) {
    return (
      <div className="task-layout-debug min-h-screen w-full py-2 px-2 transition-colors duration-300 bg-background text-foreground">
        <div className="space-y-4 w-full">
          {/* Mobile: Stack vertically with compact spacing */}
          <div className="w-full glass-effect rounded-xl shadow-glass border-primary/10 transform transition-all duration-300 hover:shadow-primary/10 max-h-[40vh] overflow-hidden">
            <div className="overflow-x-hidden w-full">
              {asideContent}
            </div>
          </div>
          <div className="w-full transform transition-all duration-300 pb-20 overflow-hidden">
            {mainContent}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="task-layout-debug min-h-screen w-full py-8 px-4 sm:px-6 transition-colors duration-300 bg-background text-foreground"
         style={{ backgroundColor: 'hsl(var(--background))' }}>
      <div className="max-w-5xl mx-auto space-y-8 w-full">
        <div className="w-full glass-effect rounded-xl shadow-glass border-primary/10 transform transition-all duration-300 hover:shadow-primary/10 max-h-[50vh] overflow-hidden">
          <div className="overflow-x-hidden w-full">
            {asideContent}
          </div>
        </div>
        <div className="w-full transform transition-all duration-300 overflow-hidden">
          {mainContent}
        </div>
      </div>
    </div>
  );
};
