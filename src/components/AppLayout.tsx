
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, CalendarCheck, Timer, BookHeart, ScrollText, Image, Mic, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary' : 'text-muted-foreground hover:text-primary';
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      {/* Header navigation for all devices */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className={`text-xl font-bold flex items-center ${isMobile ? 'gap-1' : 'gap-2'} text-primary`}>
              <Timer className="h-5 w-5" />
              {!isMobile && <span>TaskTimer</span>}
            </Link>
          </div>
          
          <nav className={`flex ${isMobile ? 'space-x-4' : 'space-x-6'}`}>
            <Link to="/" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/')}`} aria-label="Home">
              <Home className="h-5 w-5" />
              {!isMobile && <span>Home</span>}
            </Link>
            <Link to="/tasks" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/tasks')}`} aria-label="Tasks">
              <CalendarCheck className="h-5 w-5" />
              {!isMobile && <span>Tasks</span>}
            </Link>
            <Link to="/timer" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/timer')}`} aria-label="Timer">
              <Timer className="h-5 w-5" />
              {!isMobile && <span>Timer</span>}
            </Link>
            <Link to="/notes" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/notes')}`} aria-label="Notes">
              <ScrollText className="h-5 w-5" />
              {!isMobile && <span>Notes</span>}
            </Link>
            <Link to="/habits" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/habits')}`} aria-label="Habits">
              <BookHeart className="h-5 w-5" />
              {!isMobile && <span>Habits</span>}
            </Link>
            <Link to="/screenshots" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/screenshots')}`} aria-label="Screenshots">
              <Image className="h-5 w-5" />
              {!isMobile && <span>Screenshots</span>}
            </Link>
            <Link to="/voice-notes" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/voice-notes')}`} aria-label="Voice Notes">
              <Mic className="h-5 w-5" />
              {!isMobile && <span>Voice</span>}
            </Link>
            <Link to="/settings" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/settings')}`} aria-label="Settings">
              <Settings className="h-5 w-5" />
              {!isMobile && <span>Settings</span>}
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 pb-16 md:pb-0">
          <div className="relative z-10 container mx-auto px-4 py-4">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Mobile bottom navigation - fixed to bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background z-10">
          <div className="flex justify-around py-2">
            <Link to="/" className="p-2 flex flex-col items-center">
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Home</span>
            </Link>
            <Link to="/tasks" className="p-2 flex flex-col items-center">
              <CalendarCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tasks</span>
            </Link>
            <Link to="/timer" className="p-2 flex flex-col items-center">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Timer</span>
            </Link>
            <Link to="/habits" className="p-2 flex flex-col items-center">
              <BookHeart className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Habits</span>
            </Link>
            <Link to="/notes" className="p-2 flex flex-col items-center">
              <ScrollText className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Notes</span>
            </Link>
            <Link to="/settings" className="p-2 flex flex-col items-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Settings</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
