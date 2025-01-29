import { describe, test, expect } from '../../testUtils/testRunner';
import { useFocusTrap } from '../useFocusTrap';
import { createHookTester } from '../../testUtils/hookTester';

const createFocusTrapTester = createHookTester(useFocusTrap);

// Mock DOM elements and focus handling
const createMockElement = (tabIndex = 0) => ({
  tabIndex,
  hasAttribute: (attr: string) => 
    attr === 'disabled' ? false : attr === 'tabindex' ? tabIndex !== -1 : false,
  focus: jest.fn(),
  getAttribute: (attr: string) => attr === 'tabindex' ? String(tabIndex) : null,
});

describe('useFocusTrap', () => {
  test('initializes with correct state', () => {
    const { result } = createFocusTrapTester({
      enabled: true
    });

    expect(result.containerRef).toBeTruthy();
  });

  test('traps focus within container', () => {
    const firstElement = createMockElement();
    const middleElement = createMockElement();
    const lastElement = createMockElement();

    const { result } = createFocusTrapTester({
      enabled: true
    });

    // Mock container with focusable elements
    Object.defineProperty(result.containerRef, 'current', {
      value: {
        querySelectorAll: () => [firstElement, middleElement, lastElement]
      }
    });

    const focusableElements = result.getFocusableElements();
    expect(focusableElements.length).toBe(3);

    // Simulate tab navigation
    result.handleKeyDown({ key: 'Tab', preventDefault: () => {} });
    expect(firstElement.focus).toBeCalled();

    // Simulate shift+tab from first element
    document.activeElement = firstElement;
    result.handleKeyDown({ key: 'Tab', shiftKey: true, preventDefault: () => {} });
    expect(lastElement.focus).toBeCalled();
  });

  test('respects disabled state', () => {
    const { result } = createFocusTrapTester({
      enabled: false
    });

    expect(result.getFocusableElements().length).toBe(0);
  });

  test('handles escape key', () => {
    let escapeCalled = false;
    const { result } = createFocusTrapTester({
      enabled: true,
      onEscape: () => { escapeCalled = true; }
    });

    result.handleKeyDown({ key: 'Escape' });
    expect(escapeCalled).toBeTruthy();
  });

  test('excludes non-focusable elements', () => {
    const disabledElement = createMockElement();
    Object.defineProperty(disabledElement, 'hasAttribute', {
      value: (attr: string) => attr === 'disabled'
    });

    const hiddenElement = createMockElement();
    Object.defineProperty(hiddenElement, 'hasAttribute', {
      value: (attr: string) => attr === 'aria-hidden'
    });

    const { result } = createFocusTrapTester({
      enabled: true
    });

    // Mock container with mix of focusable and non-focusable elements
    Object.defineProperty(result.containerRef, 'current', {
      value: {
        querySelectorAll: () => [
          createMockElement(),
          disabledElement,
          hiddenElement,
          createMockElement(-1) // negative tabindex
        ]
      }
    });

    const focusableElements = result.getFocusableElements();
    expect(focusableElements.length).toBe(1);
  });

  test('restores focus on disable', () => {
    const previousElement = createMockElement();
    document.activeElement = previousElement;

    const { result, rerender } = createFocusTrapTester({
      enabled: true
    });

    // Simulate changing enabled to false
    rerender({ enabled: false });
    expect(previousElement.focus).toBeCalled();
  });

  test('handles missing container ref', () => {
    const { result } = createFocusTrapTester({
      enabled: true
    });

    // Set container ref to null
    Object.defineProperty(result.containerRef, 'current', {
      value: null
    });

    const focusableElements = result.getFocusableElements();
    expect(focusableElements.length).toBe(0);
  });

  test('maintains focus order', () => {
    const elements = [
      createMockElement(),
      createMockElement(),
      createMockElement()
    ];

    const { result } = createFocusTrapTester({
      enabled: true
    });

    Object.defineProperty(result.containerRef, 'current', {
      value: {
        querySelectorAll: () => elements
      }
    });

    const focusableElements = result.getFocusableElements();
    expect(focusableElements).toEqual(elements);
  });
});