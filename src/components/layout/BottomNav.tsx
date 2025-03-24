
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListTodo, BookOpen, Settings, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleDropdown = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-theme-medium p-2 z-50 md:hidden bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2",
            isActive('/') ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        {/* Tasks Dropdown */}
        <DropdownMenu open={openCategory === 'tasks'} onOpenChange={() => toggleDropdown('tasks')}>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex flex-col items-center p-2 appearance-none bg-transparent border-none",
                location.pathname.startsWith('/tasks') || location.pathname === '/timer' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <ListTodo className="h-5 w-5" />
              <span className="text-xs mt-1 flex items-center">
                Tasks
                {openCategory === 'tasks' ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-48 mt-2 z-50 bg-background border border-border/40"
            style={{ marginBottom: '60px' }}
          >
            {NAV_CATEGORIES.tasks.items.map(item => (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notes Dropdown */}
        <DropdownMenu open={openCategory === 'notes'} onOpenChange={() => toggleDropdown('notes')}>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex flex-col items-center p-2 appearance-none bg-transparent border-none",
                location.pathname.startsWith('/notes') || location.pathname === '/voice-notes' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs mt-1 flex items-center">
                Notes
                {openCategory === 'notes' ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-48 mt-2 z-50 bg-background border border-border/40"
            style={{ marginBottom: '60px' }}
          >
            {NAV_CATEGORIES.notes.items.map(item => (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Settings Dropdown */}
        <DropdownMenu open={openCategory === 'settings'} onOpenChange={() => toggleDropdown('settings')}>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex flex-col items-center p-2 appearance-none bg-transparent border-none",
                location.pathname.startsWith('/settings') || location.pathname === '/habits' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1 flex items-center">
                Settings
                {openCategory === 'settings' ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-48 mt-2 z-50 bg-background border border-border/40"
            style={{ marginBottom: '60px' }}
          >
            {NAV_CATEGORIES.settings.items.map(item => (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
