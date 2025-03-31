
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelType } from '@/contexts/ui/PanelContext';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  panelType?: PanelType;
  className?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Panel({
  children,
  title,
  isOpen,
  onClose,
  panelType,
  className,
  position = 'right',
  size = 'md',
}: PanelProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'w-[300px]',
    md: 'w-[400px]',
    lg: 'w-[600px]',
    full: 'w-full'
  };

  return (
    <div
      className={cn(
        'fixed top-0 bottom-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out',
        position === 'right' ? 'right-0' : 'left-0',
        sizeClasses[size],
        isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full',
        className
      )}
      data-panel-type={panelType}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
            <span className="sr-only">Close panel</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Test data for the panel
export function PanelDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Panel</Button>
      <Panel isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Panel">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Panel Content</h3>
          <p>This is an example of panel content that can be used throughout the application.</p>
        </div>
      </Panel>
    </div>
  );
}
