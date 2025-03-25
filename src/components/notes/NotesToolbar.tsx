
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface NotesToolbarProps {
  onCreateNote: () => void;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortDirection: 'asc' | 'desc';
  onChangeSorting: (
    sortBy: 'createdAt' | 'updatedAt' | 'title', 
    direction: 'asc' | 'desc'
  ) => void;
}

export const NotesToolbar: React.FC<NotesToolbarProps> = ({
  onCreateNote,
  sortBy,
  sortDirection,
  onChangeSorting
}) => {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;
  
  return (
    <div className="flex justify-between items-center p-4 border-b border-border/20 dark:border-border/10">
      <Button onClick={onCreateNote} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        New Note
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <span>Sort by {getSortByLabel(sortBy)}</span>
            <SortIcon className="h-3.5 w-3.5 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onChangeSorting('updatedAt', 'desc')}>
            Latest Modified
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeSorting('updatedAt', 'asc')}>
            Oldest Modified
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onChangeSorting('createdAt', 'desc')}>
            Newest Created
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeSorting('createdAt', 'asc')}>
            Oldest Created
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onChangeSorting('title', 'asc')}>
            Title (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeSorting('title', 'desc')}>
            Title (Z-A)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Helper to get human-readable label for sort option
function getSortByLabel(sortBy: 'createdAt' | 'updatedAt' | 'title'): string {
  switch (sortBy) {
    case 'createdAt':
      return 'Creation Date';
    case 'updatedAt':
      return 'Last Modified';
    case 'title':
      return 'Title';
    default:
      return 'Last Modified';
  }
}
