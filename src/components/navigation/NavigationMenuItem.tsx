
import React from 'react';
import { LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationMenuItemProps {
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
  showLabel?: boolean;
  className?: string;
}

export const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  icon: Icon,
  label,
  isOpen,
  isActive,
  onClick,
  showLabel = true,
  className
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {showLabel && (
        <span className="flex items-center">
          {label}
          {isOpen ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
        </span>
      )}
    </button>
  );
};
