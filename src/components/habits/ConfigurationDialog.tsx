
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitDetail, DayOfWeek } from './types';
import DaySelector from './DaySelector';

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
  onSave: () => void;
  onSaveAsTemplate?: () => void;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onClose,
  habits,
  activeDays,
  onUpdateDays,
  onSave,
  onSaveAsTemplate,
  templateName = '',
  onTemplateNameChange
}) => {
  const [localDays, setLocalDays] = useState<DayOfWeek[]>(activeDays);
  const [localName, setLocalName] = useState(templateName);

  const handleDaysChange = (days: DayOfWeek[]) => {
    setLocalDays(days);
    if (onUpdateDays) {
      onUpdateDays(days);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    if (onTemplateNameChange) {
      onTemplateNameChange(e.target.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Template</DialogTitle>
          <DialogDescription>
            Configure the active days and habits for this template.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {onTemplateNameChange && (
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={localName}
                onChange={handleNameChange}
                placeholder="Enter template name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Active Days</Label>
            <DaySelector
              selectedDays={localDays}
              onChange={handleDaysChange}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Habits</Label>
            <ScrollArea className="h-48 border rounded-md p-2">
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No habits configured yet.</p>
              ) : (
                <div className="space-y-2">
                  {habits.map((habit) => (
                    <div key={habit.id} className="p-2 border rounded-md">
                      <h4 className="font-medium">{habit.name}</h4>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {habit.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {onSaveAsTemplate && (
            <Button variant="outline" onClick={onSaveAsTemplate}>
              Save as Template
            </Button>
          )}
          <Button onClick={onSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
