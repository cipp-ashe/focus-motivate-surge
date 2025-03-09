
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate } from './types';
import ConfigurationDialog from './ConfigurationDialog';
import TabSection from './ManageTemplatesDialog/TabSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const processingTemplateRef = useRef<string | null>(null);
  const processedToday = useRef<Set<string>>(new Set());
  
  // Reset processed templates at midnight
  useEffect(() => {
    const resetProcessedTemplates = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        processedToday.current.clear();
        setupNextReset();
      }, timeUntilMidnight);
    };
    
    const setupNextReset = () => {
      resetProcessedTemplates();
    };
    
    setupNextReset();
    
    return () => {
      // Clean up any resources if needed
    };
  }, []);
  
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
      processingTemplateRef.current = null;
    }
  }, [isOpen]);

  const handleSelectTemplate = (template: HabitTemplate) => {
    // Prevent duplicate template selection
    if (activeTemplateIds.includes(template.id)) {
      toast.info(`Template already active`);
      return;
    }
    
    // Check if this template was already processed today
    if (processedToday.current.has(template.id)) {
      console.log(`Template ${template.id} was already processed today, avoiding repeat selection`);
      return;
    }
    
    // Prevent selecting the same template twice rapidly
    if (processingTemplateRef.current === template.id) {
      console.log(`Already adding template ${template.id}, skipping duplicate action`);
      return;
    }
    
    // Set processing flag
    processingTemplateRef.current = template.id;
    
    // Mark as processed for today
    processedToday.current.add(template.id);
    
    // Add template only once
    console.log(`Adding template: ${template.id}`);
    onSelectTemplate(template.id);
    toast.success(`Added template: ${template.name}`);
    
    // Close sheet after selection
    setTimeout(() => {
      onOpenChange(false);
    }, 300);
    
    // Clear the processing flag after a delay
    setTimeout(() => {
      processingTemplateRef.current = null;
    }, 1000);
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
    toast.success('Custom template created successfully');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className={`${isMobile ? 'w-[100vw]' : 'w-[400px] sm:w-[540px]'} p-0`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 pb-0">
              <SheetHeader>
                <SheetTitle>Configure Templates</SheetTitle>
                <SheetDescription>
                  Select or create templates to add to your habit tracker
                </SheetDescription>
              </SheetHeader>
            </div>
            
            <TabSection 
              allTemplates={allTemplates}
              customTemplates={customTemplates}
              activeTemplateIds={activeTemplateIds}
              onSelectTemplate={handleSelectTemplate}
              onDeleteCustomTemplate={handleDeleteCustomTemplate}
              onCreateTemplate={handleCreateTemplate}
            />
            
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
          onClose={() => {
            setConfigDialogOpen(false);
            setConfiguringTemplate(null);
          }}
          habits={configuringTemplate.habits}
          activeDays={configuringTemplate.activeDays}
          onUpdateDays={(days) => {
            if (!configuringTemplate) return;
            setConfiguringTemplate({
              ...configuringTemplate,
              activeDays: days,
              customized: true
            });
          }}
          onSave={() => {
            if (!configuringTemplate) return;
            onSelectTemplate(configuringTemplate.templateId);
            setConfigDialogOpen(false);
            setConfiguringTemplate(null);
            onOpenChange(false);
            toast.success('Template configured successfully');
          }}
          onSaveAsTemplate={() => {
            toast.info("Save as template feature coming soon");
          }}
        />
      )}
    </>
  );
};

export default TemplateSelectionSheet;
