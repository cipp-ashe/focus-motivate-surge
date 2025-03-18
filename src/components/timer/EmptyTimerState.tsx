
import React, { useState, useEffect } from 'react';
import { Clock, Play, Timer, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTaskOperations } from '@/lib/operations/tasks/create';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { MinutesInput } from '@/components/minutes/MinutesInput';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task, TaskStatus } from '@/types/tasks';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export const EmptyTimerState = () => {
  const [taskName, setTaskName] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [activeTab, setActiveTab] = useState('instant');
  const taskContext = useTaskContext();
  const [timerTasks, setTimerTasks] = useState<Task[]>([]);
  
  // Filter timer tasks when tasks change
  useEffect(() => {
    if (taskContext?.items) {
      const filtered = taskContext.items.filter(
        task => task.taskType === 'timer' || task.taskType === 'focus'
      );
      setTimerTasks(filtered);
    }
  }, [taskContext?.items]);
  
  const handleStartInstantTimer = () => {
    // If no task name is provided, use a default name
    const name = taskName.trim() || `Quick Timer (${minutes} min)`;
    
    // Create a new timer task
    const newTask = createTaskOperations.createTask({
      name,
      taskType: 'timer',
      duration: minutes * 60,
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'pending' as TaskStatus, // Fix TypeScript error with correct TaskStatus type
      tags: [] // Fix TypeScript error by using empty array instead of string literals
    }, {
      suppressToast: true,
      selectAfterCreate: true
    });
    
    // Emit event to select and start the timer
    eventManager.emit('timer:set-task', newTask);
    
    toast.success(`Starting ${minutes} minute timer`, {
      description: `"${name}" timer started`
    });
  };
  
  const handleSelectTask = (task: Task) => {
    eventManager.emit('timer:set-task', task);
    
    toast.success(`Selected timer task`, {
      description: `"${task.name}" timer ready to start`
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Timer className="h-10 w-10 text-primary/70" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Focus Timer</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-2">
          Start a focus session using an instant timer or select from your existing timer tasks.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="instant" className="flex items-center justify-center">
            <Play className="h-4 w-4 mr-2" />
            <span>Instant Timer</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center justify-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Timer Tasks</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="instant">
          <Card className="bg-card border-primary/10 w-full">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="task-name" className="text-sm font-medium text-left block">
                  Task Name (optional)
                </label>
                <Input
                  id="task-name"
                  placeholder="What are you focusing on?"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-left block">
                  Timer Duration
                </label>
                <div className="flex justify-center py-2">
                  <MinutesInput
                    minutes={minutes}
                    onMinutesChange={setMinutes}
                    minMinutes={1}
                    maxMinutes={120}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleStartInstantTimer}
                className="w-full gap-2"
                size="lg"
              >
                <Play className="h-4 w-4" />
                Start Timer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card className="bg-card border-primary/10 w-full">
            <CardContent className="p-4">
              {timerTasks.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {timerTasks.map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleSelectTask(task)}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-border/50 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <Clock className="h-5 w-5 text-primary/70" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-sm">{task.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {task.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {task.duration ? Math.floor(task.duration / 60) : 25} min
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No timer tasks found</p>
                  <p className="text-xs text-muted-foreground">
                    Switch to "Instant Timer" to create your first timer session
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
