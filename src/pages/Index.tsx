
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import { CalendarCheck, Timer, BookHeart, ScrollText, Image, Mic } from 'lucide-react';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { isInitialized, error, clearStorage, showClearButton } = useDataInitialization();
  
  useEffect(() => {
    if (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize application');
    }
  }, [error]);
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Focus Notes</h1>
          <p className="text-muted-foreground">
            Organize your tasks, notes, and habits in one place
          </p>
        </header>
        
        <DashboardCardGrid />
        
        {showClearButton && (
          <div className="mt-8">
            <button 
              onClick={clearStorage}
              className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded"
            >
              Reset Application Data
            </button>
            <p className="text-sm text-muted-foreground mt-2">
              Try resetting the application data if you're experiencing issues.
            </p>
          </div>
        )}
        
        {!isInitialized && !error && (
          <div className="mt-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4">Initializing application...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IndexPage;
