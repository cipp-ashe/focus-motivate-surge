
import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logManager';

// Create a QueryClient instance with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Increase stale time to reduce unnecessary refetches
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Add a sensible cache time
      gcTime: 1000 * 60 * 10, // 10 minutes
      // In development mode, log query errors
      onError: (error) => {
        logger.error('ReactQuery', 'Query error:', error);
      }
    },
    mutations: {
      // In development mode, log mutation errors
      onError: (error) => {
        logger.error('ReactQuery', 'Mutation error:', error);
      }
    }
  },
  // Configure the logger for the query client
  logger: {
    log: (message) => logger.info('ReactQuery', message),
    warn: (message) => logger.warn('ReactQuery', message),
    error: (message) => logger.error('ReactQuery', message),
  }
});

// Disable network request batching for debugging purposes in development
if (import.meta.env.DEV) {
  // @ts-ignore - Add this to help with debugging
  window.queryClient = queryClient;
}

// Helper function to invalidate all queries - use sparingly
export const invalidateAllQueries = () => {
  logger.debug('ReactQuery', 'Invalidating all queries');
  return queryClient.invalidateQueries();
};

// Helper function to clear the query cache - use sparingly
export const clearQueryCache = () => {
  logger.debug('ReactQuery', 'Clearing query cache');
  return queryClient.clear();
};
