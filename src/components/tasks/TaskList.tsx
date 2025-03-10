
import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTasks,
  onTaskClick,
}) => {
  const { completed: completedTasks } = useTaskContext();
  const [activeTab, setActiveTab] = useState('active');

  // Debug: Log tasks whenever they change
  React.useEffect(() => {
    console.log("TaskList received tasks:", tasks.length, "tasks:", tasks);
  }, [tasks]);

  const handleClearCompletedTasks = () => {
    completedTasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' });
    });
  };

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
              Active Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-test="completed-tasks-tab">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="flex-grow overflow-hidden mt-0 p-0">
          <TaskTable
            tasks={tasks}
            selectedTasks={selectedTasks}
          />
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
