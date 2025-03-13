
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Timer } from '@/components/timer/Timer';
import { Task } from '@/types/tasks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { TimerSection } from '@/components/timer/TimerSection';

interface TimerPageProps {}

const TimerPage: React.FC<TimerPageProps> = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerKey, setTimerKey] = useState(Date.now());
  const [favorites, setFavorites] = useState<any[]>([]);
  
  // Listen for timer initialization events
  useEffect(() => {
    const handleTimerInit = (event: CustomEvent) => {
      const { taskName, duration, taskId } = event.detail;
      console.log(`TimerPage - Received timer:init event for ${taskName} with duration ${duration}`);
      
      // If we have both taskId and taskName, try to find the task
      if (taskId) {
        try {
          const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
          const task = taskList.find((t: Task) => t.id === taskId);
          
          if (task) {
            console.log('TimerPage - Found task in storage:', task);
            setSelectedTask(task);
          } else {
            // If task not found, create a simple object with the provided details
            setSelectedTask({
              id: taskId,
              name: taskName,
              duration: duration,
              createdAt: new Date().toISOString(),
              completed: false,
              taskType: 'timer'
            });
          }
        } catch (e) {
          console.error('Error loading task from storage:', e);
          // Fallback to simple object
          setSelectedTask({
            id: taskId || 'temp-' + Date.now(),
            name: taskName,
            duration: duration,
            createdAt: new Date().toISOString(),
            completed: false,
            taskType: 'timer'
          });
        }
      } else if (taskName) {
        // Simple object with just the name and duration
        setSelectedTask({
          id: 'temp-' + Date.now(),
          name: taskName,
          duration: duration,
          createdAt: new Date().toISOString(),
          completed: false,
          taskType: 'timer'
        });
      }
      
      setTimerKey(Date.now());
    };
    
    // Listen for direct task setting through new timer:set-task event
    const handleTimerSetTask = (event: CustomEvent) => {
      const task = event.detail;
      console.log('TimerPage - Received direct task:', task);
      
      if (task) {
        setSelectedTask(task);
        setTimerKey(Date.now());
        toast.success(`Timer set for: ${task.name}`);
      }
    };
    
    window.addEventListener('timer:init', handleTimerInit as EventListener);
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    // Also listen for task:select events from the event bus
    const unsubscribe = eventBus.on('task:select', (taskId) => {
      console.log('TimerPage - task:select event received for:', taskId);
      
      try {
        const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
        const task = taskList.find((t: Task) => t.id === taskId);
        
        if (task) {
          console.log('TimerPage - Found task in storage:', task);
          setSelectedTask(task);
          setTimerKey(Date.now());
          
          // Only auto-convert to timer if on timer page
          if (task.taskType !== 'timer') {
            console.log('Converting selected task to timer type');
            eventBus.emit('task:update', {
              taskId: task.id,
              updates: { taskType: 'timer' }
            });
          }
        }
      } catch (e) {
        console.error('Error processing task:select event:', e);
      }
    });
    
    return () => {
      window.removeEventListener('timer:init', handleTimerInit as EventListener);
      window.removeEventListener('timer:set-task', handleTimerSetTask as EventListener);
      unsubscribe();
    };
  }, []);
  
  const handleTimerComplete = (taskId: string, metrics: any) => {
    console.log('TimerPage - Timer completed for task:', taskId, metrics);
    
    if (selectedTask) {
      // Mark the task as completed
      eventBus.emit('task:complete', { 
        taskId: selectedTask.id,
        metrics: metrics 
      });
      
      toast.success(`Timer completed for: ${selectedTask.name}`);
      
      // Reset the selected task
      setTimeout(() => {
        setSelectedTask(null);
      }, 3000);
    }
  };
  
  const handleAddTime = (minutes: number) => {
    console.log('TimerPage - Adding time to task:', selectedTask?.id, minutes);
    
    if (selectedTask) {
      const currentDuration = selectedTask.duration || 1500;
      const newDuration = currentDuration + (minutes * 60);
      
      // Update the task duration
      eventBus.emit('task:update', {
        taskId: selectedTask.id,
        updates: { duration: newDuration }
      });
      
      toast.info(`Added ${minutes} minutes to: ${selectedTask.name}`);
    }
  };
  
  const handleDurationChange = (minutes: number) => {
    console.log('TimerPage - Updating duration for task:', selectedTask?.id, minutes);
    
    if (selectedTask) {
      const newDuration = minutes * 60;
      
      // Update the task duration
      eventBus.emit('task:update', {
        taskId: selectedTask.id,
        updates: { duration: newDuration }
      });
    }
  };
  
  const TimerSectionComponent = (
    <div className="w-full h-full">
      {selectedTask ? (
        <Timer
          key={timerKey}
          taskName={selectedTask.name}
          duration={selectedTask.duration || 1500}
          onComplete={(metrics) => handleTimerComplete(selectedTask.id, metrics)}
          onAddTime={() => {}} // This was causing the type error, fixed to match expected signature
          onDurationChange={(minutes) => handleDurationChange(minutes)}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Task Selected</h2>
          <p className="text-muted-foreground mb-4">
            Select a task from the list to start the timer.
          </p>
        </div>
      )}
    </div>
  );
  
  const TaskSection = (
    <div className="w-full">
      <TaskManager key="timer-task-manager" />
    </div>
  );
  
  return (
    <TaskLayout
      mainContent={TimerSectionComponent}
      asideContent={TaskSection}
    />
  );
};

export default TimerPage;
