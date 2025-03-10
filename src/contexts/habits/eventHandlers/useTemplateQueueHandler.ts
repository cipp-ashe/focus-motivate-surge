
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/components/habits/types';
import { habitTemplates } from '@/utils/habitTemplates';

export const useTemplateQueueHandler = (
  activeTemplates: ActiveTemplate[], 
  dispatch: React.Dispatch<any>
) => {
  const templateAddQueue = useRef<string[]>([]);
  const isProcessingQueueRef = useRef<boolean>(false);
  const processingTemplateRef = useRef<string | null>(null);
  const templateProcessTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  /**
   * Process the next template in the queue
   */
  const processNextTemplateInQueue = useCallback(() => {
    // If queue is empty or already processing, do nothing
    if (templateAddQueue.current.length === 0 || isProcessingQueueRef.current) {
      isProcessingQueueRef.current = false;
      return;
    }
    
    // Set processing flag
    isProcessingQueueRef.current = true;
    
    // Get the next template from queue
    const templateId = templateAddQueue.current.shift()!;
    processingTemplateRef.current = templateId;
    
    console.log(`Processing template from queue: ${templateId}`);
    
    // Check if this template was already added
    if (activeTemplates.some(t => t.templateId === templateId)) {
      console.log(`Template ${templateId} already exists, skipping`);
      
      // Clear any timeout
      if (templateProcessTimeouts.current.has(templateId)) {
        clearTimeout(templateProcessTimeouts.current.get(templateId)!);
        templateProcessTimeouts.current.delete(templateId);
      }
      
      // Continue to next template in queue
      setTimeout(() => {
        processingTemplateRef.current = null;
        isProcessingQueueRef.current = false;
        processNextTemplateInQueue();
      }, 300);
      
      return;
    }
    
    // Find the template
    const template = habitTemplates.find(t => t.id === templateId);
    if (!template) {
      // If not a preset template, check if custom
      try {
        const customTemplatesStr = localStorage.getItem('custom-templates');
        if (customTemplatesStr) {
          const customTemplates = JSON.parse(customTemplatesStr);
          const customTemplate = customTemplates.find((t: any) => t.id === templateId);
          
          if (customTemplate) {
            // Create active template from custom template
            const newTemplate: ActiveTemplate = {
              templateId: customTemplate.id,
              habits: customTemplate.defaultHabits || [],
              activeDays: customTemplate.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              customized: false,
              name: customTemplate.name,
              description: customTemplate.description
            };
            
            // Add the template
            dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
            
            // Success
            console.log(`Added custom template ${templateId} to active templates`);
            
            // Wait a bit before processing next template
            setTimeout(() => {
              processingTemplateRef.current = null;
              isProcessingQueueRef.current = false;
              processNextTemplateInQueue();
            }, 300);
            
            return;
          }
        }
      } catch (error) {
        console.error('Error processing custom template:', error);
      }
      
      console.error(`Template ${templateId} not found in presets or custom templates`);
      isProcessingQueueRef.current = false;
      processingTemplateRef.current = null;
      processNextTemplateInQueue();
      return;
    }
    
    // Create the template
    const newTemplate: ActiveTemplate = {
      templateId: template.id,
      habits: template.defaultHabits,
      activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      customized: false,
      name: template.name,
      description: template.description
    };
    
    // Add to active templates via dispatch
    dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
    
    // Update localStorage
    const updatedTemplates = [...activeTemplates, newTemplate];
    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
    
    console.log(`Successfully added template ${templateId}`);
    
    // Notify via event manager (no longer emit toast here - parent component does it)
    eventManager.emit('habit:template-update', { ...newTemplate, suppressToast: true });
    
    // Clean up timeout if it exists
    if (templateProcessTimeouts.current.has(templateId)) {
      clearTimeout(templateProcessTimeouts.current.get(templateId)!);
      templateProcessTimeouts.current.delete(templateId);
    }
    
    // Process next item in queue after a delay
    setTimeout(() => {
      processingTemplateRef.current = null;
      isProcessingQueueRef.current = false;
      processNextTemplateInQueue();
    }, 500);
  }, [activeTemplates, dispatch]);
  
  return {
    templateAddQueue,
    isProcessingQueueRef,
    processingTemplateRef,
    templateProcessTimeouts,
    processNextTemplateInQueue
  };
};
