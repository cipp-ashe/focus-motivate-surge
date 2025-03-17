
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, BookHeart, Timer, ScrollText } from 'lucide-react';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gradient-primary">Focus, Motivate, Surge</h1>
        <p className="text-muted-foreground mt-2">Your personal productivity assistant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/tasks">
          <Card className="p-6 hover:shadow-md transition-all card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <p className="text-muted-foreground text-sm">Manage your daily tasks</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>

        <Link to="/habits">
          <Card className="p-6 hover:shadow-md transition-all card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookHeart className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Habits</h2>
                <p className="text-muted-foreground text-sm">Build consistent habits</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>

        <Link to="/timer">
          <Card className="p-6 hover:shadow-md transition-all card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Timer className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Timer</h2>
                <p className="text-muted-foreground text-sm">Focus with Pomodoro technique</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>

        <Link to="/notes">
          <Card className="p-6 hover:shadow-md transition-all card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ScrollText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Notes</h2>
                <p className="text-muted-foreground text-sm">Capture your thoughts</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Index;
