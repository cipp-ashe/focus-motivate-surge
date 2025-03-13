
import React, { useState, useEffect } from 'react';

interface InputDurationHandlerProps {
  editingTaskId: string | null;
  taskId: string;
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputDurationHandler: React.FC<InputDurationHandlerProps> = ({
  editingTaskId,
  taskId,
  inputValue,
  onChange,
  onBlur,
  onKeyDown,
}) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  
  useEffect(() => {
    if (editingTaskId === taskId) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, taskId]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    } as React.ChangeEvent<HTMLInputElement>;
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
