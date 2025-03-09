
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

  useEffect(() => {
    console.log("ActiveTemplateList - activeTemplates:", activeTemplates);
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
          const templateInfo = habitTemplates.find(t => t.id === template.templateId);
          
          // Allow showing custom templates that may not be in the predefined list
          if (!templateInfo) {
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
                    name: "Custom Template",
                    description: "Your custom template",
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
