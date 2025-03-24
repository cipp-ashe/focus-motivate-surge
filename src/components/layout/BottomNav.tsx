
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListTodo, Timer, Settings, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { NAV_CATEGORIES } from '@/components/navigation/navigationConfig';

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-theme-medium p-2 z-50 md:hidden bg-background/90 backdrop-blur-md">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex flex-col items-center p-2 appearance-none bg-transparent border-none",
                isActive('/settings') && "text-primary"
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-xs mt-1">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-16 z-50 bg-background border border-border/40">
            {Object.values(NAV_CATEGORIES).flatMap(category => 
              category.items.map(item => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
