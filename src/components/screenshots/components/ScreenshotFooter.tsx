
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Eye, Trash, Edit, Save, X } from "lucide-react";

interface ScreenshotFooterProps {
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const ScreenshotFooter: React.FC<ScreenshotFooterProps> = ({
  isExpanded,
  isEditing,
  onToggleExpand,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  return (
    <CardFooter className="p-4 pt-0 flex justify-between">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={onCancel}
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="text-xs h-8"
            onClick={onSave}
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={onToggleExpand}
          >
            <Eye className="h-3 w-3 mr-1" />
            {isExpanded ? "Less" : "More"}
          </Button>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={onEdit}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 text-destructive hover:bg-destructive/10"
              onClick={onDelete}
            >
              <Trash className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </>
      )}
    </CardFooter>
  );
};
