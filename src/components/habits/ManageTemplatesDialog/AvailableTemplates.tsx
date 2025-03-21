
import React from 'react';
import { HabitTemplate } from '../types';
import TemplateCard from './TemplateCard';

interface AvailableTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
}

const AvailableTemplates: React.FC<AvailableTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {templates.map((template) => {
        const isActive = activeTemplateIds.includes(template.id);
        
        return (
          <TemplateCard
            key={template.id}
            template={template}
            isActive={isActive}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};

export default AvailableTemplates;
