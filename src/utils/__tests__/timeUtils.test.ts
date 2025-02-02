import { describe, test, expect } from '../../testUtils/testRunner';
import { formatTime, calculateEfficiencyRatio, determineCompletionStatus } from '../timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    test('formats seconds correctly', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(3600)).toBe('60:00');
      expect(formatTime(45)).toBe('0:45');
    });
  });

  describe('calculateEfficiencyRatio', () => {
    test('calculates ratio correctly', () => {
      expect(calculateEfficiencyRatio(60, 60)).toBe(100);
      expect(calculateEfficiencyRatio(60, 120)).toBe(50);
      expect(calculateEfficiencyRatio(60, 30)).toBe(100);
    });

    test('handles zero values', () => {
      expect(calculateEfficiencyRatio(60, 0)).toBe(0);
    });
  });

  describe('determineCompletionStatus', () => {
    test('determines status correctly', () => {
      expect(determineCompletionStatus(60, 45)).toBe('Completed Early');
      expect(determineCompletionStatus(60, 60)).toBe('Completed On Time');
      expect(determineCompletionStatus(60, 75)).toBe('Completed Late');
    });
  });
});