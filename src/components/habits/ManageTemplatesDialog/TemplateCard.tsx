
import React from 'react';
import { HabitTemplate } from '../types';
import TemplateCardView from './TemplateCardView';

interface TemplateCardProps {
  template: HabitTemplate;
  isActive: boolean;
  onSelect: (template: HabitTemplate) => void;
  onDelete?: (templateId: string) => void;
  isCustom?: boolean;
}

/**
 * TemplateCard handles the logic for template selection and deletion,
 * while delegating the presentation to TemplateCardView.
 */
const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isActive,
  onSelect,
  onDelete,
  isCustom = false,
}) => {
  const handleSelect = () => {
    onSelect(template);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    // Stop event propagation to prevent selection when clicking delete
    e.stopPropagation();
    
    if (onDelete) {
      console.log('Deleting template:', template.id);
      onDelete(template.id);
    }
  };

  return (
    <TemplateCardView
      template={template}
      isActive={isActive}
      isCustom={isCustom}
      onSelect={handleSelect}
      onDelete={isCustom && onDelete ? handleDelete : undefined}
    />
  );
};

export default TemplateCard;
