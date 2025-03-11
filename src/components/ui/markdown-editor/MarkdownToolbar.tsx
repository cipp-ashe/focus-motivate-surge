
import React from 'react';
import { Button } from '../button';
import { Separator } from '../separator';
import { 
  Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote, Code, 
  Heading1, Heading2, Heading3, Image, Strikethrough
} from 'lucide-react';

interface MarkdownToolbarProps {
  onActionClick: (type: string) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onActionClick }) => {
  return (
    <div className="flex items-center p-1 gap-0.5 border-b border-border/10 overflow-x-auto scrollbar-none">
      <div className="flex flex-wrap items-center">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('strikethrough')}>
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('heading1')}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('heading2')}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('heading3')}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('bulletList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('numberedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('quote')}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('code')}>
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('link')}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onActionClick('image')}>
          <Image className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
