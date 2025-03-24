import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplateCreation } from '../habits/useTemplateCreation';
import { ActiveTemplate, DayOfWeek, TimePreference } from '@/components/habits/types';

describe('useTemplateCreation', () => {
  const mockAddTemplate = jest.fn();
  const mockUpdateTemplate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.dispatchEvent = jest.fn();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => 
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.isCreatingTemplate).toBeFalsy();
    expect(result.current.newTemplateName).toBe('');
  });

  it('should handle create template', () => {
    const { result } = renderHook(() => 
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleCreateTemplate();
    });

    expect(result.current.isCreatingTemplate).toBeTruthy();
    expect(result.current.selectedTemplate).not.toBeNull();
    
    if (result.current.selectedTemplate) {
      expect(result.current.selectedTemplate.templateId).toContain('custom-');
      expect(result.current.selectedTemplate.habits).toEqual([]);
      expect(result.current.selectedTemplate.activeDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      expect(result.current.selectedTemplate.customized).toBeTruthy();
      expect(result.current.selectedTemplate.name).toBe('New Template');
    }
  });

  it('should configure an existing template', () => {
    const { result } = renderHook(() => 
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    const mockTemplate: ActiveTemplate = {
      templateId: 'test-template',
      name: 'Test Template',
      habits: [],
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as DayOfWeek[],
      customized: true
    };

    act(() => {
      result.current.handleConfigureTemplate(mockTemplate);
    });

    expect(result.current.selectedTemplate).toEqual(mockTemplate);
    expect(result.current.isCreatingTemplate).toBeFalsy();
  });

  it('should handle save template for new template', () => {
    const { result } = renderHook(() =>
      useTemplateCreation(mockAddTemplate, mockUpdateTemplate)
    );

    act(() => {
      result.current.handleCreateTemplate();
    });

    act(() => {
      result.current.setNewTemplateName('My New Template');
    });

    const habit = {
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
      if (result.current.selectedTemplate) {
        result.current.selectedTemplate.habits = [habit];
      }
    });

    act(() => {
      result.current.handleSaveTemplate();
    });

    expect(mockAddTemplate).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'custom-templates',
      expect.any(String)
    );
  });
});
