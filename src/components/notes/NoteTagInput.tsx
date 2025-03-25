
import React, { useState, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { TagColor } from '@/types/notes';
import { TagColorSelector } from '@/components/notes/TagColorSelector';

interface NoteTagInputProps {
  onAddTag: (name: string, color: string) => void;
}

export const NoteTagInput: React.FC<NoteTagInputProps> = ({ onAddTag }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<TagColor>('default');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when popover opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setTagName('');
      setSelectedColor('default');
    }
  };
  
  // Add tag and close popover
  const handleAddTag = () => {
    if (tagName.trim()) {
      onAddTag(tagName.trim(), selectedColor);
      setIsOpen(false);
      setTagName('');
      setSelectedColor('default');
    }
  };
  
  // Handle enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Tag
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <Input
            ref={inputRef}
            placeholder="Tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
          
          <TagColorSelector
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
          
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleAddTag} 
              disabled={!tagName.trim()}
              size="sm"
            >
              Add
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
