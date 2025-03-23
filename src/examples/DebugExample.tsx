
import React, { useState, useEffect, useCallback } from 'react';
import { useDataFlow } from '@/hooks/debug/useDataFlow';
import { usePerformance } from '@/hooks/debug/usePerformance';
import { useStateTracking } from '@/hooks/debug/useStateTracking';
import { useValidation } from '@/hooks/debug/useValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { withErrorBoundary } from '@/utils/debug';

interface ExampleData {
  id: string;
  name: string;
  count: number;
}

/**
 * Example component demonstrating debug instrumentation
 */
const DebugExample: React.FC = () => {
  // Set up example state
  const [data, setData] = useState<ExampleData>({
    id: '1',
    name: 'Example',
    count: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize data flow tracing
  const dataFlow = useDataFlow({ data, loading, error }, {
    module: 'examples',
    component: 'DebugExample',
    traceProps: true
  });
  
  // Initialize performance measuring
  const { measureFunction, measureEffect } = usePerformance({
    module: 'examples',
    component: 'DebugExample',
    trackRenders: true,
    trackEffects: true
  });
  
  // Track state changes
  useStateTracking('data', data, {
    module: 'examples',
    component: 'DebugExample',
    logChangesOnly: true
  });
  
  useStateTracking('loading', loading, {
    module: 'examples',
    component: 'DebugExample'
  });
  
  // Set up validation
  const { validate, assert, checkNullOrUndefined } = useValidation({
    module: 'examples',
    component: 'DebugExample',
    strictMode: true
  });
  
  // Validate the data structure
  useEffect(() => {
    validate(data, ['id', 'name', 'count'], 'Validating data structure');
    
    assert(
      typeof data.id === 'string' && data.id.length > 0,
      'Data ID must be a non-empty string'
    );
    
    assert(
      typeof data.count === 'number',
      'Count must be a number'
    );
  }, [data, validate, assert]);
  
  // Simulate an API call
  const fetchData = useCallback(async () => {
    dataFlow.traceEvent('fetchDataStarted');
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 20% chance of error
      if (Math.random() < 0.2) {
        throw new Error('Random fetch error');
      }
      
      // Update with new data
      setData(prev => ({
        ...prev,
        count: prev.count + 1
      }));
      
      dataFlow.traceEvent('fetchDataSucceeded', { 
        newCount: data.count + 1 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      dataFlow.traceEvent('fetchDataFailed', { 
        error: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  }, [data.count, dataFlow]);
  
  // Measure performance of fetchData
  const handleFetchClick = measureFunction(
    'handleFetchClick',
    () => fetchData()
  );
  
  // Measure performance of event processing
  const handleInputChange = measureFunction(
    'handleInputChange',
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      
      dataFlow.traceEvent('nameInputChanged', {
        previousName: data.name,
        newName
      });
      
      setData(prev => ({
        ...prev,
        name: newName
      }));
    }
  );
  
  // This would trigger an assertion error if uncommented
  const triggerError = () => {
    assert(false, 'Manually triggered assertion error');
    // Or we could throw an error
    // throw new Error('Manually triggered error');
  };
  
  // Measure effect execution
  useEffect(
    measureEffect('dataChangeEffect', () => {
      dataFlow.traceEvent('dataChanged', { data });
      
      // Example cleanup
      return () => {
        dataFlow.traceEvent('dataChangeEffectCleanup');
      };
    }),
    [data]
  );
  
  return (
    <Card className="border border-border/30 dark:border-border/20 shadow-sm">
      <CardHeader>
        <CardTitle>Debug Example</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Name:</p>
          <Input
            value={data.name}
            onChange={handleInputChange}
            className="max-w-xs"
          />
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Count: {data.count}</p>
          {loading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button onClick={handleFetchClick} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </Button>
        <Button 
          variant="outline" 
          onClick={triggerError}
        >
          Trigger Error
        </Button>
      </CardFooter>
    </Card>
  );
};

// Wrap with error boundary
export default withErrorBoundary(DebugExample, {
  module: 'examples',
  component: 'DebugExample',
  fallback: (
    <Card className="border border-destructive/40 shadow-sm">
      <CardHeader>
        <CardTitle className="text-destructive">Error in Debug Example</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Something went wrong with this component.</p>
        <p className="text-muted-foreground text-sm mt-2">
          Check the console for more details.
        </p>
      </CardContent>
    </Card>
  )
});
