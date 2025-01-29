import { useEffect, useState, useCallback, useRef } from 'react';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

interface UseTransitionOptions {
  duration?: number;
  delay?: number;
  onEnter?: () => void;
  onExit?: () => void;
}

interface TransitionProps {
  style: {
    transition: string;
    opacity: number;
    transform: string;
  };
  'aria-hidden': boolean;
}

interface UseTransitionConfig {
  isVisible: boolean;
  options?: UseTransitionOptions;
}

export const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export function useTransition({ isVisible, options = {} }: UseTransitionConfig) {
  const {
    duration = 300,
    delay = 0,
    onEnter,
    onExit,
  } = options;

  const [state, setState] = useState<TransitionState>(
    isVisible ? 'entered' : 'exited'
  );
  const [isRendered, setIsRendered] = useState(isVisible);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const updateVisibility = useCallback((visible: boolean) => {
    cleanup();

    if (visible) {
      setIsRendered(true);
      timeoutRef.current = setTimeout(() => {
        setState('entering');
        onEnter?.();
        timeoutRef.current = setTimeout(() => {
          setState('entered');
        }, duration);
      }, delay);
    } else {
      setState('exiting');
      onExit?.();
      timeoutRef.current = setTimeout(() => {
        setState('exited');
        setIsRendered(false);
      }, duration);
    }
  }, [duration, delay, onEnter, onExit]);

  useEffect(() => {
    updateVisibility(isVisible);
    return cleanup;
  }, [isVisible, updateVisibility]);

  const getTransitionProps = useCallback((): TransitionProps => {
    const transitionDuration = prefersReducedMotion ? 0 : duration;
    
    return {
      style: {
        transition: transitionDuration === 0 
          ? 'none' 
          : `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
        opacity: state === 'entering' || state === 'entered' ? 1 : 0,
        transform: state === 'entering' || state === 'entered'
          ? 'translateY(0) scale(1)'
          : 'translateY(10px) scale(0.95)',
      },
      'aria-hidden': !isVisible,
    };
  }, [duration, state, isVisible]);

  return {
    state,
    isRendered,
    getTransitionProps,
    updateVisibility,
  };
}