
import React, { useEffect } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';

const TaskPage = () => {
  // Set up event listeners for task actions with proper cleanup
  useEffect(() => {
    const handleShowImage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      toast.info(`Viewing image for: ${taskName}`, {
        description: "Image viewer functionality is not yet implemented"
      });
    };
    
    const handleOpenChecklist = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      toast.info(`Checklist for: ${taskName}`, {
        description: `${items.length} items to complete`
      });
    };
    
    const handleOpenVoiceRecorder = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { taskId, taskName } = customEvent.detail;
      
      toast.info(`Recording for: ${taskName}`, {
        description: "Voice recorder functionality is not yet implemented"
      });
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
  }, []); // Empty dependency array ensures this only runs once

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
