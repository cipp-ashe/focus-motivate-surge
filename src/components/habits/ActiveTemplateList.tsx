
import React, { useEffect } from 'react';
import { ActiveTemplate } from './types';
import TemplateCard from './TemplateCard';
import { habitTemplates } from '../../utils/habitTemplates';
import { useDragAndDrop } from './hooks/useDragAndDrop';

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

  useEffect(() => {
    console.log("ActiveTemplateList - activeTemplates:", activeTemplates);
  }, [activeTemplates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activeTemplates.map((template, index) => {
        const templateInfo = habitTemplates.find(t => t.id === template.templateId);
        
        console.log(`Looking for template with ID: ${template.templateId}`);
        console.log("Found template info:", templateInfo);
        
        // Allow showing custom templates that may not be in the predefined list
        if (!templateInfo) {
          console.log(`Custom template with ID ${template.templateId}`);
          return (
            <div
              key={template.templateId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-transform ${
                draggedIndex === index ? 'scale-[1.02] opacity-75' : ''
              }`}
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
            className={`transition-transform ${
              draggedIndex === index ? 'scale-[1.02] opacity-75' : ''
            }`}
          >
            <TemplateCard
              template={template}
              templateInfo={templateInfo}
              onRemove={() => onRemove(template.templateId)}
              getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
              onHabitUpdate={(habitId, value) => onHabitUpdate(habitId, template.templateId, value)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TemplateList;
