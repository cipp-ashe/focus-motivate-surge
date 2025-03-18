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
  Mic,
  Tag,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      {/* Header section with simple, non-marketing language */}
      <DashboardHeader 
        title="TaskTimer Dashboard"
        description="Organize tasks, track habits, and manage your work sessions"
      />
      
      {/* Habits Feature Showcase - Now as a hero section at the top */}
      <div className="mb-8 glass-card p-5 md:p-6 bg-gradient-to-br from-amber-50/90 to-transparent dark:from-amber-950/30 dark:to-transparent border border-amber-100 dark:border-amber-800/30 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 bg-amber-400/20 p-3 rounded-full">
            <Activity className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Habit Automation</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Configure once, automate your daily workflow with tasks, timers, and journals
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Sample auto-generated task showcase - Timer task example */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-amber-900/20 dark:to-amber-800/10 rounded-md p-4 border border-dashed border-amber-300/70 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                <Timer className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="text-base font-medium">Morning Workout</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-xs font-medium">habit</span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-primary/70" />
                    <span className="text-xs">fitness</span>
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-500/80" />
                    <span>25 min timer</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sample auto-generated journal task showcase */}
          <div className="bg-gradient-to-r from-green-50 to-green-100/70 dark:from-green-900/20 dark:to-green-800/10 rounded-md p-4 border border-dashed border-green-300/70 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-400/20 flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="text-base font-medium">Daily Reflection</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded text-xs font-medium">journal</span>
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="h-3.5 w-3.5 text-green-500/80" />
                    <span className="text-xs">auto-generated</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional information about habit automation */}
        <div className="bg-white/60 dark:bg-black/5 p-3 rounded-md mb-4 text-sm border border-amber-200/50 dark:border-amber-800/30">
          <p className="text-muted-foreground flex items-start gap-1.5">
            <span className="text-amber-600 dark:text-amber-400 font-medium flex-shrink-0">How it works:</span> 
            <span>Configure habit templates once, and TaskTimer auto-creates tasks based on your schedule with proper tags, timers, and journal entries.</span>
          </p>
        </div>
        
        <Button asChild variant="default" size="sm" className="w-full md:w-auto rounded-md bg-amber-500/90 hover:bg-amber-500 ml-auto flex">
          <Link to="/habits" className="flex items-center justify-center">
            Configure Habits <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
      
      {/* Main feature cards - Three column layout for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* Tasks section with direct action links */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:shadow-md">
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
                <span className="text-xs md:text-sm font-medium">Screenshot</span>
              </Link>
            </Button>
          </div>
          
          <Button asChild variant="default" size="sm" className="w-full rounded-md bg-primary/90 hover:bg-primary">
            <Link to="/tasks" className="flex items-center justify-center">
              All Tasks <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        
        {/* Notes section - simplified with direct links */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/30 dark:to-transparent border border-purple-100 dark:border-purple-800/30 transition-all duration-300 hover:shadow-md">
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
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 border-[#9b87f5]/30 text-[#9b87f5]">
              <Link to="/notes">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">All</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-rose-400/10 hover:bg-rose-400/20 border-rose-400/30 text-rose-500">
              <Link to="/voice-notes">
                <Mic className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">Voice</span>
              </Link>
            </Button>
          </div>
          
          <Button asChild variant="default" size="sm" className="w-full rounded-md bg-[#9b87f5]/90 hover:bg-[#9b87f5]">
            <Link to="/notes" className="flex items-center justify-center">
              Browse Notes <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        
        {/* Settings section - moved from the bottom to be part of the main grid */}
        <div className="flex flex-col glass-card p-4 md:p-6 h-full bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-900/30 dark:to-transparent border border-gray-100 dark:border-gray-800/30 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-2 md:p-3 rounded-full">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1 text-sm">
              <Link to="/settings">View Settings</Link>
            </Button>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Settings</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4 flex-grow">
            Your data is stored locally. For access across multiple devices, register with a magic link.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-gray-200/50 hover:bg-gray-200/80 border-gray-300/50 text-gray-600 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 dark:border-gray-700/50 dark:text-gray-300">
              <Link to="/settings">
                <Settings className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">Account</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="auto" className="flex flex-col items-center py-3 md:py-4 h-auto bg-blue-100/50 hover:bg-blue-100/80 border-blue-200/50 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-800/50 dark:text-blue-300">
              <Link to="/settings">
                <Activity className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                <span className="text-xs md:text-sm font-medium">Sync</span>
              </Link>
            </Button>
          </div>
          
          <Button asChild variant="default" size="sm" className="w-full rounded-md bg-gray-500/90 hover:bg-gray-500">
            <Link to="/settings" className="flex items-center justify-center">
              All Settings <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Compact quick access section - keep but make more efficient */}
      <div className="mb-8">
        <h3 className="text-md md:text-lg font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary/70" />
          Quick Access
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 md:gap-3">
          <Link to="/tasks" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-primary/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-primary/10 rounded-full p-2 mb-1.5">
              <ListTodo className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium">Tasks</span>
          </Link>
          
          <Link to="/timer" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-[#9b87f5]/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-[#9b87f5]/10 rounded-full p-2 mb-1.5">
              <Timer className="w-3.5 h-3.5 text-[#9b87f5]" />
            </div>
            <span className="text-xs font-medium">Timer</span>
          </Link>
          
          <Link to="/habits" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-amber-400/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-amber-400/10 rounded-full p-2 mb-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xs font-medium">Habits</span>
          </Link>
          
          <Link to="/screenshots" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-blue-400/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-blue-400/10 rounded-full p-2 mb-1.5">
              <Image className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-medium">Screenshots</span>
          </Link>
          
          <Link to="/notes" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-green-400/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-green-400/10 rounded-full p-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-green-400" />
            </div>
            <span className="text-xs font-medium">Notes</span>
          </Link>
          
          <Link to="/voice-notes" className="glass-card aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-rose-400/5 p-2 hover:shadow-sm hover:-translate-y-0.5">
            <div className="bg-rose-400/10 rounded-full p-2 mb-1.5">
              <Mic className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span className="text-xs font-medium">Voice</span>
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
