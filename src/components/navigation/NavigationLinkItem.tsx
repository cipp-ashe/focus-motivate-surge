
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationLinkItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  showLabel?: boolean;
  className?: string;
}

export const NavigationLinkItem: React.FC<NavigationLinkItemProps> = ({
  to,
  icon: Icon,
  label,
  isActive,
  showLabel = true,
  className
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {showLabel && <span>{label}</span>}
    </Link>
  );
};
