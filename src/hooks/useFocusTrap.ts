
import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  autoFocus?: boolean;
  returnFocusOnUnmount?: boolean;
  preventScroll?: boolean;
  disableOutline?: boolean; // New option to disable outline
}

export const useFocusTrap = (options: FocusTrapOptions = {}) => {
  const {
    autoFocus = false, // Default to false to prevent auto focusing
    returnFocusOnUnmount = false, // Default to false to prevent focus return
    preventScroll = true,
    disableOutline = true // Default to true to disable outline
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save the currently focused element to restore later if needed
    if (returnFocusOnUnmount) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    
    const container = containerRef.current;
    if (!container) return;

    // If disableOutline is true, add a class to disable outlines
    if (disableOutline) {
      container.classList.add('focus-trap-no-outline');
      const style = document.createElement('style');
      style.innerHTML = `
        .focus-trap-no-outline, 
        .focus-trap-no-outline * {
          outline: none !important;
          box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Focus handling can be kept minimal if not needed
    if (!autoFocus) {
      return;
    }
    
    // Simplified focus handling that doesn't trap but doesn't cause outlines
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Allow tabbing but prevent outlines if configured
        if (disableOutline) {
          requestAnimationFrame(() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.style.outline = 'none';
              document.activeElement.style.boxShadow = 'none';
            }
          });
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus if configured
      if (returnFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll });
      }
      
      // Remove the style element if it was added
      if (disableOutline) {
        const styleElement = document.querySelector('style');
        if (styleElement && styleElement.innerHTML.includes('focus-trap-no-outline')) {
          styleElement.remove();
        }
      }
    };
  }, [autoFocus, returnFocusOnUnmount, preventScroll, disableOutline]);
  
  return containerRef;
};
