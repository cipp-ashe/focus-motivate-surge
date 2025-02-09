
import React from 'react';
import { ActiveTemplate } from './types';
import { HabitTemplate } from './types';
import { habitTemplates } from '../../utils/habitTemplates';
import TemplateCard from './TemplateCard';
import HabitInsights from './HabitInsights';

interface DraggableTemplateListProps {
  activeTemplates: ActiveTemplate[];
  showInsights: boolean;
  insightTemplateId: string | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onCustomize: (template: ActiveTemplate) => void;
  onRemove: (templateId: string) => void;
  onToggleInsights: (template: ActiveTemplate) => void;
  getTodayProgress: (habitId: string, templateId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate: (habitId: string, templateId: string, value: boolean | number) => void;
  getWeeklyProgress: (habitId: string, templateId: string) => any[];
}

const DraggableTemplateList: React.FC<DraggableTemplateListProps> = ({
  activeTemplates,
  showInsights,
  insightTemplateId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onCustomize,
  onRemove,
  onToggleInsights,
  getTodayProgress,
  onHabitUpdate,
  getWeeklyProgress,
}) => {
  return (
    <div className="space-y-2">
      {activeTemplates.map((template, index) => {
        const templateInfo = habitTemplates.find(t => t.id === template.templateId);
        if (!templateInfo) return null;

        return (
          <div
            key={template.templateId}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <TemplateCard
              template={template}
              templateInfo={templateInfo}
              onCustomize={() => onCustomize(template)}
              onRemove={() => onRemove(template.templateId)}
              onToggleInsights={() => onToggleInsights(template)}
              getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
              onHabitUpdate={(habitId, value) => onHabitUpdate(habitId, template.templateId, value)}
            />

            {showInsights && insightTemplateId === template.templateId && (
              <div className="mt-2">
                <HabitInsights
                  habit={template.habits[0]}
                  progress={template.habits.map(habit => 
                    getWeeklyProgress(habit.id, template.templateId)
                  ).flat()}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DraggableTemplateList;

