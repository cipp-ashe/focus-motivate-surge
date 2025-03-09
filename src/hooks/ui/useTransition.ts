
import { useState, useEffect } from 'react';

interface UseTransitionProps {
  duration?: number;
  delay?: number;
  initialState?: boolean;
}

export const useTransition = ({
  duration = 300,
  delay = 0,
  initialState = false,
}: UseTransitionProps = {}) => {
  const [isVisible, setIsVisible] = useState(initialState);
  const [isRendered, setIsRendered] = useState(initialState);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (isVisible) {
      setIsRendered(true);
    } else {
      timerId = setTimeout(() => {
        setIsRendered(false);
      }, duration);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isVisible, duration]);

  const show = () => {
    if (isVisible) return;
    
    setIsRendered(true);
    // Small delay to ensure the DOM has been updated before applying the transition
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  };

  const hide = () => {
    if (!isVisible) return;
    
    setIsVisible(false);
  };

  const toggle = () => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  };

  return {
    isVisible,
    isRendered,
    show,
    hide,
    toggle,
    styles: {
      transition: `opacity ${duration}ms, transform ${duration}ms`,
      transitionDelay: `${delay}ms`,
      opacity: isVisible ? 1 : 0,
    },
  };
};
