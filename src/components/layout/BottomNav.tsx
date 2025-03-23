
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListTodo, Timer, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t p-2 z-50 md:hidden bg-background">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2",
            isActive('/') && "text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/tasks" 
          className={cn(
            "flex flex-col items-center p-2",
            isActive('/tasks') && "text-primary"
          )}
        >
          <ListTodo className="h-5 w-5" />
          <span className="text-xs mt-1">Tasks</span>
        </Link>
        
        <Link 
          to="/timer" 
          className={cn(
            "flex flex-col items-center p-2",
            isActive('/timer') && "text-primary"
          )}
        >
          <Timer className="h-5 w-5" />
          <span className="text-xs mt-1">Timer</span>
        </Link>
        
        <Link 
          to="/settings" 
          className={cn(
            "flex flex-col items-center p-2",
            isActive('/settings') && "text-primary"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
