
import React from 'react';
import { DialogContent as ShadcnDialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitDetail } from '../types';

interface DialogContentProps {
  children: React.ReactNode;
  habits: HabitDetail[];
}

const DialogContent: React.FC<DialogContentProps> = ({ children, habits }) => {
  return (
    <ShadcnDialogContent className="sm:max-w-[550px] max-h-[80vh] flex flex-col overflow-hidden p-0">
      <ScrollArea className="flex-1">
        {children}
      </ScrollArea>
    </ShadcnDialogContent>
  );
};

export default DialogContent;
