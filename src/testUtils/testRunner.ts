export const runTests = async (tests: Array<() => Promise<void>>) => {
  for (const test of tests) {
    await test();
  }
}
