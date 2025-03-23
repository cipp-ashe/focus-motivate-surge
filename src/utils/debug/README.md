
# Application Debugging Tools

This is a comprehensive debugging toolkit for runtime monitoring, data flow tracing, performance tracking, and error reporting.

## Features

- **Data Flow Tracing**: Track data as it flows through your application
- **Performance Monitoring**: Measure performance of components and functions
- **State Tracking**: Monitor state changes within components
- **Validation & Assertions**: Add runtime checks for critical assumptions
- **Error Reporting**: Detailed error reporting and handling
- **Debug Panel**: Visualize and filter debug information
- **TanStack Query Integration**: Monitor React Query behavior

## Quick Start

### Basic Component Debugging

```tsx
import { useDataFlow } from '@/hooks/debug/useDataFlow';
import { usePerformance } from '@/hooks/debug/usePerformance';
import { useStateTracking } from '@/hooks/debug/useStateTracking';
import { useValidation } from '@/hooks/debug/useValidation';

function MyComponent(props) {
  // Initialize data tracing
  const dataFlow = useDataFlow(props, {
    module: 'ui',
    component: 'MyComponent',
    traceProps: true
  });
  
  // Measure performance
  const { measureFunction } = usePerformance({
    module: 'ui',
    component: 'MyComponent',
    trackRenders: true
  });
  
  // Track state changes
  const [count, setCount] = useState(0);
  useStateTracking('count', count, {
    module: 'ui',
    component: 'MyComponent'
  });
  
  // Validate data
  const { validate, assert } = useValidation({
    module: 'ui',
    component: 'MyComponent'
  });
  
  // Trace events
  const handleClick = () => {
    dataFlow.traceEvent('buttonClicked', { count });
    setCount(count + 1);
  };
  
  // Wrap functions to measure performance
  const expensiveCalculation = measureFunction(
    'expensiveCalculation',
    () => {
      // Some expensive calculation
      return count * 2;
    }
  );
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p>Calculated: {expensiveCalculation()}</p>
    </div>
  );
}
```

### Add Debugging to Your App

In your main App component:

```tsx
import { applyDebugging } from '@/utils/debug/applyDebugging';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      {/* Your app content */}
    </div>
  );
}

// Export with debugging applied
export default applyDebugging(App, queryClient);
```

### Using Debug Error Boundaries

```tsx
import { withErrorBoundary } from '@/utils/debug';

function MyComponent() {
  // Component code
}

export default withErrorBoundary(MyComponent, {
  module: 'ui',
  component: 'MyComponent',
  fallback: <p>Something went wrong with this component</p>
});
```

## Best Practices

1. **Be Selective**: Don't trace everything - focus on critical paths
2. **Categorize Well**: Use consistent module and component names
3. **Validate Critical Data**: Add validation where data integrity is vital
4. **Handle Errors Properly**: Never silently catch errors
5. **Toggle in Production**: Allow selective enabling in production for troubleshooting
6. **Clear Debug Data**: Use regular cleanup to prevent memory bloat

## Configuration

Debug features can be toggled in localStorage:

- `debug_mode`: Master toggle for all debugging features
- `debug_trace_data`: Toggle data flow tracing
- `debug_performance`: Toggle performance measurements
- `debug_state`: Toggle state change tracking
- `debug_assertions`: Toggle runtime assertions
- `debug_log_level`: Numeric log level (0-3)

## Contributing

When adding new features to the application, be sure to include appropriate debugging instrumentation.
