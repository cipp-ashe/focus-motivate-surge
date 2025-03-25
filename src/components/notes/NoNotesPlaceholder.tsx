
import React from 'react';
import { File } from 'lucide-react';

interface NoNotesPlaceholderProps {
  searchTerm?: string;
}

export const NoNotesPlaceholder: React.FC<NoNotesPlaceholderProps> = ({
  searchTerm
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
      <div className="bg-muted/30 dark:bg-muted/10 rounded-full p-4 mb-3">
        <File className="h-8 w-8 text-muted-foreground/60" />
      </div>
      
      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground">
            No notes match the search "<span className="font-medium">{searchTerm}</span>"
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-1">No notes yet</h3>
          <p className="text-sm text-muted-foreground">
            Create a new note to get started
          </p>
        </>
      )}
    </div>
  );
};
