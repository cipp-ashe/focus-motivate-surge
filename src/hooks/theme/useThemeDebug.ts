
import { useEffect } from 'react';
import { logger } from '@/utils/logManager';

export const useThemeDebug = (componentName: string) => {
  useEffect(() => {
    const logThemeInfo = () => {
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');
      
      logger.debug(componentName, '=== Theme Debug Info ===');
      logger.debug(componentName, 'Classes on HTML:', html.className);
      logger.debug(componentName, 'Current theme:', html.classList.contains('dark') ? 'dark' : 'light');
      
      // Log CSS variables
      const computedStyle = window.getComputedStyle(html);
      logger.debug(componentName, 'CSS Variables:');
      logger.debug(componentName, '  --background:', computedStyle.getPropertyValue('--background'));
      logger.debug(componentName, '  --foreground:', computedStyle.getPropertyValue('--foreground'));
      
      // Log applied styles
      logger.debug(componentName, 'Applied Styles:');
      logger.debug(componentName, '  HTML background:', window.getComputedStyle(html).backgroundColor);
      logger.debug(componentName, '  BODY background:', window.getComputedStyle(body).backgroundColor);
      if (root) {
        logger.debug(componentName, '  ROOT background:', window.getComputedStyle(root).backgroundColor);
      }
    };
    
    // Log immediately and after a slight delay (to catch post-render changes)
    logThemeInfo();
    
    // Also log after styles have had time to be applied
    const timeoutId = setTimeout(() => {
      logger.debug(componentName, '=== Delayed Theme Check ===');
      logThemeInfo();
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [componentName]);
};
