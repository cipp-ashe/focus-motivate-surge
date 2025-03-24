
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DayOfWeek, HabitDetail } from '@/types/habit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DaySelector } from "./DaySelector";

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
  onSave: () => void;
  onSaveAsTemplate: () => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onClose,
  habits,
  activeDays,
  onUpdateDays,
  onSave,
  onSaveAsTemplate
}) => {
  const [selectedTab, setSelectedTab] = useState("days");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Template</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="days" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="days">Days</TabsTrigger>
          </TabsList>
          <Card className="border-none shadow-none">
            <TabsContent value="days" className="p-4">
              <DaySelector
                activeDays={activeDays}
                onUpdateDays={onUpdateDays}
              />
            </TabsContent>
          </Card>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onSaveAsTemplate}>
            Save as Template
          </Button>
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
