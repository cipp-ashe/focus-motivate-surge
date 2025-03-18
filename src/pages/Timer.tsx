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
  CheckCircle2
} from 'lucide-react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TimerMetricsDisplay from '@/components/timer/TimerMetricsDisplay';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimerConfigModal } from '@/components/timer/TimerConfigModal';
import { useTimerModal } from '@/hooks/timer/useTimerModal';

export default function TimerPage() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const { isOpen, setIsOpen } = useTimerModal();

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
            {/* Tasks Section - Left side (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md border-primary/10 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="tasks" className="flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Tasks</span>
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Completed</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tasks" className="m-0 h-[500px]">
                      <TimerTasksPanel />
                    </TabsContent>
                    
                    <TabsContent value="completed" className="m-0 h-[500px]">
                      <RecentSessionsList />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Timer Section - Right side (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-md border-primary/10 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <TimerSection favorites={favorites} setFavorites={setFavorites} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Timer Configuration Modal */}
          <TimerConfigModal open={isOpen} onOpenChange={setIsOpen} />
        </TaskSelectionProvider>
      </TaskProvider>
    </div>
  );
}

// Timer Tasks Panel component
function TimerTasksPanel() {
  const taskContext = useTaskContext();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Listen for task status updates
  useEffect(() => {
    const handleTaskUpdate = (event: CustomEvent) => {
      // Force refresh list when tasks are updated
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('task-ui-refresh', handleTaskUpdate as EventListener);
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskUpdate as EventListener);
    };
  }, []);
  
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
        key={`timer-view-${forceUpdate}`} // Force re-render when tasks are updated
        tasks={taskContext?.items || []} 
        selectedTaskId={taskContext?.selected || null}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    </div>
  );
}

// Recent Sessions List Component - Shows actual completed timer tasks
function RecentSessionsList() {
  const taskContext = useTaskContext();
  const [forceUpdate, setForceUpdate] = useState(0);
  const completedTasks = taskContext?.completed || [];
  
  // Listen for task completion events
  useEffect(() => {
    const handleTaskComplete = () => {
      // Force refresh list when tasks are completed
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('task-ui-refresh', handleTaskComplete as EventListener);
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskComplete as EventListener);
    };
  }, []);
  
  // Filter to only get timer type tasks
  const completedTimerTasks = completedTasks.filter(
    task => task.taskType === 'timer' || task.taskType === 'focus'
  );

  if (completedTimerTasks.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-md">
        <p className="text-muted-foreground">No completed timer sessions yet. Start your first timer!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3">
        {completedTimerTasks.map((session) => (
          <div 
            key={session.id} 
            className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-border/10"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{session.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.completedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                {session.duration ? Math.floor(session.duration / 60) : 0} min
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
