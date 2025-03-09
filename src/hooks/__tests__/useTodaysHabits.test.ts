
import { renderHook } from '@testing-library/react-hooks';
import { useTodaysHabits } from '../habits/useTodaysHabits';
import type { ActiveTemplate } from '@/components/habits/types';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { useLocation } from 'react-router-dom';

// Mock the imports
jest.mock('@/contexts/habits/HabitContext');
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn()
}));

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
  activeDays: ['Mon', 'Wed', 'Fri']
};

beforeEach(() => {
  // Reset mocks
  (useHabitState as jest.Mock).mockReturnValue({ templates: [mockTemplate] });
  (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
});

it('should return habits for today if template is active', () => {
  // Mock current day to be Monday
  const mockDate = new Date('2024-01-01'); // A Monday
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

  const { result } = renderHook(() => useTodaysHabits());
  expect(result.current.todaysHabits).toHaveLength(1);
  expect(result.current.todaysHabits[0].name).toBe('Morning Exercise');
});

it('should return empty array if no habits are active today', () => {
  // Mock current day to be Sunday (which is not in the active days)
  const mockDate = new Date('2024-01-07'); // A Sunday
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  
  // Override the template to not include Sunday
  (useHabitState as jest.Mock).mockReturnValue({ 
    templates: [{...mockTemplate, activeDays: ['Mon', 'Wed', 'Fri']}] 
  });

  const { result } = renderHook(() => useTodaysHabits());
  expect(result.current.todaysHabits).toHaveLength(0);
});
