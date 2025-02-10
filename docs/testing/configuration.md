# Test Configuration

## Jest Configuration

```typescript
// jest.config.ts highlights
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## Test Environment Setup

The project includes comprehensive test environment setup in `setupTests.ts`:

1. **Testing Library Extensions**
   - Adds Jest DOM matchers
   - Custom matcher types for TypeScript

2. **Browser API Mocks**
   ```typescript
   // Mock window.matchMedia
   window.matchMedia = (query) => ({
     matches: false,
     media: query,
     // ... other MediaQueryList properties
   });

   // Mock Audio API
   class MockAudio {
     play(): Promise<void> {
       return Promise.resolve();
     }
   }

   // Mock IntersectionObserver
   class MockIntersectionObserver {
     observe(): void {}
     unobserve(): void {}
     disconnect(): void {}
   }
   ```

3. **Global Test Setup**
   - Clears all mocks before each test
   - Sets up global browser API mocks
   - Provides TypeScript type extensions
