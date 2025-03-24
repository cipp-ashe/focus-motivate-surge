
import React from 'react';
import { ActiveTemplate } from '@/types/habits/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';

export interface TemplateListProps {
  templates: ActiveTemplate[];
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: any) => void;
}

export const ActiveTemplateList: React.FC<TemplateListProps> = ({
  templates,
  onRemoveTemplate,
  onConfigureTemplate
}) => {
  return (
    <ScrollArea className="max-h-[500px]">
      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.templateId}
            template={template}
            onRemove={() => onRemoveTemplate(template.templateId)}
            onConfigure={() => onConfigureTemplate(template)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
