
import React from 'react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { PageHeader } from '@/components/ui/page-header';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';

const JournalErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
      <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Journal</h2>
      <p className="text-muted-foreground mb-4">
        {error.message || 'An unexpected error occurred while loading your journal.'}
      </p>
      <Button
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
    </div>
  );
};

const Journal: React.FC = () => {
  // Log component rendering for debugging
  console.log('Journal page rendering');

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <PageHeader
        title="Journal"
        description="Record your thoughts, ideas, and reflections"
        icon={Pencil}
      />
      
      <ErrorBoundary FallbackComponent={JournalErrorFallback}>
        <GlassCard className="shadow-sm">
          <GlassCardContent>
            <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Daily Journal</h2>
            <p className="text-muted-foreground mb-4">
              Record your thoughts, ideas, and reflections here.
            </p>
            
            <textarea 
              className="w-full h-64 p-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Start writing your journal entry..."
            />
            
            <div className="mt-4 flex justify-end">
              <Button>
                Save Entry
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </ErrorBoundary>
    </div>
  );
};

export default Journal;
