
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className
}) => {
  return (
    <Textarea
      value={content}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-full resize-none p-4 border-0 rounded-none focus-visible:ring-0 bg-transparent",
        className
      )}
    />
  );
};
