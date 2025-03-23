
import { renderHook, act } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import { useTemplateCreation } from '../useTemplateCreation';
import { ActiveTemplate, HabitDetail, TimePreference } from '@/components/habits/types';

// Mock eventBus
vi.mock('@/lib/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useTemplateCreation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('initializes with default state', () => {
    const addTemplate = vi.fn();
    const updateTemplate = vi.fn();

    const { result } = renderHook(() => useTemplateCreation(addTemplate, updateTemplate));

    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.isCreatingTemplate).toBe(false);
    expect(result.current.newTemplateName).toBe('');
  });

  it('handles create template', () => {
    const addTemplate = vi.fn();
    const updateTemplate = vi.fn();

    const { result } = renderHook(() => useTemplateCreation(addTemplate, updateTemplate));

    act(() => {
      result.current.handleCreateTemplate();
    });

    expect(result.current.isCreatingTemplate).toBe(true);
    expect(result.current.selectedTemplate).not.toBeNull();
    expect(result.current.selectedTemplate?.templateId).toContain('custom-');
  });

  it('handles configure template', () => {
    const addTemplate = vi.fn();
    const updateTemplate = vi.fn();
    const mockTemplate: ActiveTemplate = {
      templateId: 'test-id',
      habits: [],
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };

    const { result } = renderHook(() => useTemplateCreation(addTemplate, updateTemplate));

    act(() => {
      result.current.handleConfigureTemplate(mockTemplate);
    });

    expect(result.current.selectedTemplate).toBe(mockTemplate);
    expect(result.current.isCreatingTemplate).toBe(false);
  });

  it('handles save template for new template', () => {
    const addTemplate = vi.fn();
    const updateTemplate = vi.fn();
    
    // Mock window.dispatchEvent
    const originalDispatchEvent = window.dispatchEvent;
    window.dispatchEvent = vi.fn();

    const { result } = renderHook(() => useTemplateCreation(addTemplate, updateTemplate));

    act(() => {
      result.current.handleCreateTemplate();
    });

    // Set a template name
    act(() => {
      result.current.setNewTemplateName('My New Template');
    });

    // Manually update selected template with a sample habit
    const habit: HabitDetail = {
      id: 'habit-123',
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Personal',
      timePreference: 'Morning' as TimePreference,
      metrics: { type: 'boolean' },
      insights: [],
      tips: [],
    };

    act(() => {
      // @ts-ignore - Bypassing readonly for testing
      result.current.selectedTemplate!.habits = [habit];
    });

    act(() => {
      result.current.handleSaveTemplate();
    });

    expect(addTemplate).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'custom-templates',
      expect.any(String)
    );

    // Restore window.dispatchEvent
    window.dispatchEvent = originalDispatchEvent;
  });
});
