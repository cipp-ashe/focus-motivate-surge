import { runTests } from './testRunner';

// Import all test files here
import '../components/__tests__/TimerCircle.test';

// Run all tests
console.log('Running all tests...');
runTests().catch(console.error);