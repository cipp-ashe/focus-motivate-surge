
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Save, X, Maximize, Minimize } from "lucide-react";

interface ScreenshotFooterProps {
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isMobile?: boolean;
}

export const ScreenshotFooter: React.FC<ScreenshotFooterProps> = ({
  isExpanded,
  isEditing,
  onToggleExpand,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isMobile = false,
}) => {
  // Use bigger buttons and more spacing on mobile for better touch targets
  const buttonSize = isMobile ? "default" : "sm";
  const iconSize = isMobile ? 16 : 14;

  return (
    <CardFooter className={`p-4 pt-3 flex justify-between ${isMobile ? 'py-3 px-3 gap-2' : ''}`}>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size={buttonSize}
              onClick={onCancel}
              className={isMobile ? "h-10 px-3" : ""}
            >
              <X className={`h-${iconSize / 4} w-${iconSize / 4} mr-1`} />
              Cancel
            </Button>
            <Button
              variant="default"
              size={buttonSize}
              onClick={onSave}
              className={isMobile ? "h-10 px-3" : ""}
            >
              <Save className={`h-${iconSize / 4} w-${iconSize / 4} mr-1`} />
              Save
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size={buttonSize}
            onClick={onEdit}
            className={isMobile ? "h-10 px-3" : ""}
          >
            <Edit className={`h-${iconSize / 4} w-${iconSize / 4} mr-1`} />
            Edit
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {!isEditing && (
          <>
            <Button 
              variant="ghost" 
              size={buttonSize} 
              onClick={onToggleExpand}
              className={isMobile ? "h-10 w-10 p-0" : ""}
            >
              {isExpanded ? (
                <Minimize className={`h-${iconSize / 4} w-${iconSize / 4}`} />
              ) : (
                <Maximize className={`h-${iconSize / 4} w-${iconSize / 4}`} />
              )}
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </Button>

            <Button 
              variant="ghost" 
              size={buttonSize} 
              onClick={onDelete}
              className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${isMobile ? "h-10 w-10 p-0" : ""}`}
            >
              <Trash2 className={`h-${iconSize / 4} w-${iconSize / 4}`} />
              <span className="sr-only">Delete</span>
            </Button>
          </>
        )}
      </div>
    </CardFooter>
  );
};
