
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { EmptyTimerState } from './EmptyTimerState'; 
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { Clock, Check } from 'lucide-react';
import { logger } from '@/utils/logManager';

export const FilteredTimerTaskList = () => {
  const { items } = useTaskContext();
  const { selectedTask, selectTask } = useTaskSelection();
  const [timerTasks, setTimerTasks] = useState<Task[]>([]);
  
  // Filter tasks to show only timer tasks
  useEffect(() => {
    logger.debug('FilteredTimerTaskList', 'Filtering timer tasks from', items.length, 'items');
    const filtered = items.filter(task => 
      task.taskType === 'timer' && !task.completed
    );
    setTimerTasks(filtered);
    logger.debug('FilteredTimerTaskList', 'Found', filtered.length, 'timer tasks');
  }, [items]);

  // Handle task selection
  const handleSelectTask = (task: Task) => {
    logger.debug('FilteredTimerTaskList', 'Selecting task:', task.name);
    selectTask(task);
  };

  if (timerTasks.length === 0) {
    return <EmptyTimerState />;
  }

  return (
    <div className="space-y-2">
      {timerTasks.map(task => (
        <div 
          key={task.id}
          className={`p-3 rounded-md border cursor-pointer transition-colors ${
            selectedTask?.id === task.id ? 
              'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/40' : 
              'bg-card hover:bg-card/80 border-border/30 dark:bg-slate-800/30 dark:border-slate-700/30 dark:hover:bg-slate-800/50'
          }`}
          onClick={() => handleSelectTask(task)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Clock className={`h-4 w-4 mt-0.5 ${
                selectedTask?.id === task.id ? 
                  'text-purple-500 dark:text-purple-400' : 
                  'text-muted-foreground dark:text-slate-400'
              }`} />
              <div>
                <h4 className={`font-medium text-sm ${
                  selectedTask?.id === task.id ? 
                    'text-purple-700 dark:text-purple-300' : 
                    'text-foreground dark:text-slate-200'
                }`}>
                  {task.name}
                </h4>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  {task.duration ? `${Math.floor(task.duration / 60)} minutes` : 'No duration set'}
                </p>
              </div>
            </div>
            
            {selectedTask?.id === task.id && (
              <div className="bg-purple-200 dark:bg-purple-700/40 rounded-full p-1">
                <Check className="h-3 w-3 text-purple-600 dark:text-purple-300" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
