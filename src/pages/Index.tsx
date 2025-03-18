
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  ListTodo,
  BookOpen, 
  Timer, 
  Settings,
  CalendarCheck,
  Activity,
  Image,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      {/* Header section with simple, non-marketing language */}
      <DashboardHeader 
        title="TaskTimer Dashboard"
        description="Organize tasks, track habits, and manage your work sessions"
      />
      
      {/* Main feature cards - preserving original functionality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Tasks section with prominent Timer and Screenshots buttons */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-primary/20 p-2 md:p-3 rounded-full">
              <ListTodo className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1 text-sm">
              <Link to="/tasks">View Tasks</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Tasks</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Manage your daily tasks with optional timers, checklists, and more.
          </p>
          
          {/* Highlighted Timer and Screenshots buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Link to="/timer">
                <Timer className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">Timer</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-blue-400/10 hover:bg-blue-400/20 border-blue-400/30 text-blue-500 dark:text-blue-300">
              <Link to="/screenshots">
                <Image className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">Screenshots</span>
              </Link>
            </Button>
          </div>
          
          <Button asChild variant="default" size="sm" className="w-full rounded-md bg-primary/90 hover:bg-primary">
            <Link to="/tasks" className="flex items-center justify-center">
              View All Tasks <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        
        {/* Notes section */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-[#9b87f5]/20 p-2 md:p-3 rounded-full">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#9b87f5]" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#9b87f5]/80 hover:bg-[#9b87f5]/10 px-2 py-1 text-sm">
              <Link to="/notes">View Notes</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Notes</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Record written notes or voice memos for your ideas and thoughts.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/notes">
                <BookOpen className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Journal
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/voice-notes">
                <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Voice Notes
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Configuration section (Habits & Settings combined) */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-amber-400/20 p-2 md:p-3 rounded-full">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-amber-500" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-amber-500 hover:text-amber-500/80 hover:bg-amber-500/10 px-2 py-1 text-sm">
              <Link to="/habits">View Config</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Configuration</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Customize your habits and preferences to optimize your workflow.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/habits">
                <Activity className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Habits
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/settings">
                <Settings className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Info section about local storage - helping users understand persistence */}
      <div className="mb-6">
        <div className="glass-card p-4 md:p-5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full">
              <Settings className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Your Data is Stored Locally</h3>
              <p className="text-muted-foreground text-sm mb-3">
                TaskTimer saves your data to your browser's local storage. Visit the settings page to export your data or adjust preferences.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
                <Link to="/settings" className="flex items-center gap-1">
                  Settings <Settings className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* More compact quick access section */}
      <div className="mb-8">
        <h3 className="text-md md:text-lg font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary/70" />
          Quick Access
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          <Link to="/tasks" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-primary/5 p-2">
            <div className="bg-primary/10 rounded-full p-2 mb-1.5">
              <ListTodo className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium">Tasks</span>
          </Link>
          
          <Link to="/timer" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-[#9b87f5]/5 p-2">
            <div className="bg-[#9b87f5]/10 rounded-full p-2 mb-1.5">
              <Timer className="w-3.5 h-3.5 text-[#9b87f5]" />
            </div>
            <span className="text-xs font-medium">Timer</span>
          </Link>
          
          <Link to="/habits" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-amber-400/5 p-2">
            <div className="bg-amber-400/10 rounded-full p-2 mb-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xs font-medium">Habits</span>
          </Link>
          
          <Link to="/screenshots" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-blue-400/5 p-2">
            <div className="bg-blue-400/10 rounded-full p-2 mb-1.5">
              <Image className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-medium">Screenshots</span>
          </Link>
          
          <Link to="/notes" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-green-400/5 p-2">
            <div className="bg-green-400/10 rounded-full p-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-green-400" />
            </div>
            <span className="text-xs font-medium">Notes</span>
          </Link>
          
          <Link to="/voice-notes" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-rose-400/5 p-2">
            <div className="bg-rose-400/10 rounded-full p-2 mb-1.5">
              <Mic className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span className="text-xs font-medium">Voice</span>
          </Link>
          
          <Link to="/settings" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-gray-400/5 p-2">
            <div className="bg-gray-400/10 rounded-full p-2 mb-1.5">
              <Settings className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-xs font-medium">Settings</span>
          </Link>
          
          <Link to="/tasks" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-cyan-400/5 p-2">
            <div className="bg-cyan-400/10 rounded-full p-2 mb-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <span className="text-xs font-medium">Today</span>
          </Link>
        </div>
      </div>
      
      {/* Simple footer */}
      <DashboardFooter
        linkTo="/tasks"
        text="Go to Tasks"
      />
    </DashboardLayout>
  );
};

export default Index;
