
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageTitle } from '@/components/layout/PageTitle';
import { Clock } from 'lucide-react';
import { TimerView } from '@/components/tasks/TimerView';

const Timer = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl animate-fade-in">
      <PageHeader>
        <PageTitle 
          icon={<Clock className="h-5 w-5" />}
          title="Timer"
          subtitle="Focus and track your time"
        />
      </PageHeader>
      
      <div className="grid gap-6">
        <Card className="dark:bg-card/90 border-border/40 dark:border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Task Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimerView />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timer;
