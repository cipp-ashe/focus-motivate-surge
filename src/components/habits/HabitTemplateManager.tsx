
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import TemplateSelectionSheet from './TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { eventBus } from '@/lib/eventBus';

interface HabitTemplateManagerProps {
  activeTemplates: any[];
}

const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({ activeTemplates }) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);

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

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    // Check both built-in and custom templates
    const template = 
      habitTemplates.find(t => t.id === templateId) || 
      customTemplates.find(t => t.id === templateId);
    
    if (template) {
      console.log("Adding template:", template);
      eventBus.emit('habit:template-add', templateId);
      toast.success(`Added template: ${template.name}`);
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
