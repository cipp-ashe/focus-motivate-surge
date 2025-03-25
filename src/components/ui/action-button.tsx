
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  iconClassName?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  title?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  className,
  variant = 'outline',
  iconClassName,
  size = 'sm',
  disabled = false,
  title
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn("flex items-center", className)}
      disabled={disabled}
      title={title}
    >
      <Icon className={cn("h-4 w-4", label && "mr-2", iconClassName)} />
      {label && <span>{label}</span>}
    </Button>
  );
};
