import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  // Keep local tasks in sync with props - with proper dependencies
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  // Listen for force updates - with proper cleanup
  useEffect(() => {
    const handleForceUpdate = () => {
      // Force component update by setting state
      setLocalTasks(prev => [...prev]);
    };
    
    const handleHabitsProcessed = () => {
      setLocalTasks(prev => [...prev]);
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    const unsubscribeHabits = eventBus.on('habits:processed', handleHabitsProcessed);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
      unsubscribeHabits();
    };
  }, []); // Run only once on mount

  const handleClearCompletedTasks = () => {
    completedTasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' });
    });
  };

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

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs 
        defaultValue="active" 
        className="w-full h-full flex flex-col"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="active" data-test="active-tasks-tab">
              Active Tasks ({localTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-test="completed-tasks-tab">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="flex-grow overflow-hidden mt-0 p-0">
          <ScrollArea className="h-full">
            <TaskTable
              tasks={localTasks}
              selectedTasks={selectedTasks}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="flex-grow overflow-hidden mt-0 p-0">
          <CompletedTasks
            tasks={completedTasks}
            onTasksClear={handleClearCompletedTasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
