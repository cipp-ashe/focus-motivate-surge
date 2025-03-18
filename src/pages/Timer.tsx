import React, { useState, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Quote } from '@/types/timer';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TimerSection } from '@/components/timer/TimerSection';
import { TimerView } from '@/components/tasks/TimerView';
import { Clock, BarChart, Plus, History } from 'lucide-react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TimerMetricsDisplay as TimerMetricsDisplayComponent } from '@/components/timer/TimerMetricsDisplay';

export default function TimerPage() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState('timer');

  // Emit initialization event
  useEffect(() => {
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <TaskProvider>
        <TaskSelectionProvider>
          <h1 className="text-2xl font-bold mb-4 flex items-center">
            <Clock className="mr-2 h-6 w-6 text-primary" />
            Focus Timer
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timer Section - Active Timer */}
            <div className="lg:col-span-2">
              <Card className="shadow-md border-border/20 overflow-hidden h-full">
                <TimerSection favorites={favorites} setFavorites={setFavorites} />
              </Card>
            </div>
            
            {/* Timer Tasks and Metrics */}
            <div className="lg:col-span-1 space-y-6">
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="tasks" className="flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex items-center justify-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Metrics</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center justify-center">
                    <History className="h-4 w-4 mr-2" />
                    <span>History</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tasks" className="m-0">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <TimerTasksPanel />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="metrics" className="m-0">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <TimerMetricsDisplayComponent />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="m-0">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <TimerHistoryDisplay />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TaskSelectionProvider>
      </TaskProvider>
    </div>
  );
}

// Timer Tasks Panel component
function TimerTasksPanel() {
  const taskContext = useTaskContext();
  
  const handleTaskAdd = (task: any) => {
    if (taskContext?.addTask) {
      taskContext.addTask(task);
    }
  };
  
  const handleTasksAdd = (tasks: any[]) => {
    if (taskContext?.addTask) {
      tasks.forEach(task => {
        taskContext.addTask(task);
      });
    }
  };
  
  return (
    <div className="h-[500px] flex flex-col">
      <TimerView 
        tasks={taskContext?.items || []} 
        selectedTaskId={taskContext?.selected || null}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    </div>
  );
}

// Timer History Display
function TimerHistoryDisplay() {
  return (
    <div className="p-4 space-y-4 h-[500px] overflow-y-auto">
      <h3 className="text-lg font-medium">Recent Timer Sessions</h3>
      <Separator />
      
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-center justify-between p-3 rounded-md bg-accent/5 hover:bg-accent/10 transition-colors">
          <div>
            <h4 className="font-medium">Task {item}</h4>
            <p className="text-sm text-muted-foreground">Completed today</p>
          </div>
          <div className="text-right">
            <p className="font-medium">25:00</p>
            <p className="text-sm text-green-500">Completed</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple metric card component
function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-accent/5 p-4 rounded-md flex items-center space-x-3">
      <div className="bg-primary/10 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// Keep the existing function for backward compatibility
export const fixTimerPageEmission = () => {
  useEffect(() => {
    // Fix the initialization event with a timestamp
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);
};
