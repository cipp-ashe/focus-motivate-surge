
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  CalendarCheck, 
  BookHeart, 
  Timer, 
  ScrollText, 
  Image, 
  Mic,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      
      {/* Feature cards grid */}
      <DashboardCardGrid />
      
      {/* Getting started section */}
      <div className="mt-12 mb-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-glass">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
              <p className="text-muted-foreground mb-4">
                Begin by creating tasks, tracking your habits, or setting up a focused timer session.
                Our integrated approach helps you maintain productivity throughout your day.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button asChild variant="default" size="sm" className="rounded-full">
                  <Link to="/tasks" className="flex items-center gap-1">
                    Create a Task <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/timer" className="flex items-center gap-1">
                    Start Timer <Timer className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/habits" className="flex items-center gap-1">
                    Track Habits <BookHeart className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick access section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-primary/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">View your most recent tasks and progress</p>
        </div>
        
        <div className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-primary/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Today's Focus</h3>
          <p className="text-sm text-muted-foreground">See what you need to accomplish today</p>
        </div>
        
        <div className="glass-card p-5 rounded-xl flex flex-col items-center text-center hover:shadow-primary/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <ScrollText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Quick Notes</h3>
          <p className="text-sm text-muted-foreground">Capture thoughts before they slip away</p>
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
