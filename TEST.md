# Testing Documentation

## Setup Instructions

To run the tests, you'll need to install the following dependencies:

```bash
# Using npm
npm install --save-dev @testing-library/react @testing-library/jest-dom @types/jest jest ts-jest jest-environment-jsdom identity-obj-proxy @jest/types

# Using Bun
bun add -d @testing-library/react @testing-library/jest-dom @types/jest jest ts-jest jest-environment-jsdom identity-obj-proxy @jest/types
```

## Test Structure

The tests are organized as follows:

```
src/
  components/
    __tests__/           # Component tests
      TimerCircle.test.tsx
      Timer.test.tsx
      ...
  hooks/
    __tests__/          # Hook tests
      useTimer.test.ts
      useAudio.test.ts
      ...
```

## Running Tests

Once dependencies are installed, you can run tests using:

```bash
# Using npm
npm test

# Using Bun
bun test
```

## Test Coverage

To generate coverage reports:

```bash
# Using npm
npm test -- --coverage

# Using Bun
bun test --coverage
```

## Current Test Status

The test files currently include:
1. Basic utility functions for testing
2. Documented test cases to be implemented
3. Example implementations for reference

When dependencies are installed, the placeholder tests will be replaced with proper test implementations using Jest and React Testing Library.

## Writing Tests

### Component Tests

Example of a component test:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimerCircle } from '../TimerCircle';

describe('TimerCircle', () => {
  test('renders correctly', () => {
    render(<TimerCircle {...props} />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });
});
```

### Hook Tests

Example of a hook test:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  test('initializes with correct duration', () => {
    const { result } = renderHook(() => useTimer({ duration: 300 }));
    expect(result.current.timeLeft).toBe(300);
  });
});
```

## Test Coverage Requirements

- Minimum coverage requirements:
  - Statements: 80%
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%

## Accessibility Testing

All component tests should include accessibility checks:

```typescript
import { axe } from 'jest-axe';

test('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Mocking

Common mocks are provided in `src/setupTests.ts`:
- Window.matchMedia
- requestAnimationFrame
- Audio API
- IntersectionObserver

## Future Improvements

1. Add E2E tests using Playwright or Cypress
2. Add Visual Regression tests
3. Add Performance testing
4. Add State management tests