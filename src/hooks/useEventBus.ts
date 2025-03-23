
/**
 * DEPRECATED: This hook has been removed.
 * Please use the useEvent hook from @/hooks/useEvent instead.
 */
export function useEventBus() {
  throw new Error(
    "MIGRATION REQUIRED: useEventBus has been removed. " +
    "Please update your code to use useEvent from @/hooks/useEvent instead."
  );
}
