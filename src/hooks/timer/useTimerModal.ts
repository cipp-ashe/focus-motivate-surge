
import { useState, useCallback } from 'react';

export const useTimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openTimerModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const closeTimerModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  return {
    isOpen,
    openTimerModal,
    closeTimerModal,
    setIsOpen
  };
};
