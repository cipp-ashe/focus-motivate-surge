
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
    <header className="border-b border-border/40 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 text-gradient-purple">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>FlowTime</span>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={cn("font-medium transition-colors", 
              isActive('/') ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}
          >
            Home
          </Link>
          <Link 
            to="/tasks" 
            className={cn("font-medium transition-colors", 
              isActive('/tasks') ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}
          >
            Tasks
          </Link>
          <Link 
            to="/timer" 
            className={cn("font-medium transition-colors", 
              isActive('/timer') ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}
          >
            Timer
          </Link>
          <Link 
            to="/settings" 
            className={cn("font-medium transition-colors", 
              isActive('/settings') ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};
