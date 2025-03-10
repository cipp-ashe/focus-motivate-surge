
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  schedule: string;
  tags: string[];
  active: boolean;
}

interface HabitTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id: string;
    name: string;
    description: string;
    schedule: string;
    tags: string[];
    active: boolean;
  };
  isNewTemplate: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onScheduleChange: (schedule: string) => void;
  onTagsChange: (tags: string[]) => void;
  onActiveChange: (active: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const HabitTemplateDialog: React.FC<HabitTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  isNewTemplate,
  onNameChange,
  onDescriptionChange,
  onScheduleChange,
  onTagsChange,
  onActiveChange,
  onSave,
  onDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Habit Template</DialogTitle>
          <DialogDescription>
            {isNewTemplate ? "Create a new habit template." : "Update habit template."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={template.name} 
              className="col-span-3" 
              onChange={(e) => onNameChange(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={template.description} 
              className="col-span-3" 
              onChange={(e) => onDescriptionChange(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule" className="text-right">
              Schedule
            </Label>
            <Input 
              id="schedule" 
              value={template.schedule} 
              className="col-span-3" 
              onChange={(e) => onScheduleChange(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input 
              id="tags" 
              value={template.tags.join(',')} 
              className="col-span-3" 
              onChange={(e) => onTagsChange(e.target.value.split(','))} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Active
            </Label>
            <Checkbox 
              id="active" 
              checked={template.active} 
              onCheckedChange={(checked) => onActiveChange(checked === true)}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
          <Button type="submit" onClick={onSave}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
