import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Save, BookTemplate } from "lucide-react";
import { HabitDetail, DayOfWeek } from '@/types/habits/types';
import { DaySelector } from './DaySelector';
import { cn } from '@/lib/utils';

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
      <DialogContent className="max-w-md border border-border/40 bg-card text-card-foreground">
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
            <ScrollArea className="h-48 border border-border/40 rounded-md p-2">
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No habits configured yet.</p>
              ) : (
                <div className="space-y-2">
                  {habits.map((habit) => (
                    <div key={habit.id} className="p-2 border border-border/40 rounded-md">
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
              <BookTemplate className={cn('w-4 h-4 mr-2')} />
              Save as Template
            </Button>
          )}
          <Button onClick={onSave}>
            <Save className={cn('w-4 h-4 mr-2')} />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
