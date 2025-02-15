
import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';
import { useTemplateCreation } from '../useTemplateCreation';
import { ActiveTemplate } from '../../types';

const mockTemplate: ActiveTemplate = {
  templateId: 'test-1',
  habits: [],
  customized: false,
  activeDays: ['Mon', 'Wed', 'Fri'],
};

describe('useTemplateCreation', () => {
  const mockAddTemplate = vi.fn();
  const mockUpdateTemplate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() =>
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.isCreatingTemplate).toBe(false);
    expect(result.current.newTemplateName).toBe('');
  });

  it('handles template creation correctly', () => {
    const { result } = renderHook(() =>
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleCreateTemplate();
    });

    expect(result.current.isCreatingTemplate).toBe(true);
    expect(result.current.selectedTemplate).toBeTruthy();
    expect(result.current.selectedTemplate?.customized).toBe(true);
  });

  it('handles template configuration correctly', () => {
    const { result } = renderHook(() =>
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleConfigureTemplate(mockTemplate);
    });

    expect(result.current.selectedTemplate).toBe(mockTemplate);
    expect(result.current.isCreatingTemplate).toBe(false);
  });

  it('saves template correctly', () => {
    const { result } = renderHook(() =>
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleCreateTemplate();
      result.current.setNewTemplateName('New Template');
    });

    const mockHabit = {
      id: 'habit-1',
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Test',
      timePreference: 'Morning',
      metrics: { type: 'boolean' as const },
      insights: [],
      tips: [],
    };

    act(() => {
      if (result.current.selectedTemplate) {
        result.current.selectedTemplate.habits = [mockHabit];
        result.current.handleSaveTemplate();
      }
    });

    expect(mockAddTemplate).toHaveBeenCalled();
    const savedTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
    expect(savedTemplates.length).toBe(1);
    expect(savedTemplates[0].name).toBe('New Template');
  });
});
