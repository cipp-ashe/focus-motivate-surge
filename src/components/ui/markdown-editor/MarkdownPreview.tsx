
import React from 'react';
import { marked } from 'marked';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const renderedHTML = content ? marked(content) : '';
  
  return (
    <div className="h-full p-4 overflow-auto">
      {content ? (
        <div 
          className="prose prose-sm dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: renderedHTML }} 
        />
      ) : (
        <p className="text-muted-foreground text-sm italic">Nothing to preview</p>
      )}
    </div>
  );
};
