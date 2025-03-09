
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { ActiveTemplate, DayOfWeek, HabitTemplate } from './types';
import ConfigurationDialog from './ConfigurationDialog';
import AvailableTemplates from './ManageTemplatesDialog/AvailableTemplates';
import CustomTemplates from './ManageTemplatesDialog/CustomTemplates';
import CreateTemplateForm from './ManageTemplatesDialog/CreateTemplateForm';

interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  allTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
}) => {
  const [configuringTemplate, setConfiguringTemplate] = useState<ActiveTemplate | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("built-in");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Load custom templates from local storage
  useEffect(() => {
    const loadCustomTemplates = () => {
      try {
        const saved = localStorage.getItem('custom-templates');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error loading custom templates:', error);
        return [];
      }
    };

    setCustomTemplates(loadCustomTemplates());
  }, [isOpen]); // Reload when sheet opens
  
  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setConfigDialogOpen(false);
      setConfiguringTemplate(null);
      setIsCreatingNew(false);
    }
  }, [isOpen]);

  const handleSelectTemplate = (template: HabitTemplate) => {
    console.log("Selected template for configuration:", template.name);
    const newTemplate: ActiveTemplate = {
      templateId: template.id,
      habits: template.defaultHabits,
      activeDays: template.defaultDays || [],
      customized: false
    };
    setConfiguringTemplate(newTemplate);
    setConfigDialogOpen(true);
  };

  const handleUpdateDays = (days: DayOfWeek[]) => {
    if (!configuringTemplate) return;
    const updatedTemplate = {
      ...configuringTemplate,
      activeDays: days,
      customized: true
    };
    setConfiguringTemplate(updatedTemplate);
  };

  const handleSaveConfiguration = () => {
    if (!configuringTemplate) return;
    eventBus.emit('habit:template-update', configuringTemplate);
    onSelectTemplate(configuringTemplate.templateId);
    handleCloseConfigDialog();
    onOpenChange(false);
    toast.success('Template configured successfully');
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
    setConfiguringTemplate(null);
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updated);
    localStorage.setItem('custom-templates', JSON.stringify(updated));
    toast.success('Custom template deleted');
  };

  const handleCreateTemplate = (newTemplate: Omit<HabitTemplate, 'id'>) => {
    const template: HabitTemplate = {
      ...newTemplate,
      id: `custom-${Date.now()}`,
    };
    
    const updated = [...customTemplates, template];
    setCustomTemplates(updated);
    localStorage.setItem('custom-templates', JSON.stringify(updated));
    setIsCreatingNew(false);
    setActiveTab("custom");
    toast.success('Custom template created successfully');
  };

  console.log("TemplateSelectionSheet - Sheet isOpen:", isOpen);
  console.log("TemplateSelectionSheet - configDialogOpen:", configDialogOpen);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 pb-0">
              <SheetHeader>
                <SheetTitle>Configure Templates</SheetTitle>
                <SheetDescription>
                  Select or create templates to add to your habit tracker
                </SheetDescription>
              </SheetHeader>
            </div>
            
            {isCreatingNew ? (
              <div className="flex-1 p-6 overflow-auto">
                <div className="mb-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCreatingNew(false)}
                    className="mb-2"
                  >
                    ← Back to Templates
                  </Button>
                  <h3 className="text-lg font-medium">Create New Template</h3>
                </div>
                <CreateTemplateForm 
                  onSubmit={handleCreateTemplate} 
                  onCancel={() => setIsCreatingNew(false)} 
                />
              </div>
            ) : (
              <div className="flex-1 p-6 overflow-auto">
                <Tabs defaultValue="built-in" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="built-in">Built-in Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom Templates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="built-in" className="mt-0">
                    <AvailableTemplates 
                      templates={allTemplates}
                      activeTemplateIds={activeTemplateIds}
                      onSelect={handleSelectTemplate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="custom" className="mt-0">
                    <div className="mb-4">
                      <Button 
                        onClick={() => setIsCreatingNew(true)}
                        className="w-full"
                      >
                        Create New Template
                      </Button>
                    </div>
                    <CustomTemplates 
                      templates={customTemplates}
                      activeTemplateIds={activeTemplateIds}
                      onSelect={handleSelectTemplate}
                      onDelete={handleDeleteCustomTemplate}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <div className="p-4 border-t">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Close</Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {configuringTemplate && (
        <ConfigurationDialog
          open={configDialogOpen}
          onClose={handleCloseConfigDialog}
          habits={configuringTemplate.habits}
          activeDays={configuringTemplate.activeDays}
          onUpdateDays={handleUpdateDays}
          onSave={handleSaveConfiguration}
          onSaveAsTemplate={() => {
            toast.info("Save as template feature coming soon");
          }}
        />
      )}
    </>
  );
};

export default TemplateSelectionSheet;
