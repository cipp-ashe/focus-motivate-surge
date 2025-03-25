import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Import from the PascalCase file name
import { useNotesContext } from '@/contexts/notes/NotesContext';
import {
  Search,
  X,
  ListFilter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  CheckSquare,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NoteType } from '@/types/notes';
import { cn } from '@/lib/utils';

export const NotesHeader: React.FC = () => {
  const { state, setSearchTerm, setSorting, setFilter, setView, setShowArchived } =
    useNotesContext();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchTerm('');
  };

  const toggleSortDirection = () => {
    setSorting(state.sortBy, state.sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterByType = (type: NoteType | null) => {
    setFilter(type);
  };

  const toggleView = () => {
    setView(state.view === 'grid' ? 'list' : 'grid');
  };

  const toggleShowArchived = () => {
    setShowArchived(!state.showArchived);
  };

  return (
    <div className="border-b border-border p-3 space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-8 pr-8"
        />
        {searchValue && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <ListFilter className="h-4 w-4 mr-1" />
              {state.filter ? 'Filtered' : 'Filter'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilterByType(null)}>All Notes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterByType('standard')}>
              Standard Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByType('journal')}>
              Journal Entries
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByType('task')}>
              Task Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByType('habit')}>
              Habit Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByType('markdown')}>
              Markdown Notes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              {state.sortDirection === 'asc' ? (
                <SortAsc className="h-4 w-4 mr-1" />
              ) : (
                <SortDesc className="h-4 w-4 mr-1" />
              )}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSorting('updatedAt', state.sortDirection)}>
              Last Updated
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSorting('createdAt', state.sortDirection)}>
              Date Created
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSorting('title', state.sortDirection)}>
              Title
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleSortDirection}>
              {state.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={toggleView}>
          {state.view === 'grid' ? (
            <>
              <List className="h-4 w-4 mr-1" />
              List View
            </>
          ) : (
            <>
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid View
            </>
          )}
        </Button>

        <Button
          variant={state.showArchived ? 'default' : 'outline'}
          size="sm"
          className={cn('flex-1', state.showArchived && 'bg-amber-500 hover:bg-amber-600')}
          onClick={toggleShowArchived}
        >
          {state.showArchived ? (
            <>
              <ArchiveRestore className="h-4 w-4 mr-1" />
              Hide Archived
            </>
          ) : (
            <>
              <Archive className="h-4 w-4 mr-1" />
              Show Archived
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
