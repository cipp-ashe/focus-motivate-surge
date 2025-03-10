
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
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="active" data-test="active-tasks-tab">
            Active Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-test="completed-tasks-tab">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="flex-grow overflow-hidden">
          <TaskTable
            tasks={tasks}
            selectedTasks={selectedTasks}
            onTaskClick={(task) => onTaskClick(task.id)}
          />
        </TabsContent>

        <TabsContent value="completed" className="flex-grow overflow-hidden">
          <CompletedTasks
            tasks={completedTasks}
            onClear={handleClearCompletedTasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
