
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  icon,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon && (
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
