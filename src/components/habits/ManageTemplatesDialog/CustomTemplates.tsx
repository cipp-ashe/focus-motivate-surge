
import React from 'react';
import { HabitTemplate } from '../types';
import TemplateCard from './TemplateCard';
import { cn } from '@/lib/utils';

interface CustomTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
  onDelete: (templateId: string) => void;
}

const CustomTemplates: React.FC<CustomTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
  onDelete,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No custom templates yet.</p>
        <p className="mt-1">Create one using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => {
        const isActive = activeTemplateIds.includes(template.id);
        
        return (
          <TemplateCard
            key={template.id}
            template={template}
            isActive={isActive}
            onSelect={onSelect}
            onDelete={onDelete}
            isCustom={true}
          />
        );
      })}
    </div>
  );
};

export default CustomTemplates;
