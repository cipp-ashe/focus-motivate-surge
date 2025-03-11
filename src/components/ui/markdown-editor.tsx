
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import MDEditor from '@uiw/react-md-editor';
import { marked } from 'marked';
import { cn } from '@/lib/utils';
import { 
  Bold, Italic, Link, List, ListOrdered, Quote, Code, 
  Heading1, Heading2, Heading3, Image, Undo, Redo, Strikethrough
} from 'lucide-react';
import { Button } from './button';
import { Separator } from './separator';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  height?: string;
  preview?: 'live' | 'edit' | 'preview';
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onBlur,
  className,
  placeholder = 'Write your notes here...',
  height = '100%',
  preview = 'edit'
}) => {
  const [activeTab, setActiveTab] = useState<string>('write');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  
  const handlePreviewClick = () => {
    // Save content when switching to preview
    if (onBlur) {
      onBlur();
    }
    setActiveTab('preview');
  };

  const renderedHTML = value ? marked(value) : '';
  
  const insertMarkdown = (type: string) => {
    if (!onChange) return;
    
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
    if (!textarea) return;
    
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selectedText = value.substring(start, end);
    let newText = '';
    
    switch(type) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading1':
        newText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'heading2':
        newText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'heading3':
        newText = `\n### ${selectedText || 'Heading 3'}\n`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        newText = `![${selectedText || 'alt text'}](image-url)`;
        break;
      case 'bulletList':
        newText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'numberedList':
        newText = `\n1. ${selectedText || 'List item'}\n`;
        break;
      case 'quote':
        newText = `\n> ${selectedText || 'Quote'}\n`;
        break;
      case 'code':
        newText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : "```\ncode block\n```";
        break;
      case 'inlineCode':
        newText = `\`${selectedText || 'code'}\``;
        break;
      case 'strikethrough':
        newText = `~~${selectedText || 'strikethrough text'}~~`;
        break;
      default:
        return;
    }
    
    const newContent = value.substring(0, start) + newText + value.substring(end);
    onChange(newContent);
    
    // Focus and set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="border-b border-border/10 px-2">
          <TabsList className="h-9 my-1.5">
            <TabsTrigger value="write" className="text-xs px-3">Write</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-3" onClick={handlePreviewClick}>Preview</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="write" className="flex-1 p-0 data-[state=active]:flex flex-col h-[calc(100%-44px)]">
          {/* Toolbar */}
          <div className="flex items-center p-1 gap-0.5 border-b border-border/10 overflow-x-auto scrollbar-none">
            <div className="flex flex-wrap items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('bold')}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('italic')}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('strikethrough')}>
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('heading1')}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('heading2')}>
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('heading3')}>
                <Heading3 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('bulletList')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('numberedList')}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('quote')}>
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('code')}>
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('link')}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown('image')}>
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <MDEditor
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            preview={preview}
            hideToolbar
            textareaProps={{
              placeholder,
              style: {
                height: height,
                background: 'transparent',
                borderRadius: '0',
                padding: '1rem'
              }
            }}
            className="w-md-editor-without-border h-full w-full border-none outline-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="h-[calc(100%-44px)] p-4 overflow-auto">
          {value ? (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: renderedHTML }} 
            />
          ) : (
            <p className="text-muted-foreground text-sm italic">Nothing to preview</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
