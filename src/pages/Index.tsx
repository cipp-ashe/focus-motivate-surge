
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
  Sparkles,
  Activity,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      {/* Hero section */}
      <DashboardHeader 
        title="Focus, Motivate, Surge"
        description="Your personal productivity assistant designed to help you accomplish more and stress less"
      />
      
      {/* Main navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Tasks section */}
        <div className="flex flex-col glass-card transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-primary/20 p-2 md:p-3 rounded-full">
              <ListTodo className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1 text-sm">
              <Link to="/tasks">View All</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Tasks & Focus</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Manage your tasks, set timers for focused work sessions, and capture progress with screenshots.
          </p>
          <div className={cn(
            "grid gap-2 mt-auto",
            isMobile ? "grid-cols-2" : "grid-cols-3"
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
            <Button asChild variant="outline" size="sm" className={cn(
              "flex items-center gap-1 bg-background/50 text-xs md:text-sm",
              isMobile && "col-span-2"
            )}>
              <Link to="/screenshots">
                <Image className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Screenshots
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Notes section */}
        <div className="flex flex-col glass-card transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-[#9b87f5]/20 p-2 md:p-3 rounded-full">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#9b87f5]" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#9b87f5]/80 hover:bg-[#9b87f5]/10 px-2 py-1 text-sm">
              <Link to="/notes">View All</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Notes & Thoughts</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Capture your thoughts in written notes or record voice memos for quick idea documentation.
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
        
        {/* Settings section */}
        <div className="flex flex-col glass-card transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 p-4 md:p-6 h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-amber-400/20 p-2 md:p-3 rounded-full">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-amber-500" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-amber-500 hover:text-amber-500/80 hover:bg-amber-500/10 px-2 py-1 text-sm">
              <Link to="/settings">View All</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Habits & Settings</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Track your daily habits and customize your application preferences.
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
      
      {/* Getting started section */}
      <div className="mb-6 md:mb-10">
        <div className="glass-card p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-3 md:p-4 rounded-full">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Start Your Productivity Journey</h3>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                Begin by creating tasks, tracking your habits, or setting up a focused timer session.
                Choose what works best for your workflow right now.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                <Button asChild variant="default" size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-xs md:text-sm">
                  <Link to="/tasks" className="flex items-center gap-1">
                    Create a Task <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10 text-xs md:text-sm">
                  <Link to="/timer" className="flex items-center gap-1">
                    Start Timer <Timer className="h-3 w-3 md:h-3.5 md:w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-muted text-xs md:text-sm">
                  <Link to="/habits" className="flex items-center gap-1">
                    Track Habits <Activity className="h-3 w-3 md:h-3.5 md:w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick access section - more responsive grid */}
      <div className="mb-8 md:mb-12">
        <h3 className="text-md md:text-lg font-medium mb-3 md:mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary/70" />
          Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Link to="/tasks" className="glass-card p-4 md:p-5 rounded-xl flex flex-col items-center text-center transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="bg-primary/10 rounded-full p-3 mb-3">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1 text-sm md:text-base">Today's Tasks</h3>
            <p className="text-xs md:text-sm text-muted-foreground">View and manage your current tasks</p>
          </Link>
          
          <Link to="/timer" className="glass-card p-4 md:p-5 rounded-xl flex flex-col items-center text-center transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="bg-[#9b87f5]/10 rounded-full p-3 mb-3">
              <Timer className="w-5 h-5 text-[#9b87f5]" />
            </div>
            <h3 className="font-medium mb-1 text-sm md:text-base">Focus Timer</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Start a focused work session</p>
          </Link>
          
          <Link to="/screenshots" className="glass-card p-4 md:p-5 rounded-xl flex flex-col items-center text-center transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="bg-amber-400/10 rounded-full p-3 mb-3">
              <Image className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-medium mb-1 text-sm md:text-base">Work Screenshots</h3>
            <p className="text-xs md:text-sm text-muted-foreground">View your captured progress</p>
          </Link>
        </div>
      </div>
      
      {/* Footer with explore more link */}
      <DashboardFooter
        linkTo="/tasks"
        text="Explore Your Dashboard"
      />
    </DashboardLayout>
  );
};

export default Index;
