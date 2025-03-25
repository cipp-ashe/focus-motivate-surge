
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthStatus } from '@/components/auth/AuthStatus';
import { HeaderNav } from '@/components/navigation/HeaderNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="font-bold text-xl text-slate-800 dark:text-white">
            Focus Notes
          </Link>
        </div>
        
        <HeaderNav />
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
};
