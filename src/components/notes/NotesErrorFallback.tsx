
import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotesErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-destructive/20 p-3 rounded-full">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        
        <p className="text-muted-foreground max-w-md mx-auto mb-2">
          There was an error loading the notes component. Please try refreshing the page.
        </p>
        
        <div className="bg-muted/50 p-2 rounded-md text-sm text-left overflow-auto max-w-full">
          <pre className="text-destructive/80">{error.message}</pre>
        </div>
        
        <Button onClick={resetErrorBoundary} className="mt-2">
          Try Again
        </Button>
      </div>
    </div>
  );
};
