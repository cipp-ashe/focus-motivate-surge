
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
  readOnly = false,
  minHeight = 'min-h-[200px]'
}) => {
  // Log the state of the content for debugging
  console.log('EditorContent rendering with content length:', content?.length || 0);
  
  return (
    <Textarea
      value={content}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "h-full w-full resize-none p-4 border-0 rounded-none focus-visible:ring-0 bg-transparent",
        "text-foreground dark:text-foreground",
        "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/70",
        minHeight,
        className
      )}
    />
  );
};
