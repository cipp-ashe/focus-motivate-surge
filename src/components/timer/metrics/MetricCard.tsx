
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <div 
      className={cn(
        "rounded-lg border border-border/40 p-4 shadow-sm bg-background/50 dark:bg-gray-800/50 backdrop-blur-sm", 
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            {value}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              <span 
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  trend.isPositive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
