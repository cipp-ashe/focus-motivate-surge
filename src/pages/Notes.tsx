
import React from 'react';
import { NotesProvider } from '@/contexts/notes/NotesContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from 'react-error-boundary';
import { PageHeader } from '@/components/ui/page-header';
import { Notebook } from 'lucide-react';

const NotesErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
      <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Notes</h2>
      <p className="text-muted-foreground mb-4">
        {error.message || 'An unexpected error occurred while loading your notes.'}
      </p>
      <Button
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
    </div>
  );
};

import { NotesLayout } from '@/components/notes/NotesLayout';
import { Button } from '@/components/ui/button';

// Main Notes Page Component
const NotesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <PageHeader
        title="Notes"
        description="Organize your thoughts and ideas"
        icon={Notebook}
      />
      
      <ErrorBoundary FallbackComponent={NotesErrorFallback}>
        <NotesProvider>
          <div className="w-full h-full">
            <NotesLayout />
          </div>
        </NotesProvider>
      </ErrorBoundary>
    </div>
  );
};

export default NotesPage;
