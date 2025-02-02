import { useState, useCallback } from "react";
import { Task } from "@/components/TaskList";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { toast } from "@/hooks/use-toast";

export const useTaskOperations = ({
  initialTasks = [],
  initialCompletedTasks = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
}: {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskAdd = useCallback((task: Task) => {
    console.log('Adding task:', task.name);
    setTasks(prev => {
      const newTasks = [...prev, task];
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
  }, [onTasksUpdate]);

  const handleTaskSelect = useCallback((task: Task) => {
    console.log('Selecting task:', task.name);
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, ...task } : t
    ));
    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const updatedTasks = storedTasks.map((t: Task) => t.id === task.id ? { ...t, ...task } : t);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    setSelectedTask(task);
    toast({
      title: "Task Selected",
      description: `Selected task: ${task.name}`
    });
  }, []);

  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    console.log('TaskManager - Task completion flow:', {
      incomingMetrics: metrics,
      selectedTask
    });
    
    if (selectedTask) {
      setCompletedTasks(prev => {
        const newCompleted = [...prev, {
          ...selectedTask,
          completed: true,
          metrics: metrics
        }];
        onCompletedTasksUpdate?.(newCompleted);
        return newCompleted;
      });
      
      setTasks(prev => {
        const newTasks = prev.filter(t => t.id !== selectedTask.id);
        onTasksUpdate?.(newTasks);
        return newTasks;
      });
      
      setSelectedTask(null);
      toast({
        title: "Task Completed",
        description: `Task completed: ${selectedTask.name}`
      });
    }
  }, [selectedTask, onTasksUpdate, onCompletedTasksUpdate]);

  const handleTasksClear = useCallback(() => {
    console.log('Clearing all tasks');
    setTasks([]);
    onTasksUpdate?.([]);
  }, [onTasksUpdate]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    console.log('Clearing selected tasks:', taskIds);
    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      setSelectedTask(null);
    }
  }, [selectedTask, onTasksUpdate]);

  return {
    tasks,
    setTasks,
    completedTasks,
    selectedTask,
    handleTaskAdd,
    handleTaskSelect,
    handleTaskComplete,
    handleTasksClear,
    handleSelectedTasksClear,
  };
};