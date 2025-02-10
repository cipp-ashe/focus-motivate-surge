
# Testing Best Practices

## Test Organization
- Place tests in `__tests__` directories near the code they test
- Use descriptive test file names: `ComponentName.test.tsx`
- Group related tests using describe blocks
- Use clear test descriptions that explain the expected behavior

## Hook Testing
- Use HookTester for complex hook logic
- Test state updates and side effects
- Verify cleanup functions are called
- Test edge cases and error conditions

## Component Testing
- Test rendering and user interactions
- Verify accessibility features
- Test error boundaries
- Check component lifecycle behavior

## Mocking
- Mock external dependencies
- Use Jest mock functions for callbacks
- Mock browser APIs when needed
- Create test data factories for complex objects

## Assertions
- Use specific assertions over generic ones
- Test both positive and negative cases
- Verify error states and messages
- Check boundary conditions
