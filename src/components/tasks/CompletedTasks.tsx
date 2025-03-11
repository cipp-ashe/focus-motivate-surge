
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface CompletedTasksProps {
  tasks?: Task[];
  onTasksClear?: () => void;
}

export const CompletedTasks: React.FC<CompletedTasksProps> = ({ 
  tasks: propTasks,
  onTasksClear
}) => {
  const { completed } = useTaskContext();
  const [activeTab, setActiveTab] = useState<'completed' | 'dismissed' | 'all'>('all');
  
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
  
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        Completed Tasks
        {tasksToUse.length > 0 && (
          <Badge variant="outline" className="ml-2">
            {tasksToUse.length}
          </Badge>
        )}
      </h2>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All ({tasksToUse.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="dismissed">
            Dismissed ({dismissedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-2">
          {displayTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No {activeTab} tasks yet.
            </p>
          ) : (
            displayTasks.map(task => (
              <CompletedTaskItem key={task.id} task={task} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CompletedTaskItem = ({ task }: { task: Task }) => {
  const isDismissed = !!task.dismissedAt;
  
  return (
    <div className={`p-3 border rounded-md flex items-center gap-2 
      ${isDismissed ? 'border-orange-200 bg-orange-50/30' : 'border-green-200 bg-green-50/30'}`}
    >
      {isDismissed ? (
        <XCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      )}
      
      <div className="flex-1">
        <p className="font-medium">{task.name}</p>
        {task.relationships?.habitId && (
          <Badge variant="outline" className="text-xs mt-1 bg-green-500/10 text-green-500">
            Habit
          </Badge>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {isDismissed ? 'Dismissed' : 'Completed'}
      </div>
    </div>
  );
};

export default CompletedTasks;
