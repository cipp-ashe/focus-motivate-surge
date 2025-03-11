
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import MDEditor from '@uiw/react-md-editor';
import { marked } from 'marked';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onBlur,
  className,
  placeholder = 'Write your notes here...'
}) => {
  const [activeTab, setActiveTab] = useState<string>('write');

  const handlePreviewClick = () => {
    // Save content when switching to preview
    if (onBlur) {
      onBlur();
    }
    setActiveTab('preview');
  };

  const renderedHTML = value ? marked(value) : '';

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
          <MDEditor
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            preview="edit"
            hideToolbar
            textareaProps={{
              placeholder,
              style: {
                height: '100%',
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
