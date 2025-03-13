import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import { TaskInput } from './TaskInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { TaskIcon } from './components/TaskIcon';
import { StatusDropdownMenu } from './components/buttons/StatusDropdownMenu';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

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
  
  // State for duration input
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [durationValues, setDurationValues] = useState<Record<string, string>>({});
  
  const handleTaskSelect = (task: Task) => {
    console.log("TimerView: Selected task", task.id);
    eventBus.emit('timer:set-task', task);
    toast.success(`Selected timer task: ${task.name}`);
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setDurationValues({
        ...durationValues,
        [taskId]: value
      });
    }
  };
  
  const handleDurationBlur = (taskId: string) => {
    const value = durationValues[taskId];
    
    if (value) {
      const numValue = parseInt(value, 10);
      
      // Validate input value
      let finalValue = numValue;
      if (isNaN(numValue) || numValue < 1) {
        finalValue = 25; // Default to 25 minutes if invalid
      } else if (numValue > 120) {
        finalValue = 120; // Cap at 120 minutes
      }
      
      // Convert minutes to seconds and update task
      const durationInSeconds = finalValue * 60;
      
      eventBus.emit('task:update', {
        taskId,
        updates: { duration: durationInSeconds }
      });
      
      // Update the state with the validated value
      setDurationValues({
        ...durationValues,
        [taskId]: finalValue.toString()
      });
    }
    
    setEditingDuration(null);
  };
  
  const handleDurationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, taskId: string) => {
    if (e.key === 'Enter') {
      handleDurationBlur(taskId);
    } else if (e.key === 'Escape') {
      setEditingDuration(null);
    }
  };
  
  const getTaskDuration = (task: Task) => {
    // If there's a value in the state, use it
    if (durationValues[task.id]) {
      return durationValues[task.id];
    }
    
    // Otherwise calculate from the task itself
    return Math.round((task.duration || 1500) / 60).toString();
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
              <Card 
                key={task.id}
                className={`cursor-pointer transition-all duration-200 ${
                  task.id === selectedTaskId 
                    ? 'bg-accent/20 border-primary/40' 
                    : 'bg-card/40 border-primary/10 hover:border-primary/30 hover:bg-accent/10'
                }`}
                onClick={() => handleTaskSelect(task)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="flex-shrink-0">
                      <TaskIcon taskType="timer" className="h-5 w-5" />
                    </div>
                    
                    <div className="truncate">
                      <h3 className="font-medium leading-none truncate">{task.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Status Dropdown */}
                    <StatusDropdownMenu task={task} />
                    
                    {/* Duration Input */}
                    <div 
                      className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDuration(task.id);
                      }}
                    >
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      
                      {editingDuration === task.id ? (
                        <Input
                          type="text"
                          value={durationValues[task.id] || getTaskDuration(task)}
                          onChange={(e) => handleDurationChange(e, task.id)}
                          onBlur={() => handleDurationBlur(task.id)}
                          onKeyDown={(e) => handleDurationKeyDown(e, task.id)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="w-12 h-6 text-xs p-1 text-center"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {getTaskDuration(task)} min
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
