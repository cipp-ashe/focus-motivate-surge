import React, { useState, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Quote } from '@/types/timer';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimerSection } from '@/components/timer/TimerSection';
import TimerView from '@/components/tasks/TimerView';
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
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';

export default function TimerPage() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const { isOpen, setIsOpen } = useTimerModal();

  useEffect(() => {
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="container px-4 py-6 mx-auto animate-fade-in">
      <TaskProvider>
        <TaskSelectionProvider>
          <PageHeader
            title="Focus Timer"
            description="Boost your productivity with our Pomodoro-style timer. Select a task, set your focus time, and track your progress."
            icon={Clock}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="overflow-hidden">
                <GlassCardContent className="p-4">
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
                </GlassCardContent>
              </GlassCard>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <GlassCard className="overflow-hidden">
                <GlassCardContent className="p-0">
                  <TimerSection favorites={favorites} setFavorites={setFavorites} />
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
          
          <TimerConfigModal open={isOpen} onOpenChange={setIsOpen} />
        </TaskSelectionProvider>
      </TaskProvider>
    </div>
  );
}

function TimerTasksPanel() {
  const taskContext = useTaskContext();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    const handleTaskUpdate = (event: CustomEvent) => {
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
      <TimerView key={`timer-view-${forceUpdate}`} />
    </div>
  );
}

function RecentSessionsList() {
  const taskContext = useTaskContext();
  const [forceUpdate, setForceUpdate] = useState(0);
  const completedTasks = taskContext?.completed || [];
  
  useEffect(() => {
    const handleTaskComplete = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('task-ui-refresh', handleTaskComplete as EventListener);
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskComplete as EventListener);
    };
  }, []);
  
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

export const fixTimerPageEmission = () => {
  useEffect(() => {
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);
};
