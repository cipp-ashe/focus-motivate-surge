
import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive?: boolean;
  autoFocus?: boolean;
  returnFocus?: boolean;
}

export const useFocusTrap = ({
  isActive = true,
  autoFocus = true,
  returnFocus = true
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
    
    // Focus the first element when the trap is activated (only if autoFocus is true)
    if (autoFocus) {
      firstElement.focus({ preventScroll: true });
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      // Prevent regular tab behavior
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    
    // Add event listener for tab key to trap focus
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element when the trap is deactivated
      if (returnFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
        previousFocusedElement.current.focus();
      }
    };
  }, [isActive, autoFocus, returnFocus]);

  return trapRef;
};
