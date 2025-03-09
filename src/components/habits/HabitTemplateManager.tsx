
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { TemplateSelectionSheet } from '@/components/habits';
import { habitTemplates } from '@/utils/habitTemplates';
import { eventBus } from '@/lib/eventBus';
import { ActiveTemplate } from './types';

interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
}

const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({ activeTemplates }) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const processingTemplateRef = useRef<string | null>(null);
  const eventTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load custom templates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom-templates');
      if (saved) {
        setCustomTemplates(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  }, []);

  // Function to open config sheet
  const openConfig = () => {
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    setConfigOpen(open);
  };

  // Handle template selection with proper debounce protection
  const handleSelectTemplate = (templateId: string) => {
    // Clear any pending timeouts to prevent multiple emissions
    if (eventTimeoutRef.current) {
      clearTimeout(eventTimeoutRef.current);
      eventTimeoutRef.current = null;
    }

    // Prevent duplicate template selection
    if (activeTemplates.some(t => t.templateId === templateId)) {
      toast.info(`Template already active`);
      return;
    }
    
    // Prevent selecting another template while one is being processed
    if (processingTemplateRef.current) {
      console.log(`Already processing template ${processingTemplateRef.current}, deferring ${templateId}`);
      return;
    }
    
    // Check both built-in and custom templates
    const template = 
      habitTemplates.find(t => t.id === templateId) || 
      customTemplates.find(t => t.id === templateId);
    
    if (template) {
      console.log("Adding template:", template);
      processingTemplateRef.current = templateId;
      
      // Use a timeout to ensure only one event is emitted
      eventTimeoutRef.current = setTimeout(() => {
        // Pass the string templateId, not an object
        eventBus.emit('habit:template-add', templateId);
        toast.success(`Added template: ${template.name}`);
        
        // Clear processing state after a short delay
        setTimeout(() => {
          processingTemplateRef.current = null;
        }, 500);
      }, 50);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (eventTimeoutRef.current) {
        clearTimeout(eventTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-4">
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          onClick={openConfig}
        >
          <Plus className="h-3.5 w-3.5" />
          Manage Habit Templates
        </Button>
      </div>

      {/* Template configuration */}
      <TemplateSelectionSheet
        isOpen={configOpen}
        onOpenChange={handleCloseConfig}
        allTemplates={habitTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={handleSelectTemplate}
        onCreateTemplate={() => {
          toast.info('Creating new template');
        }}
      />
    </>
  );
};

export default HabitTemplateManager;
