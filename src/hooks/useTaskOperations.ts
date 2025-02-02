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
    console.log('Adding new task:', {
      taskId: task.id,
      taskName: task.name,
      duration: task.duration
    });
    
    setTasks(prev => {
      const newTasks = [...prev, task];
      console.log('Updated task list:', newTasks.map(t => ({ id: t.id, name: t.name })));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
  }, [onTasksUpdate]);

  const handleTaskSelect = useCallback((task: Task) => {
    console.log('Selecting task:', {
      taskId: task.id,
      taskName: task.name,
      duration: task.duration
    });
    
    setTasks(prev => {
      const updatedTasks = prev.map(t => 
        t.id === task.id ? { ...t, ...task } : t
      );
      console.log('Updated task properties:', {
        taskId: task.id,
        updates: task
      });
      return updatedTasks;
    });

    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const updatedTasks = storedTasks.map((t: Task) => t.id === task.id ? { ...t, ...task } : t);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    console.log('Updated localStorage with new task state');
    
    setSelectedTask(task);
    toast({
      title: "Task Selected",
      description: `Selected task: ${task.name}`
    });
  }, []);

  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    console.log('Completing task:', {
      selectedTask: selectedTask?.name,
      metrics: metrics
    });
    
    if (!selectedTask) {
      console.error('No task selected for completion');
      return;
    }
    
    setCompletedTasks(prev => {
      const newCompleted = [...prev, {
        ...selectedTask,
        completed: true,
        metrics: metrics
      }];
      console.log('Updated completed tasks list:', 
        newCompleted.map(t => ({ id: t.id, name: t.name }))
      );
      onCompletedTasksUpdate?.(newCompleted);
      return newCompleted;
    });
    
    setTasks(prev => {
      const newTasks = prev.filter(t => t.id !== selectedTask.id);
      console.log('Removed completed task from active tasks');
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    setSelectedTask(null);
    toast({
      title: "Task Completed",
      description: `Task completed: ${selectedTask.name}`
    });
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
      console.log('Remaining tasks after clear:', 
        newTasks.map(t => ({ id: t.id, name: t.name }))
      );
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      console.log('Currently selected task was cleared, resetting selection');
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