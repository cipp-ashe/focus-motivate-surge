
import { useState } from 'react';
import { ActiveTemplate } from '../types';

export const useDragAndDrop = (
  activeTemplates: ActiveTemplate[],
  updateTemplateOrder: (templates: ActiveTemplate[]) => void
) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTemplates = [...activeTemplates];
    const [draggedTemplate] = newTemplates.splice(draggedIndex, 1);
    newTemplates.splice(index, 0, draggedTemplate);
    updateTemplateOrder(newTemplates);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

