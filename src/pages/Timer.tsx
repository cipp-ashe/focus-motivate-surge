
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Task Timer</CardTitle>
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
