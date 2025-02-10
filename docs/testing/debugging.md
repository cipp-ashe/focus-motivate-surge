
# Debugging Tests

## Common Testing Patterns

### Testing Async Operations
```typescript
test('handles async operations', async () => {
  const { result } = createHookTester(useAsyncHook);
  await result.fetchData();
  expect(result.data).toBeDefined();
  expect(result.loading).toBe(false);
});
```

### Testing Error Handling
```typescript
test('handles errors gracefully', () => {
  const { result } = createHookTester(useErrorProne);
  expect(() => result.throwError()).toThrow('Expected error');
});
```

### Testing Side Effects
```typescript
test('cleans up side effects', () => {
  const cleanup = jest.fn();
  const { result } = createHookTester(useEffect);
  result.rerender();
  expect(cleanup).toHaveBeenCalled();
});
```

## Debugging Tips
1. Use `console.log` in tests (removed in production)
2. Use Jest's `--verbose` flag for detailed output
3. Use the debugger statement in tests
4. Check Jest snapshot files for unexpected changes

## Continuous Integration
- Tests run automatically on pull requests
- Coverage reports generated and checked
- Failed tests block merging
- Test results posted as PR comments
