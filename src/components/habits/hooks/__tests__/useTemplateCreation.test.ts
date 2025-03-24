import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplateCreation } from '../useTemplateCreation';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ActiveTemplate } from '@/types/habits/types';
import { TimePreference, HabitCategory } from '@/types/habits/types';

describe('useTemplateCreation', () => {
  const mockAddTemplate = vi.fn();
  const mockUpdateTemplate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => 
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.isCreatingTemplate).toBe(false);
    expect(result.current.newTemplateName).toBe('');
  });

  it('should handle template creation flow correctly', () => {
    const { result } = renderHook(() => 
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleCreateTemplate();
    });

    expect(result.current.isCreatingTemplate).toBe(true);
    expect(result.current.selectedTemplate).toBeDefined();
    expect(result.current.selectedTemplate?.habits).toEqual([]);

    act(() => {
      result.current.setNewTemplateName('My New Template');
    });

    expect(result.current.newTemplateName).toBe('My New Template');

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify([])),
      setItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    const mockEventManager = {
      emit: vi.fn()
    };

    // Continue with the test...
  });

  // More tests would go here...
});
