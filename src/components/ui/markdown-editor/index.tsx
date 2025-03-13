
import React, { useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';
import { MarkdownToolbar } from './MarkdownToolbar';
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
  const editorRef = useRef<HTMLDivElement>(null);
  
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
      <div className="flex-1 flex flex-col h-full">
        <MarkdownToolbar onActionClick={insertMarkdown} />
        
        <div ref={editorRef} className="flex-1">
          <MDEditor
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            hideToolbar
            preview={preview}
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
            previewOptions={{
              style: {
                display: 'none' // Hide the preview part when in edit mode
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
