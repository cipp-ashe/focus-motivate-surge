
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export const Header = () => {
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
          <Link to="/" className="font-medium">Home</Link>
          <Link to="/tasks" className="font-medium">Tasks</Link>
          <Link to="/timer" className="font-medium">Timer</Link>
          <Link to="/settings" className="font-medium">Settings</Link>
        </nav>
      </div>
    </header>
  );
};
