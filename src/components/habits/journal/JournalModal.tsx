
import React from "react";
import { Card } from "@/components/ui/card";
import { useJournal } from "./useJournal";
import JournalHeader from "./JournalHeader";
import JournalEditor from "./JournalEditor";
import JournalFooter from "./JournalFooter";

interface JournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitId: string;
  habitName: string;
  description?: string;
  onComplete: () => void;
  templateId?: string;
  taskId?: string;
}

const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onOpenChange,
  habitId,
  habitName,
  description = "",
  onComplete,
  templateId,
  taskId
}) => {
  const {
    content,
    setContent,
    randomQuote,
    randomPrompt,
    existingNote,
    template,
    handleSave
  } = useJournal({
    habitId,
    habitName,
    description,
    templateId,
    taskId,
    onComplete,
    onClose: () => onOpenChange(false)
  });

  if (!open) return null;
  
  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
    >
      {/* Overlay/Backdrop */}
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-md" 
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="container mx-auto p-6 flex flex-col gap-6 min-h-screen max-w-[1200px]">
          {/* Header Section with Quote */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg p-6 border-primary/20">
            <JournalHeader
              title={template.title}
              isExistingNote={!!existingNote}
              quote={randomQuote}
              prompt={randomPrompt}
              onClose={() => onOpenChange(false)}
            />
          </Card>

          {/* Editor Section */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg border-primary/20 flex-1 min-h-[500px]">
            <div className="p-6 h-full flex flex-col">
              <JournalEditor 
                content={content} 
                onChange={setContent} 
              />
            </div>
          </Card>

          {/* Footer with Actions */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg p-4 border-primary/20">
            <JournalFooter
              isExistingNote={!!existingNote}
              onSave={handleSave}
              onCancel={() => onOpenChange(false)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
