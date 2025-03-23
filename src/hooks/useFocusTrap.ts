
import { useCallback, useRef } from 'react';

interface UseFocusTrapOptions {
  enabled?: boolean;
}

export const useFocusTrap = ({ enabled = true }: UseFocusTrapOptions = {}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!enabled || !containerRef.current) return [];

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    // Filter out disabled elements
    return elements.filter((el) => {
      return !el.hasAttribute('disabled') && 
        el.getAttribute('aria-hidden') !== 'true' &&
        (el.tabIndex ?? 0) >= 0;
    });
  }, [enabled]);

  // Function to trap focus within the container
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || !containerRef.current || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Trap the focus within the container
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, [enabled, getFocusableElements]);

  return {
    ...containerRef,
    getFocusableElements,
    handleKeyDown
  };
};

export default useFocusTrap;
