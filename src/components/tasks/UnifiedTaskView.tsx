
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskTabsList } from './tabs/TaskTabsList';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';

interface UnifiedTaskViewProps {
  activeTasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const UnifiedTaskView: React.FC<UnifiedTaskViewProps> = ({
  activeTasks,
  completedTasks,
  selectedTaskId,
  dialogOpeners,
  onTaskAdd,
  onTasksAdd
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [activeTaskType, setActiveTaskType] = useState<'all' | TaskType>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Task counts for filtering
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    timer: 0,
    screenshot: 0,
    journal: 0,
    checklist: 0,
    voicenote: 0,
    regular: 0,
    focus: 0
  });
  
  // Use our unified task manager hook
  const taskManager = useUnifiedTaskManager();
  
  // Task event handlers
  const handleTaskSelect = useCallback((taskId: string) => {
    taskManager.selectTask(taskId);
  }, [taskManager]);
  
  const handleForceUpdate = useCallback(() => {
    taskManager.forceTaskUpdate();
  }, [taskManager]);

  const handleTaskUpdate = useCallback((data: { taskId: string; updates: Partial<Task> }) => {
    taskManager.updateTask(data.taskId, data.updates);
  }, [taskManager]);

  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    taskManager.deleteTask(data.taskId);
    toast.success('Task deleted');
  }, [taskManager]);

  const handleTaskComplete = useCallback((data: { taskId: string; metrics?: any }) => {
    taskManager.completeTask(data.taskId, data.metrics);
    toast.success('Task completed');
  }, [taskManager]);
  
  // Calculate counts whenever tasks change
  useEffect(() => {
    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;
    
    const counts = {
      all: currentTasks.length,
      timer: currentTasks.filter(t => t.taskType === 'timer').length,
      screenshot: currentTasks.filter(t => t.taskType === 'screenshot').length,
      journal: currentTasks.filter(t => t.taskType === 'journal').length,
      checklist: currentTasks.filter(t => t.taskType === 'checklist').length,
      voicenote: currentTasks.filter(t => t.taskType === 'voicenote').length,
      focus: currentTasks.filter(t => t.taskType === 'focus').length,
      regular: currentTasks.filter(t => t.taskType === 'regular' || !t.taskType).length
    };
    
    setTaskCounts(counts);
  }, [activeTasks, completedTasks, activeTab]);
  
  // Filter tasks based on active type
  const getFilteredTasks = useCallback(() => {
    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;
    
    if (activeTaskType === 'all') return currentTasks;
    return currentTasks.filter(task => task.taskType === activeTaskType);
  }, [activeTaskType, activeTab, activeTasks, completedTasks]);

  // Get empty state message based on active tab and task type
  const getEmptyStateMessage = useCallback(() => {
    if (activeTab === 'active') {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-1">No tasks available</p>
          <p className="text-sm text-muted-foreground/70">Create a task using the input field above</p>
        </div>
      );
    } else {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No completed tasks</p>
        </div>
      );
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Task type tabs/filters */}
      <TaskTabsList
        activeTaskType={activeTaskType}
        onTaskTypeChange={(type) => setActiveTaskType(type as 'all' | TaskType)}
        taskCounts={taskCounts}
      />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')} className="w-full flex flex-col">
        <TabsList className="grid grid-cols-2 rounded-none">
          <TabsTrigger value="active" className={cn(
            "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-5 py-2.5"
          )}>
            Active Tasks ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className={cn(
            "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-5 py-2.5"
          )}>
            Completed Tasks ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="flex-1 overflow-hidden p-0 m-0 data-[state=active]:border-0">
          <ScrollArea className="h-full max-h-[calc(100vh-320px)]">
            <div className="p-4">
              <TaskList
                tasks={getFilteredTasks()}
                selectedTaskId={selectedTaskId}
                dialogOpeners={dialogOpeners}
                handleTaskSelect={handleTaskSelect}
                handleDelete={handleTaskDelete}
                handleTaskUpdate={handleTaskUpdate}
                handleTaskComplete={handleTaskComplete}
                emptyState={getEmptyStateMessage()}
                isLoading={isLoading}
                onForceUpdate={handleForceUpdate}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="completed" className="flex-1 overflow-hidden p-0 m-0 data-[state=active]:border-0">
          <ScrollArea className="h-full max-h-[calc(100vh-320px)]">
            <div className="p-4">
              <TaskList
                tasks={getFilteredTasks()}
                selectedTaskId={selectedTaskId}
                dialogOpeners={dialogOpeners}
                handleTaskSelect={handleTaskSelect}
                handleDelete={handleTaskDelete}
                handleTaskUpdate={handleTaskUpdate}
                handleTaskComplete={handleTaskComplete}
                emptyState={getEmptyStateMessage()}
                isLoading={isLoading}
                onForceUpdate={handleForceUpdate}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
