
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { HabitState } from './types';
import { useTemplateQueueHandler } from './eventHandlers/useTemplateQueueHandler';
import { useJournalEventHandlers } from './eventHandlers/useJournalEventHandlers';
import { useTemplateEventHandlers } from './eventHandlers/useTemplateEventHandlers';

// This hook handles all the event subscriptions for the habit context
export const useHabitEvents = (
  state: HabitState,
  dispatch: React.Dispatch<any>
) => {
  const { 
    processNextTemplateInQueue, 
    templateAddQueue,
    isProcessingQueueRef,
    processingTemplateRef,
    templateProcessTimeouts
  } = useTemplateQueueHandler(state.templates, dispatch);
  
  const {
    handleJournalCreation,
    handleJournalDeletion
  } = useJournalEventHandlers(state.templates, dispatch);
  
  const {
    handleTemplateUpdate,
    handleTemplateDelete,
    handleTemplateOrderUpdate,
    handleCustomTemplateDelete
  } = useTemplateEventHandlers(state.templates, dispatch);
  
  useEffect(() => {
    // Listen for force-habits-update custom event
    const handleForceHabitsUpdate = () => {
      console.log("Received force-habits-update event");
      // Just having this event will cause a rerender in components that listen for it
    };
    
    window.addEventListener('force-habits-update', handleForceHabitsUpdate);
    
    // Subscribe to template events
    const unsubscribers = [
      eventManager.on('habit:template-update', handleTemplateUpdate),
      eventManager.on('habit:template-delete', handleTemplateDelete),
      
      // Listen for template add events with improved queue processing
      eventManager.on('habit:template-add', (templateId: string) => {
        console.log("Event received: habit:template-add", templateId);
        
        // Clear any existing timeout for this template
        if (templateProcessTimeouts.current.has(templateId)) {
          clearTimeout(templateProcessTimeouts.current.get(templateId)!);
          templateProcessTimeouts.current.delete(templateId);
        }
        
        // Check if template is already added
        if (state.templates.some(t => t.templateId === templateId)) {
          console.log(`Template ${templateId} already exists in active templates, skipping`);
          return;
        }
        
        // Check if template is already in queue
        if (templateAddQueue.current.includes(templateId)) {
          console.log(`Template ${templateId} is already queued for processing, skipping`);
          return;
        }
        
        // Add to queue and start processing if needed
        templateAddQueue.current.push(templateId);
        console.log(`Added template ${templateId} to processing queue. Queue length: ${templateAddQueue.current.length}`);
        
        if (!isProcessingQueueRef.current) {
          processNextTemplateInQueue();
        }
      }),
      
      eventManager.on('habit:template-order-update', handleTemplateOrderUpdate),
      eventManager.on('habit:custom-template-delete', handleCustomTemplateDelete),
      
      // Listen for journal creation events to potentially mark habits as complete
      eventManager.on('note:create-from-habit', handleJournalCreation),
      
      // Listen for journal deletion events
      eventManager.on('habit:journal-deleted', handleJournalDeletion),
      
      // Listen for custom template updates via localStorage
      window.addEventListener('templatesUpdated', () => {
        try {
          const customTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
          dispatch({ type: 'LOAD_CUSTOM_TEMPLATES', payload: customTemplates });
        } catch (error) {
          console.error('Error loading custom templates:', error);
        }
      })
    ];

    return () => {
      // Clear all timeouts on unmount
      templateProcessTimeouts.current.forEach(timeout => clearTimeout(timeout));
      templateProcessTimeouts.current.clear();
      
      unsubscribers.forEach(unsub => typeof unsub === 'function' && unsub());
      window.removeEventListener('force-habits-update', handleForceHabitsUpdate);
      window.removeEventListener('templatesUpdated', () => {});
    };
  }, [
    state, 
    dispatch, 
    templateProcessTimeouts, 
    templateAddQueue, 
    isProcessingQueueRef, 
    processNextTemplateInQueue,
    handleTemplateUpdate,
    handleTemplateDelete,
    handleTemplateOrderUpdate,
    handleCustomTemplateDelete,
    handleJournalCreation,
    handleJournalDeletion
  ]);
};
