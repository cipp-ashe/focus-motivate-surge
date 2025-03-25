
import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-6 space-y-3",
      className
    )}>
      {icon && (
        <div className="rounded-full bg-muted/20 p-3 mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground/90">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-[20rem]">{description}</p>
      )}
      {action && (
        <div className="pt-2">{action}</div>
      )}
    </div>
  );
};
