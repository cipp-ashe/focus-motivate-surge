
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eventBus } from '@/lib/eventBus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CompletedTasksProps {
  tasks?: Task[];
  onTasksClear?: () => void;
}

export const CompletedTasks: React.FC<CompletedTasksProps> = ({ 
  tasks: propTasks,
  onTasksClear
}) => {
  const { completed } = useTaskContext();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'dismissed'>('all');
  
  // Use props tasks if provided, otherwise use from context
  const tasksToUse = propTasks || completed;
  
  // Separate completed tasks from dismissed tasks
  const completedTasks = tasksToUse.filter(task => !task.dismissedAt);
  const dismissedTasks = tasksToUse.filter(task => task.dismissedAt);
  
  const displayTasks = activeTab === 'completed' 
    ? completedTasks 
    : activeTab === 'dismissed' 
      ? dismissedTasks 
      : tasksToUse;

  // Handle deleting a completed/dismissed task
  const handleDeleteTask = (taskId: string) => {
    eventBus.emit('task:delete', { 
      taskId, 
      reason: 'manual',
      suppressToast: false 
    });
  };
  
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            Completed Tasks
            {tasksToUse.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {tasksToUse.length}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-secondary/50 p-1">
            <TabsTrigger 
              value="all"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              All ({tasksToUse.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Completed ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger 
              value="dismissed"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Dismissed ({dismissedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-3 mt-0">
            {displayTasks.length === 0 ? (
              <div className="bg-muted/20 text-muted-foreground rounded-lg py-8 text-center">
                <p>No {activeTab} tasks yet.</p>
              </div>
            ) : (
              displayTasks.map(task => (
                <CompletedTaskItem 
                  key={task.id} 
                  task={task} 
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface CompletedTaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

const CompletedTaskItem = ({ task, onDelete }: CompletedTaskItemProps) => {
  const isDismissed = !!task.dismissedAt;
  
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
      "flex items-center gap-3 animate-fade-in",
      isDismissed 
        ? "bg-orange-50/10 border-orange-200/30 dark:bg-orange-900/5" 
        : "bg-green-50/10 border-green-200/30 dark:bg-green-900/5"
    )}>
      {isDismissed ? (
        <div className="bg-orange-100/20 p-2 rounded-full">
          <XCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
        </div>
      ) : (
        <div className="bg-green-100/20 p-2 rounded-full">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        </div>
      )}
      
      <div className="flex-1">
        <p className="font-medium text-foreground">{task.name}</p>
        <div className="flex gap-2 mt-1">
          {task.relationships?.habitId && (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/30">
              Habit
            </Badge>
          )}
          {task.relationships?.templateId && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30">
              Template
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {isDismissed ? 'Dismissed' : 'Completed'}
          </span>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(task.id)}
        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompletedTasks;
