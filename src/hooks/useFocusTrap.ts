
import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  autoFocus?: boolean;
  returnFocusOnUnmount?: boolean;
  preventScroll?: boolean;
  disableOutline?: boolean;
  enabled?: boolean;
}

export const useFocusTrap = (options: FocusTrapOptions = {}) => {
  const {
    autoFocus = false,
    returnFocusOnUnmount = false,
    preventScroll = true,
    disableOutline = true,
    enabled = true
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Add a method to get focusable elements for testing
  const getFocusableElements = () => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

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
    if (disableOutline) {
      applyNoOutlineStyles();
    }
    
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
    let observer: MutationObserver | null = null;
    if (disableOutline) {
      observer = new MutationObserver(applyNoOutlineStyles);
      observer.observe(container, { childList: true, subtree: true });
    }
    
    // Basic focus handling if needed
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      
      if (focusableElements.length) {
        focusableElements[0].focus({ preventScroll });
        if (disableOutline) {
          focusableElements[0].style.outline = 'none';
          focusableElements[0].style.boxShadow = 'none';
        }
      }
    }
    
    // Simplified tab handler that just disables outlines
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && disableOutline) {
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
      if (observer) observer.disconnect();
      
      // Return focus if configured
      if (returnFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll });
      }
    };
  }, [autoFocus, returnFocusOnUnmount, preventScroll, disableOutline, enabled]);
  
  // Return the ref directly and add the getFocusableElements method
  return Object.assign(containerRef, {
    getFocusableElements
  });
};

export default useFocusTrap;
