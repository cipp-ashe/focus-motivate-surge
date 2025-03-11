
import React from "react";
import { Button } from "@/components/ui/button";

interface JournalFooterProps {
  isExistingNote: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const JournalFooter: React.FC<JournalFooterProps> = ({
  isExistingNote,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave}>
        {isExistingNote ? "Update Journal Entry" : "Save Journal Entry"}
      </Button>
    </div>
  );
};

export default JournalFooter;
