
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { ActiveTemplate, HabitTemplate, NewTemplate } from './types';
import ConfigComponent from './TemplateSelectionSheet/ConfigComponent';

export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
  onClose: () => void;
  allTemplates?: HabitTemplate[];
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
  onClose,
  allTemplates = []
}) => {
  const [configuringTemplate, setConfiguringTemplate] = useState<ActiveTemplate | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const handleCloseConfig = () => {
    setConfiguringTemplate(null);
    setConfigDialogOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onClose();
        }
      }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Habit Templates</SheetTitle>
            <SheetDescription>
              Choose a template to add to your habits
            </SheetDescription>
          </SheetHeader>
          
          <div className="h-full flex flex-col mt-6">
            <Tabs defaultValue="predefined" className="flex-1 flex flex-col">
              <div className="px-4 py-2 border-b">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="predefined">Predefined</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="predefined" className="flex-1 p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 grid gap-3">
                    {allTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          activeTemplateIds.includes(template.id)
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => onSelectTemplate(template)}
                      >
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="custom" className="flex-1 p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 grid gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 justify-start"
                      onClick={() => onCreateTemplate({ 
                        name: 'New Template', 
                        description: 'Custom template', 
                        defaultHabits: [] 
                      })}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Custom Template</span>
                    </Button>

                    {customTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors relative group ${
                          activeTemplateIds.includes(template.id)
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => onSelectTemplate(template)}
                      >
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomTemplate(template.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Config dialog for template configuration */}
      <ConfigComponent
        configuringTemplate={configuringTemplate}
        configDialogOpen={configDialogOpen}
        onClose={handleCloseConfig}
        onSelectTemplate={(templateId) => {
          // Find and select the template
          const template = [...allTemplates, ...customTemplates].find(t => t.id === templateId);
          if (template) {
            onSelectTemplate(template);
          }
        }}
        onOpenChange={setConfigDialogOpen}
      />
    </>
  );
};

export default TemplateSelectionSheet;
