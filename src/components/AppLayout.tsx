
import React, { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, CalendarCheck, Timer, BookHeart, ScrollText, Image, Mic, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(1024);
  const content = children || <Outlet />;
  
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-1">
        {/* Navigation sidebar */}
        <nav className="hidden md:flex flex-col w-14 bg-background border-r border-border">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" className="p-2 hover:bg-accent rounded-md transition-colors" title="Home">
              <Home className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/tasks" className="p-2 hover:bg-accent rounded-md transition-colors" title="Tasks">
              <CalendarCheck className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/timer" className="p-2 hover:bg-accent rounded-md transition-colors" title="Timer">
              <Timer className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/habits" className="p-2 hover:bg-accent rounded-md transition-colors" title="Habits">
              <BookHeart className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/notes" className="p-2 hover:bg-accent rounded-md transition-colors" title="Notes">
              <ScrollText className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/screenshots" className="p-2 hover:bg-accent rounded-md transition-colors" title="Screenshots">
              <Image className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/voice-notes" className="p-2 hover:bg-accent rounded-md transition-colors" title="Voice Notes">
              <Mic className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link to="/settings" className="p-2 hover:bg-accent rounded-md transition-colors" title="Settings">
              <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </nav>
        
        {/* Mobile bottom navigation */}
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
        
        {/* Main content */}
        <main className="flex-1 pb-16 md:pb-0">
          <div className="relative z-10 container mx-auto px-4 py-4">
            {content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
