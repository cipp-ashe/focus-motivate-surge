
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { useThemeDebug } from '@/hooks/theme/useThemeDebug';
import { useTheme } from '@/components/theme-provider';
import { logger } from '@/utils/logManager';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Use the theme debug hook
  useThemeDebug('TaskLayout');
  
  // Force theme consistency on this component
  useEffect(() => {
    logger.debug('TaskLayout', `Current theme: ${theme}`);
    
    // Verify theme application
    const layoutElements = document.querySelectorAll('.task-layout-debug');
    layoutElements.forEach(el => {
      const computed = window.getComputedStyle(el);
      logger.debug('TaskLayout', 
        `Element background: ${computed.backgroundColor}, color: ${computed.color}`);
    });
  }, [theme]);
  
  // Different layout for mobile vs desktop
  if (isMobile) {
    return (
      <div className="task-layout-debug min-h-screen w-full py-2 px-2 bg-background text-foreground">
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
    <div className="task-layout-debug min-h-screen w-full py-8 px-4 sm:px-6 bg-background text-foreground">
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
