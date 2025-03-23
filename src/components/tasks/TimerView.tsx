
import React, { useState, useEffect } from 'react';
import { Task, Tag } from '@/types/tasks';
import { TaskInput } from './TaskInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { TaskIcon } from './components/TaskIcon';
import { StatusDropdownMenu } from './components/buttons/StatusDropdownMenu';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { taskStorage } from '@/lib/storage/taskStorage';

interface TimerViewProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({ 
  tasks: propTasks, 
  selectedTaskId, 
  onTaskAdd, 
  onTasksAdd
}) => {
  // Use the task context to ensure we always have the latest tasks
  const taskContext = useTaskContext();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Load tasks initially, including from storage to ensure we don't miss any
  useEffect(() => {
    const loadTasks = () => {
      // Get all tasks from context first
      const contextTasks = taskContext?.items || [];
      
      // Also check storage to ensure we have all tasks
      const storedTasks = taskStorage.loadTasks();
      
      // Create a merged set of tasks, prioritizing context tasks but including any from storage
      // that might be missing from context
      const mergedTasks = [...contextTasks];
      
      // Add any stored tasks that aren't already in the context
      storedTasks.forEach(storedTask => {
        if (!contextTasks.some(t => t.id === storedTask.id)) {
          mergedTasks.push(storedTask);
        }
      });
      
      // Filter to only timer and focus tasks, but also include any task that
      // might have been tagged as timer on the task page but doesn't have taskType set
      const filteredTasks = mergedTasks.filter(task => 
        task.taskType === 'timer' || 
        task.taskType === 'focus' ||
        // Include tasks that are tagged with timer in their tags array
        (task.tags && task.tags.some(tag => 
          typeof tag === 'object' && tag.name === 'timer'
        ))
      );
      
      console.log(`TimerView: Loaded ${filteredTasks.length} timer/focus tasks`);
      setLocalTasks(filteredTasks);
    };
    
    // Load tasks immediately
    loadTasks();
    
    // Set up refresh handlers
    const handleTaskUpdate = () => {
      loadTasks();
    };
    
    // Listen for updates
    window.addEventListener('task-ui-refresh', handleTaskUpdate);
    window.addEventListener('force-task-update', handleTaskUpdate);
    
    // Also listen for the tasksUpdated event from taskStorage
    window.addEventListener('tasksUpdated', handleTaskUpdate);
    
    // Force a reload when this component mounts to ensure we have fresh data
    eventManager.emit('task:reload', {});
    
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskUpdate);
      window.removeEventListener('force-task-update', handleTaskUpdate);
      window.removeEventListener('tasksUpdated', handleTaskUpdate);
    };
  }, [taskContext?.items, propTasks]);
  
  // State for duration input
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [durationValues, setDurationValues] = useState<Record<string, string>>({});
  
  const handleTaskSelect = (task: Task) => {
    console.log("TimerView: Selected task", task.id, "of type", task.taskType);
    
    // Use eventManager directly instead of eventBus
    eventManager.emit('task:select', task.id);
    eventManager.emit('timer:set-task', task);
    
    // Also dispatch window event for backward compatibility
    window.dispatchEvent(new CustomEvent('timer:set-task', { detail: task }));
    
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
      
      // Use eventManager instead of eventBus
      eventManager.emit('task:update', {
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
  
  // Make sure we're using the local tasks instead of the filtered prop tasks
  const timerTasks = localTasks;
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <TaskInput 
          onTaskAdd={(task) => {
            // Ensure the task is marked as a timer task
            const timerTask = {
              ...task,
              taskType: task.taskType || 'timer'
            };
            onTaskAdd(timerTask);
            
            // Update local state immediately
            setLocalTasks(prev => [timerTask, ...prev]);
          }} 
          onTasksAdd={(tasks) => {
            // Ensure all tasks are marked as timer tasks
            const timerTasks = tasks.map(task => ({
              ...task,
              taskType: task.taskType || 'timer'
            }));
            onTasksAdd(timerTasks);
            
            // Update local state immediately
            setLocalTasks(prev => [...timerTasks, ...prev]);
          }}
          defaultTaskType="timer"
          simplifiedView
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {localTasks.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
              No timer or focus tasks found. Add a timer or focus task to get started.
            </div>
          ) : (
            localTasks.map((task) => (
              <Card 
                key={task.id}
                className={`cursor-pointer transition-all duration-200 ${
                  task.id === selectedTaskId 
                    ? 'bg-accent/20 border-primary/40' 
                    : 'bg-card hover:border-primary/30 hover:bg-accent/10'
                }`}
                onClick={() => handleTaskSelect(task)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="flex-shrink-0">
                      <TaskIcon taskType={task.taskType} className="h-5 w-5" />
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
