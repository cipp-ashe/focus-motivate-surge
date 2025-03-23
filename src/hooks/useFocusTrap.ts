
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

    // Always apply our no-outline styles
    const applyNoOutlineStyles = () => {
      // Find all focusable elements
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      
      // Apply no-outline styles to all of them
      focusable.forEach(el => {
        el.style.outline = 'none';
        el.style.boxShadow = 'none';
        el.setAttribute('data-no-focus-outline', 'true');
      });
      
      // Also apply to the container itself
      container.style.outline = 'none';
      container.style.boxShadow = 'none';
    };
    
    // Apply styles immediately
    applyNoOutlineStyles();
    
    // Add global no-outline styles
    if (disableOutline) {
      const style = document.createElement('style');
      style.id = 'focus-trap-no-outline-styles';
      style.innerHTML = `
        *[data-no-focus-outline], 
        *[data-no-focus-outline]:focus, 
        *[data-no-focus-outline]:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `;
      if (!document.getElementById('focus-trap-no-outline-styles')) {
        document.head.appendChild(style);
      }
    }
    
    // Add mutation observer to apply styles to dynamically added elements
    const observer = new MutationObserver(applyNoOutlineStyles);
    observer.observe(container, { childList: true, subtree: true });
    
    // Basic focus handling if needed
    if (autoFocus) {
      const focusableElements = [...container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )];
      
      if (focusableElements.length) {
        focusableElements[0].focus({ preventScroll });
        focusableElements[0].style.outline = 'none';
        focusableElements[0].style.boxShadow = 'none';
      }
    }
    
    // Simplified tab handler that just disables outlines
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.style.outline = 'none';
            document.activeElement.style.boxShadow = 'none';
          }
        }, 0);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      
      // Return focus if configured
      if (returnFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll });
      }
    };
  }, [autoFocus, returnFocusOnUnmount, preventScroll, disableOutline]);
  
  return containerRef;
};
