
import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean = true) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const trapElement = trapRef.current;
    
    // Find all focusable elements within the trap
    const focusableElements = trapElement.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus the first element when the trap is activated
    firstElement.focus();
    
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
    };
  }, [isActive]);

  return trapRef;
};
