// Progress Service tests
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ProgressServiceImpl } from '../progressService';
import type { Grade } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock dataService
vi.mock('../dataService', () => ({
  dataService: {
    getSentencesByGrade: vi.fn((grade: Grade) => {
      // Return mock sentences for testing
      const mockSentences = Array.from({ length: 10 }, (_, i) => ({
        id: `${grade}-${i}`,
        korean: `한글 문장 ${i}`,
        english: `English sentence ${i}`,
        grade,
        isImportant: false,
        studyCount: 0,
        lastStudied: undefined
      }));
      return mockSentences;
    }),
    updateStudyCount: vi.fn(),
  },
}));

describe('ProgressService', () => {
  let progressService: ProgressServiceImpl;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Create fresh instance
    progressService = new ProgressServiceImpl();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default progress data', () => {
      const progress = progressService.getProgress('middle1');
      
      expect(progress).toEqual({
        grade: 'middle1',
        totalSentences: 10, // Mock returns 10 sentences
        studiedSentences: 0,
        completionRate: 0,
        streak: 0,
        lastStudyDate: undefined
      });
    });

    it('should load stored progress data', () => {
      const mockStoredData = {
        studiedSentences: {
          middle1: ['middle1-0', 'middle1-1'],
          middle2: ['middle2-0']
        },
        streakData: {
          currentStreak: 5,
          lastStudyDate: '2024-01-15',
          longestStreak: 10
        }
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoredData));
      
      const newProgressService = new ProgressServiceImpl();
      const progress = newProgressService.getProgress('middle1');
      
      expect(progress.studiedSentences).toBe(2);
      expect(progress.completionRate).toBe(20); // 2/10 * 100
      expect(progress.streak).toBe(5);
    });
  });

  describe('saveProgress', () => {
    it('should save progress for a sentence', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      
      const progress = progressService.getProgress('middle1');
      expect(progress.studiedSentences).toBe(1);
      expect(progress.completionRate).toBe(10); // 1/10 * 100
    });

    it('should not duplicate studied sentences', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle1', 'middle1-0'); // Same sentence again
      
      const progress = progressService.getProgress('middle1');
      expect(progress.studiedSentences).toBe(1);
    });

    it('should update streak when saving progress', () => {
      const initialStreak = progressService.getStreak();
      progressService.saveProgress('middle1', 'middle1-0');
      
      const newStreak = progressService.getStreak();
      expect(newStreak).toBe(initialStreak + 1);
    });

    it('should save to localStorage', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'english-card-learning-progress',
        expect.any(String)
      );
    });

    it('should handle invalid inputs gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      progressService.saveProgress('' as Grade, '');
      progressService.saveProgress('middle1', '');
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      consoleSpy.mockRestore();
    });
  });

  describe('getProgress', () => {
    it('should return progress for a specific grade', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle1', 'middle1-1');
      
      const progress = progressService.getProgress('middle1');
      
      expect(progress.grade).toBe('middle1');
      expect(progress.totalSentences).toBe(10);
      expect(progress.studiedSentences).toBe(2);
      expect(progress.completionRate).toBe(20);
    });

    it('should return fresh copy of progress data', () => {
      const progress1 = progressService.getProgress('middle1');
      const progress2 = progressService.getProgress('middle1');
      
      expect(progress1).not.toBe(progress2); // Different objects
      expect(progress1).toEqual(progress2); // Same content
    });

    it('should handle invalid grade gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const progress = progressService.getProgress('' as Grade);
      
      expect(progress.grade).toBe('middle1'); // Default fallback
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Streak Management', () => {
    beforeEach(() => {
      // Mock Date to control time
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should initialize streak to 1 on first study', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      
      expect(progressService.getStreak()).toBe(1);
    });

    it('should not increment streak on same day', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle1', 'middle1-1');
      
      expect(progressService.getStreak()).toBe(1);
    });

    it('should increment streak on consecutive days', () => {
      // Day 1
      progressService.saveProgress('middle1', 'middle1-0');
      expect(progressService.getStreak()).toBe(1);
      
      // Day 2
      vi.setSystemTime(new Date('2024-01-16T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-1');
      expect(progressService.getStreak()).toBe(2);
      
      // Day 3
      vi.setSystemTime(new Date('2024-01-17T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-2');
      expect(progressService.getStreak()).toBe(3);
    });

    it('should reset streak after gap in studying', () => {
      // Day 1
      progressService.saveProgress('middle1', 'middle1-0');
      expect(progressService.getStreak()).toBe(1);
      
      // Skip day 2, study on day 3
      vi.setSystemTime(new Date('2024-01-17T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-1');
      expect(progressService.getStreak()).toBe(1); // Reset to 1
    });

    it('should track longest streak', () => {
      // Build up a streak
      progressService.saveProgress('middle1', 'middle1-0');
      vi.setSystemTime(new Date('2024-01-16T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-1');
      vi.setSystemTime(new Date('2024-01-17T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-2');
      
      const streakInfo = progressService.getStreakInfo();
      expect(streakInfo.currentStreak).toBe(3);
      expect(streakInfo.longestStreak).toBe(3);
      
      // Break streak and start new one
      vi.setSystemTime(new Date('2024-01-19T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-3');
      vi.setSystemTime(new Date('2024-01-20T10:00:00Z'));
      progressService.saveProgress('middle1', 'middle1-4');
      
      const newStreakInfo = progressService.getStreakInfo();
      expect(newStreakInfo.currentStreak).toBe(2);
      expect(newStreakInfo.longestStreak).toBe(3); // Keeps previous longest
    });
  });

  describe('Overall Progress', () => {
    it('should calculate overall progress across all grades', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle1', 'middle1-1');
      progressService.saveProgress('middle2', 'middle2-0');
      
      const overallProgress = progressService.getOverallProgress();
      
      expect(overallProgress.totalSentences).toBe(60); // 6 grades * 10 sentences each
      expect(overallProgress.totalStudiedSentences).toBe(3);
      expect(overallProgress.overallCompletionRate).toBe(5); // 3/60 * 100 = 5%
      expect(overallProgress.gradeProgress.middle1.studiedSentences).toBe(2);
      expect(overallProgress.gradeProgress.middle2.studiedSentences).toBe(1);
    });
  });

  describe('Utility Methods', () => {
    it('should check if sentence is studied', () => {
      expect(progressService.isSentenceStudied('middle1', 'middle1-0')).toBe(false);
      
      progressService.saveProgress('middle1', 'middle1-0');
      
      expect(progressService.isSentenceStudied('middle1', 'middle1-0')).toBe(true);
    });

    it('should reset grade progress', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle1', 'middle1-1');
      
      let progress = progressService.getProgress('middle1');
      expect(progress.studiedSentences).toBe(2);
      
      progressService.resetGradeProgress('middle1');
      
      progress = progressService.getProgress('middle1');
      expect(progress.studiedSentences).toBe(0);
    });

    it('should reset all progress', () => {
      progressService.saveProgress('middle1', 'middle1-0');
      progressService.saveProgress('middle2', 'middle2-0');
      
      progressService.resetAllProgress();
      
      const progress1 = progressService.getProgress('middle1');
      const progress2 = progressService.getProgress('middle2');
      
      expect(progress1.studiedSentences).toBe(0);
      expect(progress2.studiedSentences).toBe(0);
      expect(progressService.getStreak()).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      progressService.saveProgress('middle1', 'middle1-0');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving progress to storage:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should handle corrupted stored data', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const newProgressService = new ProgressServiceImpl();
      const progress = newProgressService.getProgress('middle1');
      
      expect(progress.studiedSentences).toBe(0); // Should fallback to default
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading stored progress:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});