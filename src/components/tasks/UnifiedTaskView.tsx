
import React, { useState, useEffect } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskTabsList } from './tabs/TaskTabsList';
import { cn } from '@/lib/utils';
import { eventManager } from '@/lib/events/EventManager';
import { Card, CardContent } from '@/components/ui/card';

interface UnifiedTaskViewProps {
  activeTasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
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
  
  // Task event handlers
  const handleTaskSelect = (taskId: string) => {
    // Fix: Pass just the taskId string instead of an object
    eventManager.emit('task:select', taskId);
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    eventManager.emit('task:delete', data);
  };

  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    eventManager.emit('task:update', data);
  };

  const handleTaskComplete = (data: { taskId: string; metrics?: any }) => {
    eventManager.emit('task:complete', data);
  };
  
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
  const getFilteredTasks = () => {
    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;
    
    if (activeTaskType === 'all') return currentTasks;
    return currentTasks.filter(task => task.taskType === activeTaskType);
  };

  // Get empty state message based on active tab and task type
  const getEmptyStateMessage = () => {
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
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-[#1A1F2C]/80 backdrop-blur-sm border border-[#6E59A5]/20 shadow-sm">
      <CardContent className="p-0">
        {/* Task type tabs/filters */}
        <div className="flex-none">
          <TaskTabsList
            taskCounts={taskCounts}
            activeTaskType={activeTaskType}
            onTaskTypeChange={(type) => setActiveTaskType(type as 'all' | TaskType)}
            // Also provide props with the legacy names
            counts={taskCounts}
            activeFilter={activeTaskType}
            onFilterChange={(type) => setActiveTaskType(type as 'all' | TaskType)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')} className="w-full flex flex-col">
          <TabsList className="grid grid-cols-2 bg-[#1A1F2C]/80 border-b border-[#6E59A5]/20 rounded-none px-0.5">
            <TabsTrigger value="active" className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-5 py-2.5",
              "data-[state=active]:text-[#9b87f5] font-medium transition-all duration-200"
            )}>
              Active Tasks ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-5 py-2.5",
              "data-[state=active]:text-[#9b87f5] font-medium transition-all duration-200"
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
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
