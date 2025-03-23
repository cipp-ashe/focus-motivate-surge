
import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive?: boolean;
  autoFocus?: boolean;
  returnFocus?: boolean;
  disableOutlines?: boolean;
}

export const useFocusTrap = ({
  isActive = true,
  autoFocus = true,
  returnFocus = true,
  disableOutlines = true
}: UseFocusTrapOptions = {}) => {
  const trapRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const trapElement = trapRef.current;
    
    // Find all focusable elements within the trap
    const focusableElements = trapElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store current active element to return focus later
    if (returnFocus) {
      previousFocusedElement.current = document.activeElement as HTMLElement;
    }
    
    // Apply no-outline styles to all focusable elements
    if (disableOutlines) {
      focusableElements.forEach(el => {
        el.style.outline = 'none';
        el.style.boxShadow = 'none';
      });
    }
    
    // Focus the first element when the trap is activated (only if autoFocus is true)
    if (autoFocus) {
      firstElement.focus({ preventScroll: true });
      if (disableOutlines) {
        firstElement.style.outline = 'none';
        firstElement.style.boxShadow = 'none';
      }
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Disable outlines on tab
      if (disableOutlines && event.key === 'Tab') {
        setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.style.outline = 'none';
            document.activeElement.style.boxShadow = 'none';
          }
        }, 0);
      }
      
      if (event.key !== 'Tab') return;
      
      // Prevent regular tab behavior
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        if (disableOutlines) {
          lastElement.style.outline = 'none';
          lastElement.style.boxShadow = 'none';
        }
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        if (disableOutlines) {
          firstElement.style.outline = 'none';
          firstElement.style.boxShadow = 'none';
        }
      }
    };
    
    // Add event listener for tab key to trap focus
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element when the trap is deactivated
      if (returnFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
        previousFocusedElement.current.focus();
        if (disableOutlines && previousFocusedElement.current) {
          previousFocusedElement.current.style.outline = 'none';
          previousFocusedElement.current.style.boxShadow = 'none';
        }
      }
    };
  }, [isActive, autoFocus, returnFocus, disableOutlines]);

  return trapRef;
};
