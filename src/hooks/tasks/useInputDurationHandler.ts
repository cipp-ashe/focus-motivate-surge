
import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface InputDurationHandlerProps {
  editingTaskId: string | null;
  taskId: string;
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const useInputDurationHandler = ({
  editingTaskId,
  taskId,
  inputValue,
  onChange,
  onBlur,
  onKeyDown,
}: InputDurationHandlerProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  
  useEffect(() => {
    if (editingTaskId === taskId) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, taskId]);

  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    onKeyDown(e);
  };

  const handleLocalBlur = () => {
    let finalValue = localInputValue;
    if (finalValue === '' || isNaN(parseInt(finalValue, 10))) {
      finalValue = '25';
    } else {
      const numValue = parseInt(finalValue, 10);
      finalValue = Math.min(Math.max(numValue, 1), 60).toString();
    }
    
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  return { 
    localInputValue, 
    handleLocalChange, 
    handleLocalKeyDown, 
    handleLocalBlur 
  };
};
