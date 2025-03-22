
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
      const bgVar = computedStyle.getPropertyValue('--background').trim();
      logger.debug(componentName, 'CSS Variables:');
      logger.debug(componentName, '  --background:', bgVar);
      logger.debug(componentName, '  --foreground:', computedStyle.getPropertyValue('--foreground').trim());
      
      // Log actual computed colors
      logger.debug(componentName, 'Computed background:', window.getComputedStyle(html).backgroundColor);
      logger.debug(componentName, 'color-scheme:', computedStyle.colorScheme);
      
      // Check for theme application
      const htmlBg = window.getComputedStyle(html).backgroundColor;
      const bodyBg = window.getComputedStyle(body).backgroundColor;
      const rootBg = root ? window.getComputedStyle(root).backgroundColor : 'N/A';
      
      // Log all applied styles
      logger.debug(componentName, 'Applied Styles:');
      logger.debug(componentName, '  HTML background:', htmlBg);
      logger.debug(componentName, '  BODY background:', bodyBg);
      logger.debug(componentName, '  ROOT background:', rootBg);
      
      // Check for transparency issues (common theme bug)
      const isTransparent = (color: string) => color === 'rgba(0, 0, 0, 0)' || color === 'transparent';
      if (isTransparent(htmlBg) && isTransparent(bodyBg) && isTransparent(rootBg)) {
        logger.warn(componentName, 'THEME WARNING: All containers have transparent backgrounds!');
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
