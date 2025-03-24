
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from './TemplateCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRecommendedTemplates } from '@/data/recommendedTemplates';
import { HabitTemplate } from '@/types/habit';

interface TemplateSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: string) => void;
}

export const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  open,
  onOpenChange,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState('recommended');
  
  // In a real implementation, these would come from context or API
  const recommendedTemplates: HabitTemplate[] = getRecommendedTemplates ? getRecommendedTemplates() : [];
  const customTemplates: HabitTemplate[] = [];
  
  const handleAddTemplate = (templateId: string) => {
    onSelect(templateId);
    onOpenChange(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Add Habit Template</SheetTitle>
          <SheetDescription>
            Choose a template to get started with your habits
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab} className="p-6 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="grid gap-3">
                {recommendedTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onAdd={() => handleAddTemplate(template.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="grid gap-3">
                {customTemplates.length > 0 ? (
                  customTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onAdd={() => handleAddTemplate(template.id)}
                    />
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No custom templates yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
