
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { ActiveTemplate } from '@/components/habits/types';
import { habitTemplates } from '@/utils/habitTemplates';

export const useTemplateQueueHandler = (
  templates: ActiveTemplate[],
  dispatch: React.Dispatch<any>
) => {
  const processingTemplateRef = useRef<string | null>(null);
  const templateProcessTimeouts = useRef(new Map<string, NodeJS.Timeout>());
  const templateAddQueue = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);
  
  // Process a single template from the queue
  const processNextTemplateInQueue = () => {
    if (isProcessingQueueRef.current || templateAddQueue.current.length === 0) {
      return;
    }
    
    isProcessingQueueRef.current = true;
    const templateId = templateAddQueue.current.shift()!;
    
    try {
      console.log(`Processing queued template: ${templateId}`);
      
      // Find template in predefined templates or custom templates
      const template = habitTemplates.find(t => t.id === templateId);
      if (template) {
        const newTemplate: ActiveTemplate = {
          templateId: template.id,
          habits: template.defaultHabits,
          activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          customized: false,
        };
        
        // Add template if it doesn't already exist
        if (!templates.some(t => t.templateId === templateId)) {
          dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
          const updatedTemplates = [...templates, newTemplate];
          localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
          toast.success(`Template added: ${template.name}`);
          
          // Force reprocessing of today's habits (don't rely on the state update alone)
          window.dispatchEvent(new Event('force-habits-update'));
        }
      } else {
        // Check for custom template
        const customTemplatesStr = localStorage.getItem('custom-templates');
        if (customTemplatesStr) {
          const customTemplates = JSON.parse(customTemplatesStr);
          const customTemplate = customTemplates.find(t => t.id === templateId);
          if (customTemplate) {
            const newTemplate: ActiveTemplate = {
              templateId: customTemplate.id,
              habits: customTemplate.defaultHabits,
              activeDays: customTemplate.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              customized: false,
            };
            
            // Only add if not already present
            if (!templates.some(t => t.templateId === templateId)) {
              dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
              const updatedTemplates = [...templates, newTemplate];
              localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
              toast.success(`Custom template added: ${customTemplate.name}`);
              
              // Force reprocessing of today's habits
              window.dispatchEvent(new Event('force-habits-update'));
            }
          } else {
            toast.error(`Template not found: ${templateId}`);
          }
        } else {
          toast.error(`Template not found: ${templateId}`);
        }
      }
    } finally {
      // Process next template after a delay
      setTimeout(() => {
        isProcessingQueueRef.current = false;
        processNextTemplateInQueue();
      }, 1000);
    }
  };
  
  return {
    processNextTemplateInQueue,
    templateAddQueue,
    isProcessingQueueRef,
    processingTemplateRef,
    templateProcessTimeouts
  };
};
