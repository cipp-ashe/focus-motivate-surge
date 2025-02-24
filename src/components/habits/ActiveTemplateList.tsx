
import React from 'react';
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

  return (
    <div className="space-y-4">
      {activeTemplates.map((template, index) => {
        const templateInfo = habitTemplates.find(t => t.id === template.templateId);
        if (!templateInfo) return null;

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
