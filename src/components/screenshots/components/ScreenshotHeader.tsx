
import React from "react";
import { Task } from "@/types/tasks";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ScreenshotHeaderProps {
  task: Task;
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
  setEditedName: (name: string) => void;
  setEditedDescription: (description: string) => void;
}

export const ScreenshotHeader: React.FC<ScreenshotHeaderProps> = ({
  task,
  isEditing,
  editedName,
  editedDescription,
  setEditedName,
  setEditedDescription,
}) => {
  return (
    <CardHeader className="p-4 pb-0">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Screenshot name"
            className="font-medium"
            autoFocus
          />
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add a description"
            className="min-h-[60px] text-sm"
          />
        </div>
      ) : (
        <>
          <CardTitle className="text-base font-medium line-clamp-1">
            {task.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {task.description || "No description"}
          </CardDescription>
        </>
      )}
    </CardHeader>
  );
};
