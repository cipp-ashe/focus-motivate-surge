
import React, { useState, useEffect } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Task } from '@/types/tasks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { TimerSection } from '@/components/timer/TimerSection';

interface TimerPageProps {}

const TimerPage: React.FC<TimerPageProps> = () => {
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
  
  // Render the timer page with the task section and timer section
  return (
    <TaskLayout
      mainContent={
        <div className="w-full h-full">
          <TimerSection 
            key={timerKey}
            selectedTask={selectedTask}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      }
      asideContent={
        <div className="w-full">
          <TaskManager key="timer-task-manager" isTimerView={true} />
        </div>
      }
    />
  );
};

export default TimerPage;
