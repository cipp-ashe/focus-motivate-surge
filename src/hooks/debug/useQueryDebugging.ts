
/**
 * Hook for debugging TanStack Query operations
 */
import { useEffect } from 'react';
import { 
  QueryClient, 
  QueryCache,
  MutationCache,
  UseQueryResult
} from '@tanstack/react-query';
import { traceData, DebugModule, DEBUG_CONFIG, logger } from '@/utils/debug';

interface UseQueryDebuggingOptions {
  queryClient: QueryClient;
  enabled?: boolean;
  module?: DebugModule;
}

/**
 * Initializes query debugging for a React Query client
 */
export function useQueryDebugging({
  queryClient,
  enabled = DEBUG_CONFIG.TRACE_DATA_FLOW,
  module = 'api'
}: UseQueryDebuggingOptions) {
  useEffect(() => {
    if (!enabled) return;
    
    // Set up listeners for the QueryCache
    const queryCache = queryClient.getQueryCache();
    
    const unsubscribeQuery = queryCache.subscribe((event) => {
      // Only log if data tracing is enabled
      if (!DEBUG_CONFIG.TRACE_DATA_FLOW) return;
      
      const queryKey = Array.isArray(event.query.queryKey) 
        ? event.query.queryKey.join(':')
        : String(event.query.queryKey);
      
      if (event.type === 'added') {
        traceData(
          module,
          'ReactQuery',
          `Query added: ${queryKey}`,
          { queryKey: event.query.queryKey }
        );
      } else if (event.type === 'removed') {
        traceData(
          module,
          'ReactQuery',
          `Query removed: ${queryKey}`,
          { queryKey: event.query.queryKey }
        );
      } else if (event.type === 'updated') {
        traceData(
          module,
          'ReactQuery',
          `Query updated: ${queryKey}`,
          { 
            queryKey: event.query.queryKey,
            state: event.query.state
          }
        );
      } else if (event.type === 'observerResultsUpdated') {
        traceData(
          module,
          'ReactQuery',
          `Query results updated: ${queryKey}`,
          { 
            queryKey: event.query.queryKey,
            state: event.query.state,
            data: event.query.state.data
          }
        );
      }
    });
    
    // Set up listeners for the MutationCache
    const mutationCache = queryClient.getMutationCache();
    
    const unsubscribeMutation = mutationCache.subscribe((event) => {
      // Only log if data tracing is enabled
      if (!DEBUG_CONFIG.TRACE_DATA_FLOW) return;
      
      if (event.type === 'added') {
        traceData(
          module,
          'ReactQuery',
          `Mutation added`,
          { mutationKey: event.mutation.options.mutationKey }
        );
      } else if (event.type === 'removed') {
        traceData(
          module,
          'ReactQuery',
          `Mutation removed`,
          { mutationKey: event.mutation.options.mutationKey }
        );
      } else if (event.type === 'updated') {
        traceData(
          module,
          'ReactQuery',
          `Mutation updated`,
          { 
            mutationKey: event.mutation.options.mutationKey,
            state: event.mutation.state
          }
        );
      }
    });
    
    logger.info(module, 'React Query debugging initialized');
    
    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient, enabled, module]);
}

/**
 * Hook to debug individual query results
 */
export function useQueryResultsDebug<TData, TError>(
  queryResult: UseQueryResult<TData, TError>,
  queryName: string,
  options?: {
    module?: DebugModule;
    component?: string;
    enabled?: boolean;
    logData?: boolean;
  }
) {
  const {
    module = 'api',
    component = 'Query',
    enabled = DEBUG_CONFIG.TRACE_DATA_FLOW,
    logData = true
  } = options || {};
  
  useEffect(() => {
    if (!enabled) return;
    
    const { 
      status, 
      isLoading, 
      isError, 
      isSuccess, 
      data,
      error,
      isFetching
    } = queryResult;
    
    traceData(
      module,
      component,
      `Query "${queryName}" status: ${status}`,
      {
        status,
        isLoading,
        isError,
        isSuccess,
        error,
        isFetching,
        data: logData ? data : '[data hidden]'
      }
    );
    
    if (isError && error) {
      logger.error(
        `${module}:${component}`,
        `Query "${queryName}" error: ${error instanceof Error ? error.message : String(error)}`,
        { error }
      );
    }
  }, [
    queryResult.status,
    queryResult.data,
    queryResult.error,
    queryResult.isLoading,
    queryResult.isError,
    queryResult.isSuccess,
    queryResult.isFetching,
    queryName,
    enabled,
    module,
    component,
    logData
  ]);
}
