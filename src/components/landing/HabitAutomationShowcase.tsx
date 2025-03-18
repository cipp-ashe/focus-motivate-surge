
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Timer, FileText, Clock, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitExampleCard from './HabitExampleCard';

const HabitAutomationShowcase: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 dark:to-transparent border border-amber-100/50 dark:border-amber-800/30 rounded-xl overflow-hidden shadow-xl mb-0 backdrop-blur-sm">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-amber-400/20 p-3 rounded-full">
            <Activity className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold">Habit Automation</h2>
            <p className="text-muted-foreground">Configure once, automate your daily workflow</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <HabitExampleCard 
            icon={Timer} 
            iconClass="bg-blue-400/20" 
            iconColor="text-blue-500" 
            title="Morning Workout" 
            badgeType="habit" 
            badgeClass="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300" 
            timeBadge="25 min" 
            tags="fitness, morning-routine" 
            description="Auto-creates a timed task with proper tags" 
            borderColor="border-blue-200 dark:border-blue-800/50" 
          />
          
          <HabitExampleCard 
            icon={FileText} 
            iconClass="bg-green-400/20" 
            iconColor="text-green-500" 
            title="Evening Reflection" 
            badgeType="journal" 
            badgeClass="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300" 
            timeBadge="daily" 
            timeIcon={CalendarCheck} 
            tags="journal, reflection" 
            description="Auto-generates a journal entry with prompts" 
            borderColor="border-green-200 dark:border-green-800/50" 
          />
        </div>
        
        <div className="text-center">
          <Button asChild variant="default" size="lg" className="bg-amber-500 hover:bg-amber-600 rounded-full shadow-glow button-glow">
            <Link to="/habits" className="flex items-center gap-2">
              Configure Your Habits <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitAutomationShowcase;
