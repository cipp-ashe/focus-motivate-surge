
import React from 'react';
import { TaskList } from './TaskList';
import { TaskInput } from './TaskInput';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

interface TimerViewProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  tasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd
}) => {
  // Filter only timer tasks for display in timer view
  const timerTasks = tasks.filter(task => task.taskType === 'timer');
  
  return (
    <div className="flex flex-col h-full bg-background/20 dark:bg-[#1A1F2C] rounded-xl overflow-hidden shadow-sm border border-border/30">
      <div className="p-4 border-b border-border/10 bg-background/30 dark:bg-[#1A1F2C]">
        <TaskInput 
          onTaskAdd={onTaskAdd} 
          onTasksAdd={onTasksAdd}
          defaultTaskType="timer"
          simplifiedView
        />
      </div>
      <div className="flex-1 overflow-auto">
        <TaskList
          tasks={timerTasks}
          selectedTasks={selectedTaskId ? [selectedTaskId] : []}
          onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
          simplifiedView
        />
      </div>
    </div>
  );
};
