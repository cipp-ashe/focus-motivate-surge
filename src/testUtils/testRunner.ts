import { TestSuite, TestResult } from './types';

type AssertionValue<T> = {
  toBe: (expected: T) => void;
  toEqual: (expected: T) => void;
  toContain: T extends (Array<infer U> | string) 
    ? (expected: T extends Array<U> ? U : string) => void
    : never;
  toBeTruthy: () => void;
  toBeFalsy: () => void;
  toThrow: T extends () => unknown ? () => void : never;
  toBeGreaterThan: T extends number ? (expected: number) => void : never;
  toBeLessThan: T extends number ? (expected: number) => void : never;
  toBeGreaterThanOrEqual: T extends number ? (expected: number) => void : never;
  toBeLessThanOrEqual: T extends number ? (expected: number) => void : never;
};

class TestRunner {
  private suites: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  describe(name: string, fn: () => void): void {
    this.currentSuite = { name, tests: [] };
    fn();
    this.suites.push(this.currentSuite);
    this.currentSuite = null;
  }

  test(name: string, fn: () => void | Promise<void>): void {
    if (!this.currentSuite) {
      throw new Error('Test must be defined within a describe block');
    }
    this.currentSuite.tests.push({ name, fn });
  }

  beforeEach(fn: () => void): void {
    if (!this.currentSuite) {
      throw new Error('beforeEach must be defined within a describe block');
    }
    this.currentSuite.beforeEach = fn;
  }

  afterEach(fn: () => void): void {
    if (!this.currentSuite) {
      throw new Error('afterEach must be defined within a describe block');
    }
    this.currentSuite.afterEach = fn;
  }

  async run(): Promise<TestResult> {
    console.log('\n🔬 Starting tests...\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const suite of this.suites) {
      console.log(`\n📑 Suite: ${suite.name}`);
      
      for (const test of suite.tests) {
        totalTests++;
        try {
          if (suite.beforeEach) {
            suite.beforeEach();
          }

          await test.fn();

          if (suite.afterEach) {
            suite.afterEach();
          }

          console.log(`  ✅ ${test.name}`);
          passedTests++;
        } catch (error) {
          console.log(`  ❌ ${test.name}`);
          console.log(`     Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedTests++;
        }
      }
    }

    console.log('\n📊 Test Results:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} ${passedTests === totalTests ? '🎉' : ''}`);
    console.log(`   Failed: ${failedTests} ${failedTests > 0 ? '❌' : ''}\n`);

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
    };
  }
}

// Helper function to safely convert value to string for comparison
function valueToString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Assertion utilities
export function expect<T>(actual: T): AssertionValue<T> {
  return {
    toBe: (expected: T) => {
      if (actual !== expected) {
        throw new Error(`Expected ${valueToString(expected)} but got ${valueToString(actual)}`);
      }
    },
    toEqual: (expected: T) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toContain: ((expected: unknown) => {
      if (!Array.isArray(actual) && typeof actual !== 'string') {
        throw new Error('toContain can only be used with arrays or strings');
      }
      const stringExpected = valueToString(expected);
      if (typeof actual === 'string') {
        if (!actual.includes(stringExpected)) {
          throw new Error(`Expected "${actual}" to contain "${stringExpected}"`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.some(item => valueToString(item) === stringExpected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to contain ${stringExpected}`);
        }
      }
    }) as AssertionValue<T>['toContain'],
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected ${valueToString(actual)} to be truthy`);
      }
    },
    toBeFalsy: () => {
      if (actual) {
        throw new Error(`Expected ${valueToString(actual)} to be falsy`);
      }
    },
    toThrow: (() => {
      if (typeof actual !== 'function') {
        throw new Error('toThrow can only be used with functions');
      }
      try {
        (actual as () => void)();
        throw new Error('Expected function to throw');
      } catch (e) {
        // Success - function threw as expected
      }
    }) as AssertionValue<T>['toThrow'],
    toBeGreaterThan: ((expected: number) => {
      if (typeof actual !== 'number') {
        throw new Error('toBeGreaterThan can only be used with numbers');
      }
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    }) as AssertionValue<T>['toBeGreaterThan'],
    toBeLessThan: ((expected: number) => {
      if (typeof actual !== 'number') {
        throw new Error('toBeLessThan can only be used with numbers');
      }
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    }) as AssertionValue<T>['toBeLessThan'],
    toBeGreaterThanOrEqual: ((expected: number) => {
      if (typeof actual !== 'number') {
        throw new Error('toBeGreaterThanOrEqual can only be used with numbers');
      }
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    }) as AssertionValue<T>['toBeGreaterThanOrEqual'],
    toBeLessThanOrEqual: ((expected: number) => {
      if (typeof actual !== 'number') {
        throw new Error('toBeLessThanOrEqual can only be used with numbers');
      }
      if (!(actual <= expected)) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    }) as AssertionValue<T>['toBeLessThanOrEqual'],
  };
}

// Export test runner utilities
export const runner = new TestRunner();
export const describe = runner.describe.bind(runner);
export const test = runner.test.bind(runner);
export const beforeEach = runner.beforeEach.bind(runner);
export const afterEach = runner.afterEach.bind(runner);
export const runTests = () => runner.run();
