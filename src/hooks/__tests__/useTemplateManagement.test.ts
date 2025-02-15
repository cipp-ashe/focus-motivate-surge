import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTemplateManagement } from '@/components/habits/hooks/useTemplateManagement';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';

describe('useTemplateManagement', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockTemplate: ActiveTemplate = {
    templateId: 'test-1',
    habits: [],
    customized: false,
    activeDays: ['Mon', 'Wed', 'Fri'] as DayOfWeek[],
  };

  it('should initialize with empty templates', () => {
    const { result } = renderHook(() => useTemplateManagement());
    expect(result.current.activeTemplates).toEqual([]);
  });

  it('should add template correctly', () => {
    const { result } = renderHook(() => useTemplateManagement());

    act(() => {
      result.current.addTemplate(mockTemplate);
    });

    expect(result.current.activeTemplates).toHaveLength(1);
    expect(result.current.activeTemplates[0]).toEqual(mockTemplate);
  });

  it('should update template correctly', () => {
    const { result } = renderHook(() => useTemplateManagement());
    const updatedDays: DayOfWeek[] = ['Mon', 'Tue'];

    act(() => {
      result.current.addTemplate(mockTemplate);
      result.current.updateTemplateDays(mockTemplate.templateId, updatedDays);
    });

    expect(result.current.activeTemplates[0].activeDays).toEqual(updatedDays);
    expect(result.current.activeTemplates[0].customized).toBe(true);
  });

  it('should remove template correctly', () => {
    const { result } = renderHook(() => useTemplateManagement());

    act(() => {
      result.current.addTemplate(mockTemplate);
      result.current.removeTemplate(mockTemplate.templateId);
    });

    expect(result.current.activeTemplates).toHaveLength(0);
  });

  it('should update template order correctly', () => {
    const { result } = renderHook(() => useTemplateManagement());
    const mockTemplate2 = { ...mockTemplate, templateId: 'test-2' };

    act(() => {
      result.current.addTemplate(mockTemplate);
      result.current.addTemplate(mockTemplate2);
      result.current.updateTemplateOrder([mockTemplate2, mockTemplate]);
    });

    expect(result.current.activeTemplates[0].templateId).toBe('test-2');
    expect(result.current.activeTemplates[1].templateId).toBe('test-1');
  });
});
