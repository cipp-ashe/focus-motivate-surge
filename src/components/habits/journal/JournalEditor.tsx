
import React, { useRef } from "react";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

interface JournalEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1" ref={editorRef}>
      <MarkdownEditor
        value={content}
        onChange={onChange}
        height="100%"
        preview="edit"
      />
    </div>
  );
};

export default JournalEditor;
