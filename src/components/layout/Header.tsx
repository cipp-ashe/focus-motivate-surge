
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, HomeIcon, ListTodo, Notebook, ActivitySquare } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary' : 'text-muted-foreground hover:text-primary';
  };
  
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span>TaskTimer</span>
          </Link>
        </div>
        
        <nav className="flex space-x-6">
          <Link to="/" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/')}`}>
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/tasks" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/tasks')}`}>
            <ListTodo className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link to="/timer" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/timer')}`}>
            <Clock className="h-4 w-4" />
            <span>Timer</span>
          </Link>
          <Link to="/notes" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/notes')}`}>
            <Notebook className="h-4 w-4" />
            <span>Notes</span>
          </Link>
          <Link to="/habits" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/habits')}`}>
            <ActivitySquare className="h-4 w-4" />
            <span>Habits</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
