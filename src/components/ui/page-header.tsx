
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, description, icon: Icon, className }: PageHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <header className={cn("mb-6", className)}>
      <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient-purple">
        {Icon && <Icon className="h-8 w-8 text-purple-500" />}
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {description}
        </p>
      )}
    </header>
  );
}
