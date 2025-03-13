
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskInput } from './TaskInput';
import { TaskContent } from './TaskContent';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimerViewProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TimerView: React.FC<TimerViewProps> = ({ 
  tasks, 
  selectedTaskId, 
  onTaskAdd, 
  onTasksAdd,
  dialogOpeners
}) => {
  // Filter for timer tasks only
  const timerTasks = tasks.filter(task => task.taskType === 'timer');
  
  const handleTaskSelect = (taskId: string) => {
    console.log("TimerView: Selected task", taskId);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <TaskInput 
          onTaskAdd={onTaskAdd} 
          onTasksAdd={onTasksAdd}
          defaultTaskType="timer"
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {timerTasks.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
              No timer tasks found. Add a timer task to get started.
            </div>
          ) : (
            timerTasks.map((task) => (
              <TaskContent
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onSelect={() => handleTaskSelect(task.id)}
                dialogOpeners={dialogOpeners}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
