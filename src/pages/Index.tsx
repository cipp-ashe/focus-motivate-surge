
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
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index = () => {
  return (
    <DashboardLayout>
      {/* Hero section */}
      <DashboardHeader 
        title="Focus, Motivate, Surge"
        description="Your personal productivity assistant designed to help you accomplish more and stress less"
      />
      
      {/* Main navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Tasks section */}
        <div className="flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full">
              <ListTodo className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1">
              <Link to="/tasks">View All</Link>
            </Button>
          </div>
          <h2 className="text-xl font-semibold mb-2">Tasks & Focus</h2>
          <p className="text-muted-foreground mb-4 flex-grow">
            Manage your tasks, set timers for focused work sessions, and capture work progress with screenshots.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/tasks">
                <ListTodo className="h-3.5 w-3.5 mr-1" /> Tasks
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/timer">
                <Timer className="h-3.5 w-3.5 mr-1" /> Timer
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/screenshots">
                <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Progress
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Notes section */}
        <div className="flex flex-col bg-gradient-to-br from-[#e5deff]/30 to-[#e5deff]/50 rounded-xl p-6 border border-[#9b87f5]/20 shadow-lg hover:shadow-[#9b87f5]/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-[#9b87f5]/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-[#9b87f5]" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#9b87f5]/80 hover:bg-[#9b87f5]/10 px-2 py-1">
              <Link to="/notes">View All</Link>
            </Button>
          </div>
          <h2 className="text-xl font-semibold mb-2">Notes & Thoughts</h2>
          <p className="text-muted-foreground mb-4 flex-grow">
            Capture your thoughts in written notes or record voice memos for quick idea documentation.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/notes">
                <BookOpen className="h-3.5 w-3.5 mr-1" /> Journal
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/voice-notes">
                <Clock className="h-3.5 w-3.5 mr-1" /> Voice Notes
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Settings section */}
        <div className="flex flex-col bg-gradient-to-br from-[#FEC6A1]/30 to-[#FEC6A1]/50 rounded-xl p-6 border border-amber-400/20 shadow-lg hover:shadow-amber-400/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-amber-400/20 p-3 rounded-full">
              <Settings className="w-6 h-6 text-amber-500" aria-hidden="true" />
            </div>
            <Button asChild variant="ghost" size="sm" className="text-amber-500 hover:text-amber-500/80 hover:bg-amber-500/10 px-2 py-1">
              <Link to="/settings">View All</Link>
            </Button>
          </div>
          <h2 className="text-xl font-semibold mb-2">Habits & Settings</h2>
          <p className="text-muted-foreground mb-4 flex-grow">
            Track your daily habits and customize your application preferences.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/habits">
                <Activity className="h-3.5 w-3.5 mr-1" /> Habits
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 bg-background/50">
              <Link to="/settings">
                <Settings className="h-3.5 w-3.5 mr-1" /> Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Getting started section */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-background to-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Start Your Productivity Journey</h3>
              <p className="text-muted-foreground mb-4">
                Begin by creating tasks, tracking your habits, or setting up a focused timer session.
                Choose what works best for your workflow right now.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button asChild variant="default" size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                  <Link to="/tasks" className="flex items-center gap-1">
                    Create a Task <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Link to="/timer" className="flex items-center gap-1">
                    Start Timer <Timer className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                  <Link to="/habits" className="flex items-center gap-1">
                    Track Habits <Activity className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently viewed or most used */}
      <div className="mb-12">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary/70" />
          Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/tasks" className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-primary/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-primary/10 rounded-full p-3 mb-3">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Today's Tasks</h3>
            <p className="text-sm text-muted-foreground">View and manage your current tasks</p>
          </Link>
          
          <Link to="/timer" className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-[#9b87f5]/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-[#9b87f5]/10 rounded-full p-3 mb-3">
              <Timer className="w-5 h-5 text-[#9b87f5]" />
            </div>
            <h3 className="font-medium mb-1">Focus Timer</h3>
            <p className="text-sm text-muted-foreground">Start a focused work session</p>
          </Link>
          
          <Link to="/habits" className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-amber-400/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-amber-400/10 rounded-full p-3 mb-3">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-medium mb-1">Daily Habits</h3>
            <p className="text-sm text-muted-foreground">Track your habit progress</p>
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
