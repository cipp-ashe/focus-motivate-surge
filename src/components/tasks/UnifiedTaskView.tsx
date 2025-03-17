
import React, { useState, useEffect } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskTabsList } from './tabs/TaskTabsList';
import { cn } from '@/lib/utils';

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
    regular: 0
  });
  
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

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm border border-border/20 shadow-sm">
      {/* Task type filters */}
      <div className="flex-none">
        <TaskTabsList 
          taskCounts={taskCounts} 
          activeTaskType={activeTaskType} 
          onTaskTypeChange={type => setActiveTaskType(type as 'all' | TaskType)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')} className="w-full flex flex-col h-full">
        <TabsList className="grid grid-cols-2 bg-card/80 border-b border-border/10 rounded-none px-0.5">
          <TabsTrigger value="active" className={cn(
            "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-5 py-2.5",
            "data-[state=active]:text-primary font-medium transition-all duration-200"
          )}>
            Active Tasks ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className={cn(
            "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-5 py-2.5",
            "data-[state=active]:text-primary font-medium transition-all duration-200"
          )}>
            Completed Tasks ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="flex-1 overflow-hidden p-0 m-0 data-[state=active]:border-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <TaskList
                tasks={getFilteredTasks()}
                selectedTaskId={selectedTaskId}
                dialogOpeners={dialogOpeners}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="completed" className="flex-1 overflow-hidden p-0 m-0 data-[state=active]:border-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <TaskList
                tasks={getFilteredTasks()}
                selectedTaskId={selectedTaskId}
                dialogOpeners={dialogOpeners}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
