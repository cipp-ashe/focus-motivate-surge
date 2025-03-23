
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate, NewTemplate } from './types';
import { eventManager } from '@/lib/events/EventManager';
import TemplateSelectionSheet from './TemplateSelectionSheet';
import ConfigurationDialog from './ConfigurationDialog';
import { predefinedTemplates } from './data/templates';

export interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
  onAddTemplate: (template: ActiveTemplate) => void;
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: ActiveTemplate) => void;
}

const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({
  activeTemplates,
  onAddTemplate,
  onRemoveTemplate,
  onConfigureTemplate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);
  const [activeTemplateIds, setActiveTemplateIds] = useState<string[]>([]);
  const [configuringTemplate, setConfiguringTemplate] = useState<ActiveTemplate | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  // Load custom templates
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('custom-templates');
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Failed to load custom templates:', error);
    }
  }, []);

  // Update active template IDs when activeTemplates changes
  useEffect(() => {
    setActiveTemplateIds(activeTemplates.map(t => t.templateId));
  }, [activeTemplates]);

  const handleSelectTemplate = useCallback((template: HabitTemplate) => {
    const isActive = activeTemplateIds.includes(template.id);
    
    if (isActive) {
      // Remove template
      onRemoveTemplate(template.id);
      toast.success(`Removed ${template.name} template`);
    } else {
      // Add template
      const activeTemplate: ActiveTemplate = {
        templateId: template.id,
        habits: template.defaultHabits || [],
        activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        customized: false,
        name: template.name,
        description: template.description
      };
      onAddTemplate(activeTemplate);
      toast.success(`Added ${template.name} template`);
    }
  }, [activeTemplateIds, onAddTemplate, onRemoveTemplate]);

  const handleCreateTemplate = useCallback((template: NewTemplate) => {
    // Close sheet and open custom template creation
    setIsOpen(false);
    // Emit event to create custom template
    eventManager.emit('habit:custom-template-create', { 
      id: `custom-${Date.now()}`, 
      name: template?.name || 'New Template',
      defaultHabits: template?.habits || [],
      defaultDays: template?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      description: template?.description || 'Custom template',
      category: 'Custom',
      duration: null
    });
  }, []);

  const handleDeleteCustomTemplate = useCallback((templateId: string) => {
    // Remove from active templates if it's active
    if (activeTemplateIds.includes(templateId)) {
      onRemoveTemplate(templateId);
    }
    
    // Remove from storage
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
    
    // Emit event
    eventManager.emit('habit:custom-template-delete', { templateId });
    toast.success('Custom template deleted');
  }, [activeTemplateIds, customTemplates, onRemoveTemplate]);

  const handleCloseTemplateSheet = useCallback(() => {
    // Reload custom templates when sheet closes
    try {
      const savedTemplates = localStorage.getItem('custom-templates');
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Failed to load custom templates:', error);
    }
  }, []);

  const handleConfigureTemplate = useCallback((template: ActiveTemplate) => {
    setConfiguringTemplate(template);
    setConfigDialogOpen(true);
  }, []);

  const handleSaveConfiguration = useCallback(() => {
    if (!configuringTemplate) return;
    
    onConfigureTemplate(configuringTemplate);
    setConfigDialogOpen(false);
    setConfiguringTemplate(null);
    toast.success('Template configuration updated');
  }, [configuringTemplate, onConfigureTemplate]);

  const handleUpdateTemplateDays = useCallback((days: string[]) => {
    if (!configuringTemplate) return;
    
    setConfiguringTemplate(prev => {
      if (!prev) return null;
      return { ...prev, activeDays: days as any[] };
    });
  }, [configuringTemplate]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Habit Templates</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="text-xs">Add Template</span>
          </Button>
        </div>
      </div>

      <TemplateSelectionSheet 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        allTemplates={predefinedTemplates}
        activeTemplateIds={activeTemplateIds}
        onSelectTemplate={handleSelectTemplate}
        onCreateTemplate={handleCreateTemplate}
        customTemplates={customTemplates}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        onClose={handleCloseTemplateSheet}
      />
      
      {configuringTemplate && (
        <ConfigurationDialog
          open={configDialogOpen}
          onClose={() => {
            setConfigDialogOpen(false);
            setConfiguringTemplate(null);
          }}
          habits={configuringTemplate.habits}
          activeDays={configuringTemplate.activeDays}
          onUpdateDays={handleUpdateTemplateDays}
          onSave={handleSaveConfiguration}
          onSaveAsTemplate={() => {
            toast.info("Save as template feature coming soon");
          }}
        />
      )}
    </div>
  );
};

export default HabitTemplateManager;
