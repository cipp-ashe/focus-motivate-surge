
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavigationMenuItem } from './NavigationMenuItem';

export interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

interface NavigationDropdownProps {
  category: string;
  icon: LucideIcon;
  label: string;
  items: NavItem[];
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  isActiveItem: (path: string) => boolean;
  showLabel?: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  category,
  icon,
  label,
  items,
  isOpen,
  isActive,
  onToggle,
  isActiveItem,
  showLabel = true,
  position = 'top',
  className
}) => {
  // Add a handler to close the dropdown when an item is clicked
  const handleItemClick = (onToggle: () => void) => {
    // Close the dropdown by calling onToggle if it's open
    if (isOpen) {
      setTimeout(() => onToggle(), 50);
    }
  };

  return (
    <div className="relative">
      <Collapsible open={isOpen}>
        <CollapsibleTrigger asChild>
          <NavigationMenuItem
            icon={icon}
            label={label}
            isOpen={isOpen}
            isActive={isActive}
            onClick={onToggle}
            showLabel={showLabel}
            className={className}
          />
        </CollapsibleTrigger>
        <CollapsibleContent 
          className={cn(
            "absolute bg-background rounded-md border shadow-lg p-1 w-36 z-50 left-1/2 -translate-x-1/2",
            position === 'top' ? "top-full mt-2" : "bottom-full mb-2"
          )}
        >
          <div className="flex flex-col space-y-1">
            {items.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  isActiveItem(item.path) 
                    ? "bg-secondary/70 text-foreground font-medium" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleItemClick(onToggle)}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

