
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>FlowTime</span>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={cn("font-medium", 
              isActive('/') && "text-primary"
            )}
          >
            Home
          </Link>
          <Link 
            to="/tasks" 
            className={cn("font-medium", 
              isActive('/tasks') && "text-primary"
            )}
          >
            Tasks
          </Link>
          <Link 
            to="/timer" 
            className={cn("font-medium", 
              isActive('/timer') && "text-primary"
            )}
          >
            Timer
          </Link>
          <Link 
            to="/settings" 
            className={cn("font-medium", 
              isActive('/settings') && "text-primary"
            )}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};
