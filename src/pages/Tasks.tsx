
import React, { useEffect } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';

const TaskPage = () => {
  // Set up event listeners for task actions
  useEffect(() => {
    // For image view
    const handleShowImage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      toast.info(`Viewing image for: ${taskName}`, {
        description: "Image viewer functionality is not yet implemented"
      });
      console.log('Show image event received:', imageUrl, taskName);
    };
    
    // For checklist view
    const handleOpenChecklist = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      toast.info(`Checklist for: ${taskName}`, {
        description: `${items.length} items to complete`
      });
      console.log('Open checklist event received:', taskId, items);
    };
    
    // For voice recorder
    const handleOpenVoiceRecorder = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { taskId, taskName } = customEvent.detail;
      
      toast.info(`Recording for: ${taskName}`, {
        description: "Voice recorder functionality is not yet implemented"
      });
      console.log('Open voice recorder event received:', taskId, taskName);
    };
    
    // Add event listeners
    window.addEventListener('show-image', handleShowImage);
    window.addEventListener('open-checklist', handleOpenChecklist);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    
    // Cleanup
    return () => {
      window.removeEventListener('show-image', handleShowImage);
      window.removeEventListener('open-checklist', handleOpenChecklist);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    };
  }, []);

  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Task Manager
      </h1>
      <TaskManager />
    </div>
  );
};

export default TaskPage;
