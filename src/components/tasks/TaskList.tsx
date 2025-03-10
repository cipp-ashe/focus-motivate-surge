
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick?: (taskId: string) => void;
  simplifiedView?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTasks,
  onTaskClick = () => {},
  simplifiedView = false,
}) => {
  const { completed: completedTasks } = useTaskContext();
  const [activeTab, setActiveTab] = useState('active');
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  
  // Keep local tasks in sync with props - with proper dependencies
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  // Listen for force updates - with proper cleanup
  useEffect(() => {
    const handleForceUpdate = () => {
      // Only update if still mounted
      if (isMountedRef.current) {
        setLocalTasks(prev => [...prev]);
      }
    };
    
    const handleHabitsProcessed = () => {
      if (isMountedRef.current) {
        setLocalTasks(prev => [...prev]);
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    const unsubscribeHabits = eventBus.on('habits:processed', handleHabitsProcessed);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
      unsubscribeHabits();
    };
  }, []); // Run only once on mount

  // Set mounted flag cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleClearCompletedTasks = useCallback(() => {
    completedTasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' });
    });
  }, [completedTasks]);

  // If using simplified view (for Timer page), just show the task table without tabs
  if (simplifiedView) {
    return (
      <div className="w-full h-full flex flex-col">
        <ScrollArea className="h-full">
          <TaskTable
            tasks={localTasks}
            selectedTasks={selectedTasks}
          />
        </ScrollArea>
      </div>
    );
  }

  // Mobile-specific styling
  const tabListClass = isMobile
    ? "grid grid-cols-2 w-full text-xs"
    : "grid grid-cols-2 w-full text-sm";

  const tabContentClass = isMobile
    ? "flex-grow overflow-hidden mt-0 p-0 pb-16"
    : "flex-grow overflow-hidden mt-0 p-0";

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs 
        defaultValue="active" 
        className="w-full h-full flex flex-col"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <div className={isMobile ? "px-1 pt-1" : "px-4 pt-2"}>
          <TabsList className={tabListClass}>
            <TabsTrigger value="active" data-test="active-tasks-tab">
              Active Tasks ({localTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-test="completed-tasks-tab">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className={tabContentClass}>
          <ScrollArea className="h-full">
            <TaskTable
              tasks={localTasks}
              selectedTasks={selectedTasks}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className={tabContentClass}>
          <CompletedTasks
            tasks={completedTasks}
            onTasksClear={handleClearCompletedTasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
