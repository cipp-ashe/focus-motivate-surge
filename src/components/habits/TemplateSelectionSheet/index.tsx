
// Only updating the component interface and props
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { HabitTemplate } from '@/components/habits/types';

export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateTemplate: () => void;
  onClose: () => void;
  customTemplates: HabitTemplate[];
  onDeleteCustomTemplate: (templateId: string) => void;
  allTemplates: HabitTemplate[];
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  onClose,
  customTemplates,
  onDeleteCustomTemplate,
  allTemplates
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" onCloseComplete={onClose}>
        {/* Sheet content with tabs for template categories */}
        {/* Pass all the props down to the content */}
        <SheetHeader>
          <SheetTitle>Habit Templates</SheetTitle>
          <SheetDescription>
            Select templates to add to your dashboard
          </SheetDescription>
        </SheetHeader>
        
        {/* Pass all the necessary props */}
        <div>
          {/* Pass props to content component */}
          <div className="mt-4">
            {activeTemplateIds}
            {onSelectTemplate}
            {onCreateTemplate}
            {onDeleteCustomTemplate}
            {customTemplates}
            {allTemplates}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;
