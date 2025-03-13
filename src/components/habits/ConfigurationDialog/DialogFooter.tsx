
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter as ShadcnDialogFooter } from "@/components/ui/dialog";
import { Save, X, BookTemplate } from "lucide-react";

interface DialogFooterProps {
  onSaveAsTemplate: () => void;
  onClose: () => void;
  onSave: () => void;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  onSaveAsTemplate,
  onClose,
  onSave,
}) => {
  return (
    <ShadcnDialogFooter className="flex justify-between items-center mt-6 border-t pt-4">
      <Button
        variant="outline"
        onClick={onSaveAsTemplate}
      >
        <BookTemplate className="h-4 w-4 mr-2" />
        Save as Custom Template
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" /> 
          Apply Changes
        </Button>
      </div>
    </ShadcnDialogFooter>
  );
};

export default DialogFooter;
