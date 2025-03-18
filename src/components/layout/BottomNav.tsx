
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ListTodo, 
  Clock, 
  Image, 
  BookOpen, 
  Mic, 
  Settings, 
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const BottomNav = () => {
  const location = useLocation();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isInCategory = (category: string, paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 p-2 z-50 md:hidden">
      <div className="flex items-center justify-between">
        {/* Home Button */}
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-colors",
            isActive('/') ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
          onClick={() => setOpenCategory(null)}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        {/* Tasks Category */}
        <div className="relative">
          <Collapsible open={openCategory === 'tasks'}>
            <CollapsibleTrigger asChild>
              <button 
                onClick={() => toggleCategory('tasks')}
                className={cn(
                  "flex flex-col items-center p-2 rounded-md transition-colors",
                  (openCategory === 'tasks' || isInCategory('tasks', ['/tasks', '/timer', '/screenshots'])) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <ListTodo className="h-6 w-6" />
                <span className="text-xs mt-1 flex items-center">
                  Tasks
                  {openCategory === 'tasks' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background rounded-md border shadow-lg p-1 w-36">
              <div className="flex flex-col space-y-1">
                <Link 
                  to="/tasks" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/tasks') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <ListTodo className="h-4 w-4" />
                  <span className="text-sm">Task Page</span>
                </Link>
                <Link 
                  to="/timer" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/timer') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Timer</span>
                </Link>
                <Link 
                  to="/screenshots" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/screenshots') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Screenshots</span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Notes Category */}
        <div className="relative">
          <Collapsible open={openCategory === 'notes'}>
            <CollapsibleTrigger asChild>
              <button 
                onClick={() => toggleCategory('notes')}
                className={cn(
                  "flex flex-col items-center p-2 rounded-md transition-colors",
                  (openCategory === 'notes' || isInCategory('notes', ['/notes', '/voice-notes'])) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-xs mt-1 flex items-center">
                  Notes
                  {openCategory === 'notes' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background rounded-md border shadow-lg p-1 w-36">
              <div className="flex flex-col space-y-1">
                <Link 
                  to="/notes" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/notes') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Journal</span>
                </Link>
                <Link 
                  to="/voice-notes" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/voice-notes') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Mic className="h-4 w-4" />
                  <span className="text-sm">Voice Notes</span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Settings Category */}
        <div className="relative">
          <Collapsible open={openCategory === 'settings'}>
            <CollapsibleTrigger asChild>
              <button 
                onClick={() => toggleCategory('settings')}
                className={cn(
                  "flex flex-col items-center p-2 rounded-md transition-colors",
                  (openCategory === 'settings' || isInCategory('settings', ['/settings', '/habits'])) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs mt-1 flex items-center">
                  Settings
                  {openCategory === 'settings' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background rounded-md border shadow-lg p-1 w-36">
              <div className="flex flex-col space-y-1">
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/settings') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </Link>
                <Link 
                  to="/habits" 
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive('/habits') ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Habits</span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </nav>
  );
};
