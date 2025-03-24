
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { HeaderNav } from '@/components/navigation/HeaderNav';
import { MobileNav } from '@/components/navigation/MobileNav';

export const TaskHeader = () => {
  return (
    <header className="border-b border-theme-medium bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 text-gradient-purple">
            <Clock className="h-5 w-5 text-primary" />
            <span>FlowTime</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <HeaderNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default TaskHeader;
