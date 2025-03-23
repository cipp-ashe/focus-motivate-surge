
import { useState } from 'react';

interface UseTransitionProps {
  initialState?: boolean;
}

// This is a simplified version that doesn't use animations
export const useTransition = ({
  initialState = false,
}: UseTransitionProps = {}) => {
  const [isVisible, setIsVisible] = useState(initialState);
  const [isRendered, setIsRendered] = useState(initialState);

  const show = () => {
    setIsRendered(true);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setIsRendered(false);
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
      opacity: 1,
    },
  };
};
