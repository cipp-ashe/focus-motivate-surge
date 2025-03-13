
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

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
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        {isExistingNote ? "Update Journal Entry" : "Save Journal Entry"}
      </Button>
    </div>
  );
};

export default JournalFooter;
