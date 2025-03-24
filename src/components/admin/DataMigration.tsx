
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runDataMigration } from '@/utils/migrations/typeMigration';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const DataMigration: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  
  const handleMigrate = async () => {
    setIsRunning(true);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Run the migration
      const result = runDataMigration();
      
      setSuccess(result);
      
      if (result) {
        toast.success('Data migration completed successfully');
      } else {
        toast.error('Data migration failed');
      }
      
    } catch (error) {
      console.error('Error running migration:', error);
      setSuccess(false);
      toast.error('Error running data migration');
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Data Migration Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This tool migrates your existing data to the new unified type system. 
            This includes converting legacy habit metrics, task types, voice notes, and more.
          </p>
          
          {success === true && (
            <div className="bg-green-100 dark:bg-green-800/20 text-green-800 dark:text-green-200 p-3 rounded-md flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Migration completed successfully!</span>
            </div>
          )}
          
          {success === false && (
            <div className="bg-red-100 dark:bg-red-800/20 text-red-800 dark:text-red-200 p-3 rounded-md flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Migration failed. Please check the console for details.</span>
            </div>
          )}
          
          <Button 
            onClick={handleMigrate} 
            disabled={isRunning} 
            className="w-full"
          >
            {isRunning ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isRunning ? 'Migrating Data...' : 'Run Data Migration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMigration;
