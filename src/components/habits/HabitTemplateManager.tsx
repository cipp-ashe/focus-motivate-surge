
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
  const processedTodayRef = useRef(new Set<string>());
  
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
    
    // Clear processed templates at midnight
    const clearProcessedTemplatesAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log("HabitTemplateManager: Resetting processed templates for the new day");
        processedTodayRef.current.clear();
        setupResetTimer();
      }, timeUntilMidnight);
    };
    
    const setupResetTimer = () => {
      clearProcessedTemplatesAtMidnight();
    };
    
    setupResetTimer();
    
  }, []);

  // Function to open config sheet
  const openConfig = () => {
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    setConfigOpen(open);
    if (!open) {
      // Reset processing state when sheet closes
      processingTemplateRef.current = null;
    }
  };

  // Handle template selection with proper debounce protection
  const handleSelectTemplate = (templateId: string) => {
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
    
    // Check if template was already processed today (additional protection)
    if (processedTodayRef.current.has(templateId)) {
      console.log(`Template ${templateId} was already processed today, avoiding duplicate processing`);
      return;
    }
    
    // Check both built-in and custom templates
    const template = 
      habitTemplates.find(t => t.id === templateId) || 
      customTemplates.find(t => t.id === templateId);
    
    if (template) {
      console.log("Adding template:", template);
      processingTemplateRef.current = templateId;
      processedTodayRef.current.add(templateId);
      
      // Pass the string templateId, not an object
      eventBus.emit('habit:template-add', templateId);
      toast.success(`Added template: ${template.name}`);
      
      // Clear processing state after a delay
      setTimeout(() => {
        processingTemplateRef.current = null;
        setConfigOpen(false); // Close the sheet after adding
      }, 500);
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
