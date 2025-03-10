
import React from 'react';
import { TaskList } from '../TaskList';
import { Task } from '@/types/tasks';
import { TabsContent } from '@/components/ui/tabs';
import { eventManager } from '@/lib/events/EventManager';

interface TaskTypeTabProps {
  value: string;
  tasks: Task[];
  selectedTaskId: string | null;
  className?: string;
}

export const TaskTypeTab: React.FC<TaskTypeTabProps> = ({
  value,
  tasks,
  selectedTaskId,
  className = "flex-1 overflow-auto p-0 m-0"
}) => {
  return (
    <TabsContent value={value} className={className}>
      <TaskList
        tasks={tasks}
        selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
      />
    </TabsContent>
  );
};
