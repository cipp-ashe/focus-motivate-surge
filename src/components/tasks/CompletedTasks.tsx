
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { eventBus } from '@/lib/eventBus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CompletedTasksList from './completed/CompletedTasksList';

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
    <Card className="bg-card/90 backdrop-blur-sm border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Completed Tasks
            {tasksToUse.length > 0 && (
              <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">
                {tasksToUse.length}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-secondary/50 p-1 rounded-md">
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
          
          <CompletedTasksList 
            tasks={displayTasks}
            activeTab={activeTab}
            onDeleteTask={handleDeleteTask}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompletedTasks;
