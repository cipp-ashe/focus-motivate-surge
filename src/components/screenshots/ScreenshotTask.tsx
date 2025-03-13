
import { useState } from "react";
import { Task } from "@/types/tasks";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";
import { ScreenshotHeader } from "./components/ScreenshotHeader";
import { ScreenshotContent } from "./components/ScreenshotContent";
import { ScreenshotFooter } from "./components/ScreenshotFooter";

interface ScreenshotTaskProps {
  task: Task;
}

export const ScreenshotTask: React.FC<ScreenshotTaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description || "");

  const handleDelete = () => {
    eventBus.emit('task:delete', { taskId: task.id });
    toast.success("Screenshot deleted");
  };

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updates = {
      name: editedName.trim(),
      description: editedDescription.trim()
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success("Screenshot details updated");
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 h-full">
      <ScreenshotHeader 
        task={task}
        isEditing={isEditing}
        editedName={editedName}
        editedDescription={editedDescription}
        setEditedName={setEditedName}
        setEditedDescription={setEditedDescription}
      />
      
      <ScreenshotContent 
        task={task}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      
      <ScreenshotFooter 
        isExpanded={isExpanded}
        isEditing={isEditing}
        onToggleExpand={toggleExpanded}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
      />
    </Card>
  );
};
