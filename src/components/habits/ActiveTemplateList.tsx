
import React, { useEffect, useState } from 'react';
import { ActiveTemplate, DayOfWeek } from './types';
import TemplateCard from './TemplateCard';
import { habitTemplates } from '../../utils/habitTemplates';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import ConfigurationDialog from './ConfigurationDialog';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { cn } from '@/lib/utils';

interface TemplateListProps {
  activeTemplates: ActiveTemplate[];
  onRemove: (templateId: string) => void;
  getTodayProgress: (habitId: string, templateId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate: (habitId: string, templateId: string, value: boolean | number) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  activeTemplates,
  onRemove,
  getTodayProgress,
  onHabitUpdate,
}) => {
  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop(activeTemplates, () => {});

  const [editingTemplate, setEditingTemplate] = useState<ActiveTemplate | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Record<string, any>>({});

  useEffect(() => {
    console.log("ActiveTemplateList - activeTemplates:", activeTemplates);
    
    // Load custom templates for reference
    try {
      const customTemplatesStr = localStorage.getItem('custom-templates');
      if (customTemplatesStr) {
        const templates = JSON.parse(customTemplatesStr);
        const templateMap = {};
        
        templates.forEach(template => {
          templateMap[template.id] = template;
        });
        
        setCustomTemplates(templateMap);
      }
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  }, [activeTemplates]);

  const handleEditTemplate = (template: ActiveTemplate) => {
    setEditingTemplate(template);
    setIsConfigOpen(true);
  };

  const handleCloseConfig = () => {
    setIsConfigOpen(false);
    setEditingTemplate(null);
  };

  const handleSaveConfig = () => {
    if (!editingTemplate) return;
    
    // Save changes to template through event system
    eventBus.emit('habit:template-update', editingTemplate);
    toast.success('Template updated successfully');
    handleCloseConfig();
  };

  const handleUpdateDays = (days: DayOfWeek[]) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      activeDays: days,
      customized: true,
    });
  };

  const isCustomTemplate = (templateId: string) => {
    return templateId.startsWith('custom-');
  };

  const getCustomTemplateInfo = (templateId: string) => {
    return customTemplates[templateId];
  };

  if (activeTemplates.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No active templates found</p>
        <p className="text-xs text-muted-foreground mt-2">Add templates using the "Manage Habit Templates" button</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        "grid gap-3",
        activeTemplates.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      )}>
        {activeTemplates.map((template, index) => {
          // Check if it's a custom template first
          if (isCustomTemplate(template.templateId)) {
            const customTemplateInfo = getCustomTemplateInfo(template.templateId);
            
            return (
              <div
                key={template.templateId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "transition-transform cursor-move",
                  draggedIndex === index ? 'scale-[1.01] opacity-80 shadow-md' : ''
                )}
              >
                <TemplateCard
                  template={template}
                  templateInfo={{
                    id: template.templateId,
                    name: customTemplateInfo?.name || template.name || "Custom Template",
                    description: customTemplateInfo?.description || template.description || "Your custom template",
                    defaultHabits: template.habits,
                    defaultDays: template.activeDays
                  }}
                  onRemove={() => onRemove(template.templateId)}
                  onEdit={() => handleEditTemplate(template)}
                  getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
                  onHabitUpdate={(habitId, value) => onHabitUpdate(habitId, template.templateId, value)}
                />
              </div>
            );
          }

          // Standard predefined template
          const templateInfo = habitTemplates.find(t => t.id === template.templateId);
          
          if (!templateInfo) {
            return null;
          }

          return (
            <div
              key={template.templateId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "transition-transform cursor-move",
                draggedIndex === index ? 'scale-[1.01] opacity-80 shadow-md' : ''
              )}
            >
              <TemplateCard
                template={template}
                templateInfo={templateInfo}
                onRemove={() => onRemove(template.templateId)}
                onEdit={() => handleEditTemplate(template)}
                getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
                onHabitUpdate={(habitId, value) => onHabitUpdate(habitId, template.templateId, value)}
              />
            </div>
          );
        })}
      </div>

      {editingTemplate && (
        <ConfigurationDialog
          open={isConfigOpen}
          onClose={handleCloseConfig}
          onSave={handleSaveConfig}
          onSaveAsTemplate={() => {
            toast.info("Save as template feature coming soon");
          }}
          habits={editingTemplate.habits}
          activeDays={editingTemplate.activeDays}
          onUpdateDays={handleUpdateDays}
        />
      )}
    </>
  );
};

export default TemplateList;
