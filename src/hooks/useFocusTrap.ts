
import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  autoFocus?: boolean;
  returnFocusOnUnmount?: boolean;
  preventScroll?: boolean;
}

export const useFocusTrap = (options: FocusTrapOptions = {}) => {
  const {
    autoFocus = true,
    returnFocusOnUnmount = true,
    preventScroll = true
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

    // Store the original tabIndex values to restore them later
    const originalTabIndices = new Map<Element, string | null>();
    
    // Add container to tab order if not already focusable
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
    }
    
    // Find all normally focusable elements
    const focusableElements = container.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Make all elements outside the container not focusable
    const allFocusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    allFocusableElements.forEach(el => {
      if (!container.contains(el)) {
        originalTabIndices.set(el, el.getAttribute('tabindex'));
        el.setAttribute('tabindex', '-1');
      }
    });
    
    // Handle focus transfer on tab press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElementsArray = Array.from(focusableElements) as HTMLElement[];
        
        if (focusableElementsArray.length === 0) return;
        
        const firstElement = focusableElementsArray[0];
        const lastElement = focusableElementsArray[focusableElementsArray.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus({ preventScroll });
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus({ preventScroll });
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Initial focus - delay to allow any animations to complete
    if (autoFocus) {
      setTimeout(() => {
        const firstFocusable = focusableElements[0] as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus({ preventScroll });
        } else {
          container.focus({ preventScroll });
        }
      }, 50);
    }
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      // Restore original tabindex values
      allFocusableElements.forEach(el => {
        if (!container.contains(el)) {
          const originalValue = originalTabIndices.get(el);
          if (originalValue === null) {
            el.removeAttribute('tabindex');
          } else if (originalValue !== undefined) {
            el.setAttribute('tabindex', originalValue);
          }
        }
      });
      
      // Return focus to previously focused element
      if (returnFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll });
      }
    };
  }, [autoFocus, returnFocusOnUnmount, preventScroll]);
  
  return containerRef;
};
