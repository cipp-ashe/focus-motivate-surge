
import React from "react";
import { Task } from "@/types/tasks";
import { CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ScreenshotHeaderProps {
  task: Task;
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
  setEditedName: (name: string) => void;
  setEditedDescription: (description: string) => void;
  isMobile?: boolean;
}

export const ScreenshotHeader: React.FC<ScreenshotHeaderProps> = ({
  task,
  isEditing,
  editedName,
  editedDescription,
  setEditedName,
  setEditedDescription,
  isMobile = false,
}) => {
  return (
    <CardHeader className={`p-4 pb-0 ${isMobile ? 'py-3 px-3' : ''}`}>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Screenshot name"
            className="w-full h-9"
            autoFocus
          />
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="resize-none min-h-[60px]"
          />
        </div>
      ) : (
        <div>
          <h3 className={`font-semibold truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
            {task.name}
          </h3>
          {task.description && (
            <p className={`text-muted-foreground line-clamp-2 ${isMobile ? 'text-xs mt-0.5' : 'text-sm mt-1'}`}>
              {task.description}
            </p>
          )}
        </div>
      )}
    </CardHeader>
  );
};
