
import React, { useEffect, useRef } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

const TaskPage = () => {
  // Keep track of mounted state to prevent callbacks on unmounted component
  const isMounted = useRef(true);
  const isMobile = useIsMobile();
  
  // Set up event listeners for task actions with proper cleanup
  useEffect(() => {
    const handleShowImage = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      toast.info(`Viewing image for: ${taskName}`, {
        description: "Image viewer functionality is not yet implemented"
      });
    };
    
    const handleOpenChecklist = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      toast.info(`Checklist for: ${taskName}`, {
        description: `${items.length} items to complete`
      });
    };
    
    const handleOpenVoiceRecorder = (event: Event) => {
      if (!isMounted.current) return;
      
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
      isMounted.current = false;
      window.removeEventListener('show-image', handleShowImage);
      window.removeEventListener('open-checklist', handleOpenChecklist);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    };
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div className={`container mx-auto ${isMobile ? 'p-2' : 'py-3 px-4 sm:py-5 sm:px-6'} max-w-6xl`}>
      <h1 className={`${isMobile ? 'text-xl mb-2' : 'text-2xl sm:text-3xl mb-3 sm:mb-5'} font-bold text-primary`}>
        Task Manager
      </h1>
      <TaskManager />
    </div>
  );
};

export default TaskPage;
