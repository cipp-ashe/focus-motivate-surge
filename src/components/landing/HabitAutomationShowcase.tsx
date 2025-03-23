
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HabitAutomationShowcase: React.FC = () => {
  return (
    <div className="border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <Activity className="w-6 h-6" />
        <div>
          <h2 className="text-2xl font-bold">Habit Automation</h2>
          <p className="text-muted-foreground">Configure once, automate your daily workflow</p>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Button asChild variant="default">
          <Link to="/habits" className="flex items-center gap-2">
            Configure Your Habits <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HabitAutomationShowcase;
