
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Book } from 'lucide-react';
import { NotesProvider } from '@/contexts/notes/NotesContext';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { NotesLayout } from '@/components/notes/NotesLayout';
import { NotesErrorFallback } from '@/components/notes/NotesErrorFallback';

const NotesPage: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={NotesErrorFallback}>
      <NotesProvider>
        <div className="container mx-auto px-4 py-6 animate-fade-in">
          <PageHeader 
            title="Notes" 
            description="Capture and organize your thoughts"
            icon={Book}
          />
          
          <div className="mt-4">
            <GlassCard className="overflow-hidden">
              <NotesLayout />
            </GlassCard>
          </div>
        </div>
      </NotesProvider>
    </ErrorBoundary>
  );
};

export default NotesPage;
