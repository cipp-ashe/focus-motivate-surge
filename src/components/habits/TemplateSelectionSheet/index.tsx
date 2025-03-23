
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate } from '../types';
import { toast } from 'sonner';
import TabSection from '../ManageTemplatesDialog/TabSection';

export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  allTemplates: HabitTemplate[];
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateTemplate: () => void;
  onDeleteCustomTemplate: (templateId: string) => void;
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  allTemplates,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  onDeleteCustomTemplate
}) => {
  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={(open) => {
        if (onOpenChange) {
          onOpenChange(open);
        }
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Add Habit Templates</SheetTitle>
          <SheetDescription>
            Choose from existing templates or create your own
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="preset" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="preset" className="flex-1">Preset Templates</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom Templates</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 p-4">
            <TabsContent value="preset" className="mt-0">
              <TabSection
                customTemplates={allTemplates}
                activeTemplateIds={activeTemplateIds}
                onSelectTemplate={onSelectTemplate}
                onDeleteCustomTemplate={(templateId) => {
                  toast.error("Cannot delete preset templates");
                }}
                onCreateTemplate={() => {
                  toast.info("Create a custom template instead");
                }}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="mt-0">
              <TabSection
                customTemplates={customTemplates}
                activeTemplateIds={activeTemplateIds}
                onSelectTemplate={onSelectTemplate}
                onDeleteCustomTemplate={onDeleteCustomTemplate}
                onCreateTemplate={onCreateTemplate}
              />
            </TabsContent>
          </ScrollArea>
          
          <div className="p-4 border-t mt-auto">
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;
