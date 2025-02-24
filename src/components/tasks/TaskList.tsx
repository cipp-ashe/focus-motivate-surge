import React from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: any) => void;
  onTasksClear: () => void;
  onCompletedTasksClear: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
  onCompletedTasksClear,
}) => {
  const handleTaskDelete = (taskId: string) => {
    eventBus.emit('task:delete', { taskId, reason: 'manual' });
  };

  const handleTasksClear = () => {
    tasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    });
  };

  const handleCompletedTasksClear = () => {
    eventBus.emit('task:delete', { taskId: tasks[0].id, reason: 'completed' });
  };

  return (
    <>
      <div className="section-header">
        <TaskInput onTaskAdd={handleTaskAdd} />
      </div>
      
      <div className="section-header">
        <HabitTaskManager 
          activeTemplates={activeTemplates}
        />
      </div>

      <div className="scrollable-content">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskClick={onTaskClick}
          onTaskDelete={(taskId) => eventBus.emit('task:delete', { taskId, reason: 'manual' })}
          onTasksUpdate={onTasksUpdate}
          onTasksClear={() => tasks.forEach(task => eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' }))}
        />
      </div>

      <div className="section-footer">
        <CompletedTasks 
          tasks={completedTasks}
          onTasksClear={() => completedTasks.forEach(task => eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' }))}
        />
      </div>
    </>
  );
};
