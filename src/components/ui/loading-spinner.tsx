
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  
  return (
    <div className="flex items-center justify-center w-full">
      <div className={cn(
        "rounded-full border-t-transparent animate-spin",
        sizeClasses[size],
        "border-primary/80",
        className
      )} />
    </div>
  );
};
