import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ActiveTemplate, HabitDetail } from '@/types/habits/types';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitContext } from '@/contexts/habits/HabitContext';

interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
  showTemplateSearch?: boolean;
}

export const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({ 
  activeTemplates, 
  showTemplateSearch = true
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: ''
  });
  
  const { addTemplate, updateTemplate, removeTemplate } = useHabitContext();
  
  // Handle template creation
  const handleCreateTemplate = useCallback(() => {
    if (!newTemplate.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    
    const templateId = uuidv4();
    const template: ActiveTemplate = {
      templateId,
      name: newTemplate.name.trim(),
      description: newTemplate.description.trim(),
      habits: [],
      customized: true,
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    };
    
    // Call the addTemplate function
    addTemplate(template);
    
    // Emit event for custom template creation
    eventManager.emit('habit:custom-template-create', {
      name: newTemplate.name,
      description: newTemplate.description
    });
    
    // Reset form and close dialog
    setNewTemplate({ name: '', description: '' });
    setShowCreateDialog(false);
    
    toast.success('Custom template created');
  }, [addTemplate, newTemplate]);
  
  // Handle template deletion
  const handleDeleteTemplate = useCallback((templateId: string) => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      // Call the delete template function
      removeTemplate(templateId);
      
      // Emit event for custom template deletion
      eventManager.emit('habit:custom-template-delete', { templateId });
      
      setSelectedTemplate(null);
      setShowSettingsDialog(false);
      
      toast.success('Template deleted');
    }
  }, [removeTemplate]);
  
  // Open template settings
  const openTemplateSettings = useCallback((template: ActiveTemplate) => {
    setSelectedTemplate(template);
    setShowSettingsDialog(true);
  }, []);
  
  // Save template settings
  const saveTemplateSettings = useCallback(() => {
    if (!selectedTemplate) return;
    
    // Update template details
    updateTemplate(
      selectedTemplate.templateId,
      selectedTemplate
    );
    
    setShowSettingsDialog(false);
    toast.success('Template settings updated');
  }, [selectedTemplate, updateTemplate]);
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Habit Templates</h2>
          <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
        
        {activeTemplates.length === 0 ? (
          <Card className="border border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No custom templates yet. Create your first template to get started.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowCreateDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTemplates.map((template) => (
              <Card key={template.templateId} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 py-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || 'No description'}
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      {template.habits.length} habits • {template.activeDays.join(', ')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex space-x-2 w-full justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openTemplateSettings(template)}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.templateId)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="Daily Fitness"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                placeholder="A collection of daily fitness habits"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Template Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Template Settings</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={selectedTemplate.name}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedTemplate.description || ''}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTemplate(selectedTemplate.templateId)}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Template
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplateSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
