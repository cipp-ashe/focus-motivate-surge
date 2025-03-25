
import React from 'react';
import { cn } from '@/lib/utils';

interface EfficiencyGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const EfficiencyGauge: React.FC<EfficiencyGaugeProps> = ({
  value,
  size = 'md',
  showValue = true,
  className,
}) => {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate the angle based on the value (0-100)
  const angle = (safeValue / 100) * 180;
  
  // Determine color based on value
  const getColor = () => {
    if (safeValue < 30) return 'text-red-500 dark:text-red-400';
    if (safeValue < 70) return 'text-amber-500 dark:text-amber-400';
    return 'text-green-500 dark:text-green-400';
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: 'w-20 h-10',
    md: 'w-32 h-16',
    lg: 'w-40 h-20',
  };
  
  // Determine font size for the value
  const valueSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Background arc */}
        <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-full w-full rounded-t-full border-8 border-b-0 border-muted dark:border-gray-700"></div>
        </div>
        
        {/* Colored arc based on value */}
        <div 
          className="absolute bottom-0 left-0 h-full overflow-hidden"
          style={{ 
            width: '100%', 
            transform: `rotate(${angle - 180}deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-full w-full rounded-t-full border-8 border-b-0",
              getColor()
            )}
          ></div>
        </div>
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 h-[90%] w-0.5 bg-foreground dark:bg-white" 
          style={{ 
            transform: `translateX(-50%) rotate(${angle - 90}deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-foreground dark:bg-white"></div>
        </div>
      </div>
      
      {/* Value label */}
      {showValue && (
        <div className={cn("mt-2 text-center font-medium", valueSizeClasses[size])}>
          <span className={getColor()}>{Math.round(safeValue)}%</span>
          <span className="text-muted-foreground dark:text-gray-400"> efficiency</span>
        </div>
      )}
    </div>
  );
};
