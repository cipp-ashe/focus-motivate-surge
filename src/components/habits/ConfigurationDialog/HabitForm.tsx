
import React from 'react';
import { HabitDetail } from '../types';
import HabitFormField from '../HabitFormField';

interface HabitFormProps {
  habit: HabitDetail;
  onUpdate: (updates: Partial<HabitDetail>) => void;
  onDelete: () => void;
  onDragStart?: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onUpdate,
  onDelete,
  onDragStart,
}) => {
  return (
    <HabitFormField
      habit={habit}
      onUpdate={onUpdate}
      onDelete={onDelete}
      isDraggable
      onDragStart={onDragStart}
    />
  );
};

export default HabitForm;
