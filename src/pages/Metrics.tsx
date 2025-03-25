
import React, { useState, useEffect } from 'react';
import { MetricsDashboard } from '@/components/timer/metrics/MetricsDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TimerStateMetrics } from '@/types/metrics';
import { ErrorBoundary } from 'react-error-boundary';

const TIMER_METRICS_STORAGE_KEY = 'timer-metrics';

const MetricsErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 text-center">
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">Error Loading Metrics</h2>
      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
        {error.message || 'There was a problem loading your metrics data.'}
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

const MetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<TimerStateMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = () => {
      setIsLoading(true);
      try {
        const storedMetrics = localStorage.getItem(TIMER_METRICS_STORAGE_KEY);
        if (storedMetrics) {
          const parsedMetrics = JSON.parse(storedMetrics);
          setMetrics(Array.isArray(parsedMetrics) ? parsedMetrics : []);
        } else {
          setMetrics([]);
        }
      } catch (error) {
        console.error('Failed to load metrics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
    
    // Listen for metrics updates
    const handleMetricsUpdate = () => loadMetrics();
    window.addEventListener('metrics-updated', handleMetricsUpdate);
    
    return () => {
      window.removeEventListener('metrics-updated', handleMetricsUpdate);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in dark:bg-background/5">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">Timer Metrics</h1>
        <p className="mt-1 text-muted-foreground dark:text-gray-400">
          Track your productivity and see how you're progressing over time
        </p>
      </header>

      <main>
        <ErrorBoundary FallbackComponent={MetricsErrorFallback}>
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <MetricsDashboard metrics={metrics} />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default MetricsPage;
