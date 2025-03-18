
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
  Image
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
        {/* Tasks section */}
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
          <div className={cn(
            "grid gap-2 mt-auto",
            isMobile ? "grid-cols-2" : "grid-cols-2"
          )}>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/tasks">
                <ListTodo className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Tasks
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/timer">
                <Timer className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Timer
              </Link>
            </Button>
          </div>
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
        
        {/* Habits & Screenshots section */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-amber-400/20 p-2 md:p-3 rounded-full">
              <CalendarCheck className="w-5 h-5 md:w-6 md:h-6 text-amber-500" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-amber-500 hover:text-amber-500/80 hover:bg-amber-500/10 px-2 py-1 text-sm">
              <Link to="/habits">View Habits</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Habits & Work</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Track daily habits and capture work progress with screenshots.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/habits">
                <Activity className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Habits
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50 text-xs md:text-sm">
              <Link to="/screenshots">
                <Image className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Screenshots
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
      
      {/* Quick access section with task type tabs restoration */}
      <div className="mb-8">
        <h3 className="text-md md:text-lg font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary/70" />
          Quick Access
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/tasks" className="glass-card p-3 md:p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:bg-primary/5">
            <div className="bg-primary/10 rounded-full p-2.5 mb-2">
              <ListTodo className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-medium text-sm">Tasks</h3>
          </Link>
          
          <Link to="/timer" className="glass-card p-3 md:p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:bg-[#9b87f5]/5">
            <div className="bg-[#9b87f5]/10 rounded-full p-2.5 mb-2">
              <Timer className="w-4 h-4 text-[#9b87f5]" />
            </div>
            <h3 className="font-medium text-sm">Timer</h3>
          </Link>
          
          <Link to="/habits" className="glass-card p-3 md:p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:bg-amber-400/5">
            <div className="bg-amber-400/10 rounded-full p-2.5 mb-2">
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-medium text-sm">Habits</h3>
          </Link>
          
          <Link to="/screenshots" className="glass-card p-3 md:p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:bg-blue-400/5">
            <div className="bg-blue-400/10 rounded-full p-2.5 mb-2">
              <Image className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-medium text-sm">Screenshots</h3>
          </Link>
        </div>
      </div>
      
      {/* Using DashboardCardGrid for additional organization if needed */}
      <div className="mb-8">
        <DashboardCardGrid />
      </div>
      
      {/* Simple footer with no marketing language */}
      <DashboardFooter
        linkTo="/tasks"
        text="Go to Tasks"
      />
    </DashboardLayout>
  );
};

export default Index;
