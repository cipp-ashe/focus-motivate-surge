
import React from 'react';
import { Task } from '@/types/tasks';
import { TabsContent } from '@/components/ui/tabs';
import CompletedTaskItem from './CompletedTaskItem';

interface CompletedTasksListProps {
  tasks: Task[];
  activeTab: 'all' | 'completed' | 'dismissed';
  onDeleteTask: (taskId: string) => void;
}

export const CompletedTasksList: React.FC<CompletedTasksListProps> = ({
  tasks,
  activeTab,
  onDeleteTask
}) => {
  return (
    <TabsContent value={activeTab} className="space-y-3 mt-0">
      {tasks.length === 0 ? (
        <div className="bg-muted/20 text-muted-foreground rounded-lg py-8 text-center">
          <p>No {activeTab} tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <CompletedTaskItem 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default CompletedTasksList;
