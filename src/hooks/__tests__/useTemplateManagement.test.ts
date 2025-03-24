import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplateManagement } from '../habits/useTemplateManagement';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
window.dispatchEvent = jest.fn();

describe('useTemplateManagement', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with empty templates', () => {
    const { result } = renderHook(() => useTemplateManagement());
    expect(result.current.activeTemplates).toEqual([]);
  });

  it('should add a template', () => {
    const { result } = renderHook(() => useTemplateManagement());

    const template: ActiveTemplate = {
      templateId: 'test-template',
      name: 'Test Template', // Added required name
      habits: [],
      customized: false,
      activeDays: ['Mon', 'Tue'] as DayOfWeek[]
    };

    act(() => {
      result.current.addTemplate(template);
    });

    expect(result.current.activeTemplates).toHaveLength(1);
    expect(result.current.activeTemplates[0]).toEqual(template);
  });

  it('should update a template', () => {
    const { result } = renderHook(() => useTemplateManagement());

    const initialTemplate: ActiveTemplate = {
      templateId: 'test-template',
      name: 'Test Template',
      habits: [],
      customized: false,
      activeDays: ['Mon', 'Tue'] as DayOfWeek[]
    };

    act(() => {
      result.current.addTemplate(initialTemplate);
    });

    const updates = {
      name: 'Updated Template',
      activeDays: ['Wed', 'Thu'] as DayOfWeek[]
    };

    act(() => {
      result.current.updateTemplate(initialTemplate.templateId, updates);
    });

    expect(result.current.activeTemplates).toHaveLength(1);
    expect(result.current.activeTemplates[0].name).toEqual('Updated Template');
    expect(result.current.activeTemplates[0].activeDays).toEqual(['Wed', 'Thu']);
    expect(result.current.activeTemplates[0].customized).toBe(true);
  });

  it('should remove a template', () => {
    const { result } = renderHook(() => useTemplateManagement());

    const template: ActiveTemplate = {
      templateId: 'test-template',
      name: 'Test Template',
      habits: [],
      customized: false,
      activeDays: ['Mon', 'Tue'] as DayOfWeek[]
    };

    act(() => {
      result.current.addTemplate(template);
    });

    act(() => {
      result.current.removeTemplate(template.templateId);
    });

    expect(result.current.activeTemplates).toHaveLength(0);
  });

  it('should update template order', () => {
    const { result } = renderHook(() => useTemplateManagement());

    const template1: ActiveTemplate = {
      templateId: 'template-1',
      name: 'Template 1',
      habits: [],
      customized: false,
      activeDays: ['Mon'] as DayOfWeek[]
    };

    const template2: ActiveTemplate = {
      templateId: 'template-2',
      name: 'Template 2',
      habits: [],
      customized: false,
      activeDays: ['Tue'] as DayOfWeek[]
    };

    act(() => {
      result.current.addTemplate(template1);
      result.current.addTemplate(template2);
    });

    const reorderedTemplates = [template2, template1];

    act(() => {
      result.current.updateTemplateOrder(reorderedTemplates);
    });

    expect(result.current.activeTemplates).toEqual(reorderedTemplates);
  });

  it('should update template days', () => {
    const { result } = renderHook(() => useTemplateManagement());

    const template: ActiveTemplate = {
      templateId: 'test-template',
      name: 'Test Template',
      habits: [],
      customized: false,
      activeDays: ['Mon', 'Tue'] as DayOfWeek[]
    };

    act(() => {
      result.current.addTemplate(template);
    });

    const newDays = ['Wed', 'Thu'] as DayOfWeek[];

    act(() => {
      result.current.updateTemplateDays(template.templateId, newDays);
    });

    expect(result.current.activeTemplates[0].activeDays).toEqual(newDays);
    expect(result.current.activeTemplates[0].customized).toBe(true);
  });
});
