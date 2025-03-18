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
import { 
  Clock, 
  BarChart, 
  History, 
  List, 
  BellRing,
  CheckCircle2
} from 'lucide-react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TimerMetricsDisplay as TimerMetricsDisplayComponent } from '@/components/timer/TimerMetricsDisplay';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TimerPage() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState('tasks');

  // Emit initialization event
  useEffect(() => {
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="container px-4 py-6 mx-auto animate-fade-in">
      <TaskProvider>
        <TaskSelectionProvider>
          <header className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              <Clock className="h-8 w-8 text-purple-500" />
              Focus Timer
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Boost your productivity with our Pomodoro-style timer. Select a task, set your focus time, and track your progress.
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timer Section - Left side (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md border-primary/10 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <TimerSection favorites={favorites} setFavorites={setFavorites} />
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-primary/10 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <BellRing className="h-5 w-5 text-purple-500 mr-2" />
                    <h2 className="text-lg font-medium">Recent Completed Sessions</h2>
                  </div>
                  <Separator className="mb-4" />
                  <RecentSessionsList />
                </CardContent>
              </Card>
            </div>
            
            {/* Timer Tasks and Metrics - Right side (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-md border-primary/10 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="tasks" className="flex items-center justify-center">
                        <List className="h-4 w-4 mr-2" />
                        <span>Tasks</span>
                      </TabsTrigger>
                      <TabsTrigger value="metrics" className="flex items-center justify-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        <span>Metrics</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tasks" className="m-0 h-[500px]">
                      <TimerTasksPanel />
                    </TabsContent>
                    
                    <TabsContent value="metrics" className="m-0 h-[500px]">
                      <TimerMetricsDisplayComponent />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
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
    <div className="h-full flex flex-col">
      <TimerView 
        tasks={taskContext?.items || []} 
        selectedTaskId={taskContext?.selected || null}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    </div>
  );
}

// Recent Sessions List Component
function RecentSessionsList() {
  // This would normally fetch from real data
  const sessions = [
    { id: 1, taskName: "Complete project proposal", duration: 25, completedAt: new Date(Date.now() - 1000*60*30), status: "Completed" },
    { id: 2, taskName: "Research competitors", duration: 30, completedAt: new Date(Date.now() - 1000*60*90), status: "Completed" },
    { id: 3, taskName: "Team meeting preparation", duration: 15, completedAt: new Date(Date.now() - 1000*60*240), status: "Completed" },
  ];

  if (sessions.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-md">
        <p className="text-muted-foreground">No completed sessions yet. Start your first timer!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-3">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-border/10"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{session.taskName}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                {session.duration} min
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
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
