
import React from 'react';
import { NotesProvider } from '@/contexts/notes/NotesContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from 'react-error-boundary';

const NotesErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-center p-4">
      <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Notes</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error.message || 'An unexpected error occurred while loading your notes.'}
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

import { NotesLayout } from '@/components/notes/NotesLayout';

// Main Notes Page Component
const NotesPage: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={NotesErrorFallback}>
      <NotesProvider>
        <div className="w-full h-full animate-fade-in dark:bg-gray-900">
          <NotesLayout />
        </div>
      </NotesProvider>
    </ErrorBoundary>
  );
};

export default NotesPage;
