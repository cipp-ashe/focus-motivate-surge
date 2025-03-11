
import React, { useState, useEffect, useRef } from 'react';
import { SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate } from '../types';
import TabSection from '../ManageTemplatesDialog/TabSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { eventBus } from '@/lib/eventBus';

interface SheetContentProps {
  allTemplates: HabitTemplate[];
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
  onOpenChange: (open: boolean) => void;
  setConfiguringTemplate: (template: ActiveTemplate | null) => void;
  setConfigDialogOpen: (open: boolean) => void;
}

const SheetContent: React.FC<SheetContentProps> = ({
  allTemplates,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  onOpenChange,
  setConfiguringTemplate,
  setConfigDialogOpen,
}) => {
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
    
    // Call the callback but do NOT emit any events directly from here
    // The callback (onSelectTemplate) will handle event emission to avoid duplicates
    console.log(`Selecting template: ${template.id}`);
    onSelectTemplate(template.id);
    
    // Close sheet after selection
    setTimeout(() => {
      onOpenChange(false);
      
      // Clear the processing flag after a delay
      setTimeout(() => {
        processingTemplateRef.current = null;
      }, 500);
    }, 300);
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('custom-templates', JSON.stringify(updated));
    toast.success('Custom template deleted');
    
    // Emit event for custom template deletion
    eventBus.emit('habit:custom-template-delete', { templateId });
  };

  return (
    <div className={`${isMobile ? 'w-[100vw]' : 'w-[400px] sm:w-[540px]'} p-0`}>
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
          onCreateTemplate={onCreateTemplate}
        />
        
        <div className="p-4 border-t">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </SheetClose>
        </div>
      </div>
    </div>
  );
};

export default SheetContent;
