
import React from 'react';
import { Database, Clock, RefreshCw, AlertTriangle, Activity, LucideIcon } from 'lucide-react';

interface EventCountCardProps {
  title: string;
  count: number;
  icon: string;
  variant?: 'default' | 'destructive' | 'warning';
}

export const EventCountCard: React.FC<EventCountCardProps> = ({ 
  title, 
  count, 
  icon, 
  variant = 'default' 
}) => {
  const baseClasses = "flex flex-col items-center justify-center p-2 rounded-md";
  
  let variantClasses = "bg-accent/10";
  if (variant === 'destructive') {
    variantClasses = "bg-destructive/10 text-destructive dark:bg-destructive/20";
  } else if (variant === 'warning') {
    variantClasses = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/30";
  }
  
  const getIcon = () => {
    switch (icon) {
      case 'database':
        return <Database className="h-3 w-3" />;
      case 'clock':
        return <Clock className="h-3 w-3" />;
      case 'refresh':
        return <RefreshCw className="h-3 w-3" />;
      case 'alert-triangle':
        return <AlertTriangle className="h-3 w-3" />;
      case 'activity':
      default:
        return <Activity className="h-3 w-3" />;
    }
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-center gap-1 text-xs font-medium">
        {getIcon()}
        <span>{title}</span>
      </div>
      <span className="text-xl font-bold">{count}</span>
    </div>
  );
};

export default EventCountCard;
