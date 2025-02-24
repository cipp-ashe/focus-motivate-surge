
import React from 'react';
import {
  DialogHeader as RadixDialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

const DialogHeader: React.FC = () => {
  return (
    <RadixDialogHeader>
      <DialogTitle>Configure Habits</DialogTitle>
      <DialogDescription>
        Set up your habits and tracking preferences. Drag to reorder habits.
      </DialogDescription>
    </RadixDialogHeader>
  );
};

export default DialogHeader;
