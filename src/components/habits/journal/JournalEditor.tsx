
import React, { useRef } from "react";
import { MarkdownEditor } from "@/components/ui/markdown-editor/index";

interface JournalEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ 
  content, 
  onChange,
  placeholder = "Write your thoughts here..." 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="flex-1" ref={editorRef}>
      <MarkdownEditor
        value={content}
        onChange={handleChange}
        height="100%"
        preview="edit"
        placeholder={placeholder}
      />
    </div>
  );
};

export default JournalEditor;
