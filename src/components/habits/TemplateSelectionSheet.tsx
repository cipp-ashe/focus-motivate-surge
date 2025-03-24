
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRecommendedTemplates } from './data/recommendedTemplates';
import { HabitTemplate, NewTemplate } from '@/types/habits/types';
import { DayOfWeek } from '@/types/habits/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import { toast } from 'sonner';

interface TemplateSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: HabitTemplate) => void;
  existingTemplateIds?: string[];
}

export const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
  existingTemplateIds = []
}) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);
  const [recommendedTemplates, setRecommendedTemplates] = useState<HabitTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load templates when the sheet opens
  useEffect(() => {
    if (open) {
      // Load recommended templates
      setRecommendedTemplates(getRecommendedTemplates());
      
      // Load custom templates from localStorage
      try {
        const savedTemplates = localStorage.getItem('custom-templates');
        if (savedTemplates) {
          setCustomTemplates(JSON.parse(savedTemplates));
        }
      } catch (error) {
        console.error('Error loading custom templates:', error);
      }
    }
  }, [open]);
  
  // Filter templates based on search term
  const filteredRecommended = recommendedTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCustom = customTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.category && template.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle template selection
  const handleSelectTemplate = (template: HabitTemplate) => {
    // Check if template is already added
    if (existingTemplateIds.includes(template.id)) {
      toast.error('This template is already added');
      return;
    }
    
    // Add the template
    onSelectTemplate(template);
    onOpenChange(false);
    
    // If it's a custom template, we'll add it to active templates with custom properties
    if (customTemplates.some(t => t.id === template.id)) {
      // This is handled by the parent component
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Select a Habit Template</SheetTitle>
          <SheetDescription>
            Choose from recommended templates or your custom templates
          </SheetDescription>
        </SheetHeader>
        
        <div className="my-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="custom">My Templates ({customTemplates.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="h-[calc(100vh-220px)]">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredRecommended.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isActive={existingTemplateIds.includes(template.id)}
                    onSelect={() => handleSelectTemplate(template)}
                    isSelectionMode
                  />
                ))}
                
                {filteredRecommended.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recommended templates match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="custom" className="h-[calc(100vh-220px)]">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredCustom.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isActive={existingTemplateIds.includes(template.id)}
                    onSelect={() => handleSelectTemplate(template)}
                    isSelectionMode
                  />
                ))}
                
                {filteredCustom.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 
                      "No custom templates match your search" : 
                      "You haven't created any custom templates yet"}
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
