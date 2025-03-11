
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';
import { MarkdownToolbar } from './MarkdownToolbar';
import { MarkdownPreview } from './MarkdownPreview';
import { insertMarkdownText } from './markdown-utils';

export interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  onToolbarAction?: (action: string) => void;
  className?: string;
  placeholder?: string;
  height?: string;
  preview?: 'live' | 'edit' | 'preview';
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onBlur,
  onToolbarAction,
  className,
  placeholder = 'Write your notes here...',
  height = '100%',
  preview = 'edit'
}) => {
  const [activeTab, setActiveTab] = useState<string>('write');
  const editorRef = useRef<HTMLDivElement>(null);
  
  const handlePreviewClick = () => {
    if (onBlur) {
      onBlur();
    }
    setActiveTab('preview');
  };

  const insertMarkdown = (type: string) => {
    if (!onChange) return;
    
    // Always notify parent about toolbar action first
    if (onToolbarAction) {
      onToolbarAction(type);
    }
    
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const result = insertMarkdownText({
      type,
      selectedText,
      value,
      selectionStart: start,
      selectionEnd: end
    });
    
    onChange(result.newContent);
    
    // Restore cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        result.newCursorPosition.start, 
        result.newCursorPosition.end
      );
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
          <MarkdownToolbar onActionClick={insertMarkdown} />
          
          <div ref={editorRef} className="flex-1">
            <MDEditor
              value={value}
              onChange={onChange}
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
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-[calc(100%-44px)]">
          <MarkdownPreview content={value} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor;
