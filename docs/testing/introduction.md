
# Testing Guide Introduction

## Test Structure

The project uses a comprehensive testing setup with both Jest and custom test utilities for different testing scenarios.

### Test Utilities

1. **HookTester (`src/testUtils/hookTester.ts`)**
   - Custom utility for testing React hooks
   - Provides mock React environment with state management
   - Supports useState, useEffect, and useCallback
   - Includes methods for:
     - State management
     - Effect handling
     - Time advancement simulation
     - State inspection

2. **TestRunner (`src/testUtils/testRunner.ts`)**
   - Custom test runner with Jest-like syntax
   - Supports describe, test, beforeEach, and afterEach blocks
   - Includes comprehensive assertion utilities:
     - toBe: Strict equality comparison
     - toEqual: Deep equality comparison
     - toContain: Array/string inclusion check
     - toBeTruthy/toBeFalsy: Truthiness checks
     - toThrow: Exception testing
     - Numeric comparisons (greater/less than)
