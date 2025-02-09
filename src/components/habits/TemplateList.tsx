
import React from 'react';
import { ActiveTemplate } from './types';
import TemplateCard from './TemplateCard';
import { habitTemplates } from '../../utils/habitTemplates';

interface TemplateListProps {
  activeTemplates: ActiveTemplate[];
  onConfigure: (template: ActiveTemplate) => void;
  onRemove: (templateId: string) => void;
  getTodayProgress: (habitId: string, templateId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate: (habitId: string, templateId: string, value: boolean | number) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  activeTemplates,
  onConfigure,
  onRemove,
  getTodayProgress,
  onHabitUpdate,
}) => {
  return (
    <div className="space-y-4">
      {activeTemplates.map((template) => {
        const templateInfo = habitTemplates.find(t => t.id === template.templateId);
        if (!templateInfo) return null;

        return (
          <TemplateCard
            key={template.templateId}
            template={template}
            templateInfo={templateInfo}
            onConfigure={() => onConfigure(template)}
            onRemove={() => onRemove(template.templateId)}
            getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
            onHabitUpdate={(habitId, value) => onHabitUpdate(habitId, template.templateId, value)}
          />
        );
      })}
    </div>
  );
};

export default TemplateList;
