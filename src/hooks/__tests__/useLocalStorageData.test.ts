import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorageData } from '../useLocalStorageData';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';

const mockTemplate: ActiveTemplate = {
  templateId: 'test-1',
  habits: [],
  customized: false,
  activeDays: ['Mon', 'Wed', 'Fri'] as DayOfWeek[],
};

describe('useLocalStorageData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty templates if no data in localStorage', () => {
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.activeTemplates).toEqual([]);
  });

  it('should load templates from localStorage', () => {
    localStorage.setItem('active-templates', JSON.stringify([mockTemplate]));
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.activeTemplates).toEqual([mockTemplate]);
  });

  it('should add a template and update localStorage', () => {
    const { result } = renderHook(() => useLocalStorageData());

    act(() => {
      result.current.addTemplate(mockTemplate);
    });

    const storedTemplates = JSON.parse(localStorage.getItem('active-templates') || '[]');
    expect(storedTemplates).toEqual([mockTemplate]);
    expect(result.current.activeTemplates).toEqual([mockTemplate]);
  });

  it('should update a template and update localStorage', () => {
    localStorage.setItem('active-templates', JSON.stringify([mockTemplate]));
    const { result } = renderHook(() => useLocalStorageData());
    const updatedTemplate = { ...mockTemplate, customized: true };

    act(() => {
      result.current.updateTemplate('test-1', updatedTemplate);
    });

    const storedTemplates = JSON.parse(localStorage.getItem('active-templates') || '[]');
    expect(storedTemplates).toEqual([updatedTemplate]);
    expect(result.current.activeTemplates).toEqual([updatedTemplate]);
  });

  it('should remove a template and update localStorage', () => {
    localStorage.setItem('active-templates', JSON.stringify([mockTemplate]));
    const { result } = renderHook(() => useLocalStorageData());

    act(() => {
      result.current.removeTemplate('test-1');
    });

    const storedTemplates = JSON.parse(localStorage.getItem('active-templates') || '[]');
    expect(storedTemplates).toEqual([]);
    expect(result.current.activeTemplates).toEqual([]);
  });

  it('should update template order and update localStorage', () => {
    const mockTemplate2: ActiveTemplate = {
      templateId: 'test-2',
      habits: [],
      customized: false,
      activeDays: ['Mon', 'Wed', 'Fri'] as DayOfWeek[],
    };
    localStorage.setItem('active-templates', JSON.stringify([mockTemplate, mockTemplate2]));
    const { result } = renderHook(() => useLocalStorageData());
    const newOrder = [mockTemplate2, mockTemplate];

    act(() => {
      result.current.updateTemplateOrder(newOrder);
    });

    const storedTemplates = JSON.parse(localStorage.getItem('active-templates') || '[]');
    expect(storedTemplates).toEqual(newOrder);
    expect(result.current.activeTemplates).toEqual(newOrder);
  });
});
