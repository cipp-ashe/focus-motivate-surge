
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ListTodo, Timer, Settings } from 'lucide-react';

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t p-2 z-50 md:hidden">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex flex-col items-center p-2">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/tasks" className="flex flex-col items-center p-2">
          <ListTodo className="h-5 w-5" />
          <span className="text-xs mt-1">Tasks</span>
        </Link>
        
        <Link to="/timer" className="flex flex-col items-center p-2">
          <Timer className="h-5 w-5" />
          <span className="text-xs mt-1">Timer</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center p-2">
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
