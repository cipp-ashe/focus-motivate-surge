import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ActiveTemplate } from '@/types/habits/types';
import { Button } from '@/components/ui/button';
import { TemplateCard } from './TemplateCard';
import { Edit, Trash2 } from 'lucide-react';

interface TemplateDragListProps {
  templates: ActiveTemplate[];
  onTemplateOrderChange: (newOrder: ActiveTemplate[]) => void;
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: any) => void;
}

export const TemplateDragList: React.FC<TemplateDragListProps> = ({
  templates,
  onTemplateOrderChange,
  onRemoveTemplate,
  onConfigureTemplate
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(templates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onTemplateOrderChange(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="templates">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {templates.map((template, index) => (
              <Draggable key={template.templateId} draggableId={template.templateId} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TemplateCard
                      template={template}
                      onRemove={() => onRemoveTemplate(template.templateId)}
                      onConfigure={() => onConfigureTemplate(template)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
