
import { renderHook } from '@testing-library/react-hooks';
import { useTodaysHabits } from '../useTodaysHabits';
import type { ActiveTemplate } from '@/components/habits/types';

describe('useTodaysHabits', () => {
  const mockTemplate: ActiveTemplate = {
    templateId: 'template-1',
    habits: [
      {
        id: 'habit-1',
        name: 'Morning Exercise',
        description: 'Do morning exercises',
        category: 'Wellness',
        timePreference: 'Morning',
        metrics: { type: 'boolean' },
        insights: [],
        tips: []
      }
    ],
    customized: false,
    activeDays: ['Monday', 'Wednesday', 'Friday']
  };

  it('should return habits for today if template is active', () => {
    // Mock current day to be Monday
    const mockDate = new Date('2024-01-01'); // A Monday
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const { result } = renderHook(() => useTodaysHabits([mockTemplate]));
    expect(result.current.todaysHabits).toHaveLength(1);
    expect(result.current.todaysHabits[0].name).toBe('Morning Exercise');
  });

  it('should return empty array if no habits are active today', () => {
    // Mock current day to be Sunday
    const mockDate = new Date('2024-01-07'); // A Sunday
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const { result } = renderHook(() => useTodaysHabits([mockTemplate]));
    expect(result.current.todaysHabits).toHaveLength(0);
  });
});
