
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { TemplateSelectionSheet } from '@/components/habits';
import { habitTemplates } from '@/utils/habitTemplates';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from './types';

interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
}

const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({ activeTemplates }) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const isAddingRef = useRef<boolean>(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  // Function to open config sheet
  const openConfig = () => {
    // Prevent opening if we're currently adding a template
    if (isAddingRef.current) {
      console.log("Currently processing a template, postponing config open");
      return;
    }
    
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    setConfigOpen(open);
    if (!open) {
      // Clear any pending cooldown when explicitly closed
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
      isAddingRef.current = false;
    }
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    // Prevent duplicate template selection
    if (activeTemplates.some(t => t.templateId === templateId)) {
      toast.info(`Template already active`);
      return;
    }
    
    // Set global cooldown
    isAddingRef.current = true;
    
    // Check both built-in and custom templates
    const template = 
      habitTemplates.find(t => t.id === templateId) || 
      customTemplates.find(t => t.id === templateId);
    
    if (template) {
      console.log("Adding template:", template);
      
      // Emit template-add event to context
      eventManager.emit('habit:template-add', templateId);
      toast.success(`Added template: ${template.name}`);
      
      // Close sheet with slight delay for visual feedback
      setTimeout(() => {
        setConfigOpen(false);
        
        // Allow new additions after a shorter delay
        cooldownTimerRef.current = setTimeout(() => {
          isAddingRef.current = false;
        }, 300); // Reduced from 1000ms to 300ms for better UX
      }, 300);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-4">
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          onClick={openConfig}
          disabled={isAddingRef.current} // Disable only during active cooldown
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
