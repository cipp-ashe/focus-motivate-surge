
import React from 'react';
import { Check } from 'lucide-react';
import { TagColor } from '@/types/notes';
import { cn } from '@/lib/utils';

interface TagColorSelectorProps {
  selectedColor: TagColor;
  onSelectColor: (color: TagColor) => void;
}

export const TagColorSelector: React.FC<TagColorSelectorProps> = ({
  selectedColor,
  onSelectColor
}) => {
  // Available colors with their display values
  const colors: { id: TagColor; bg: string; border: string }[] = [
    { id: 'default', bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-700' },
    { id: 'red', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-300 dark:border-red-800' },
    { id: 'green', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-800' },
    { id: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-800' },
    { id: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-800' },
    { id: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-800' },
    { id: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-800' },
    { id: 'cyan', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-300 dark:border-cyan-800' },
    { id: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-300 dark:border-pink-800' },
  ];
  
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Tag Color</label>
      <div className="grid grid-cols-5 gap-1">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            className={cn(
              "w-full aspect-square rounded-md flex items-center justify-center border",
              color.bg,
              color.border,
              selectedColor === color.id
                ? "ring-2 ring-primary ring-offset-1"
                : "hover:ring-1 hover:ring-muted-foreground/30"
            )}
            onClick={() => onSelectColor(color.id)}
          >
            {selectedColor === color.id && (
              <Check className="h-3 w-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
