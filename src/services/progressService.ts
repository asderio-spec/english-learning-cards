// Progress Service implementation
import type { ProgressService, Grade, LearningProgress } from '../types';
import { dataService } from './dataService';
import { storageService } from './storageService';

interface ProgressData {
  studiedSentences: Record<Grade, Set<string>>;
  streakData: {
    currentStreak: number;
    lastStudyDate: string | null;
    longestStreak: number;
  };
  gradeProgress: Record<Grade, LearningProgress>;
}

export class ProgressServiceImpl implements ProgressService {
  private progressData: ProgressData;

  constructor() {
    this.progressData = this.initializeProgressData();
    this.loadStoredProgress().catch(error => {
      console.error('Failed to load stored progress during initialization:', error);
    });
  }

  /**
   * Initialize default progress data structure
   */
  private initializeProgressData(): ProgressData {
    const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
    const studiedSentences: Record<Grade, Set<string>> = {} as Record<Grade, Set<string>>;
    const gradeProgress: Record<Grade, LearningProgress> = {} as Record<Grade, LearningProgress>;

    grades.forEach(grade => {
      studiedSentences[grade] = new Set();
      gradeProgress[grade] = {
        grade,
        totalSentences: 0,
        studiedSentences: 0,
        completionRate: 0,
        streak: 0
      };
    });

    return {
      studiedSentences,
      streakData: {
        currentStreak: 0,
        lastStudyDate: null,
        longestStreak: 0
      },
      gradeProgress
    };
  }

  /**
   * Load stored progress data from localStorage using storage service
   */
  private async loadStoredProgress(): Promise<void> {
    try {
      const completeData = await storageService.loadCompleteData();
      if (completeData) {
        // Load studied sentences
        if (completeData.studiedSentences) {
          for (const grade of Object.keys(completeData.studiedSentences) as Grade[]) {
            if (Array.isArray(completeData.studiedSentences[grade])) {
              this.progressData.studiedSentences[grade] = new Set(completeData.studiedSentences[grade]);
            }
          }
        }

        // Load streak data
        if (completeData.streakData) {
          this.progressData.streakData = {
            currentStreak: completeData.streakData.currentStreak || 0,
            lastStudyDate: completeData.streakData.lastStudyDate || null,
            longestStreak: completeData.streakData.longestStreak || 0
          };
        }

        // Load existing progress data
        if (completeData.progress) {
          this.progressData.gradeProgress = { ...this.progressData.gradeProgress, ...completeData.progress };
        }

        // Recalculate progress for all grades
        this.recalculateAllProgress();
      }
    } catch (error) {
      console.error('Error loading stored progress:', error);
      // Continue with default data if loading fails
    }
  }

  /**
   * Save progress data to localStorage using storage service
   */
  private async saveToStorage(): Promise<void> {
    try {
      const studiedSentences: Record<Grade, string[]> = {} as Record<Grade, string[]>;
      
      // Convert Sets to arrays for storage
      for (const grade of Object.keys(this.progressData.studiedSentences) as Grade[]) {
        studiedSentences[grade] = Array.from(this.progressData.studiedSentences[grade]);
      }

      const dataToStore = {
        studiedSentences,
        streakData: this.progressData.streakData,
        progress: this.progressData.gradeProgress
      };

      await storageService.saveCompleteData(dataToStore);
    } catch (error) {
      console.error('Error saving progress to storage:', error);
    }
  }

  /**
   * Recalculate progress for all grades
   */
  private recalculateAllProgress(): void {
    const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
    
    grades.forEach(grade => {
      this.recalculateGradeProgress(grade);
    });
  }

  /**
   * Recalculate progress for a specific grade
   */
  private recalculateGradeProgress(grade: Grade): void {
    const sentences = dataService.getSentencesByGrade(grade);
    const totalSentences = sentences.length;
    const studiedSentences = this.progressData.studiedSentences[grade].size;
    const completionRate = totalSentences > 0 ? Math.round((studiedSentences / totalSentences) * 100) : 0;

    this.progressData.gradeProgress[grade] = {
      grade,
      totalSentences,
      studiedSentences,
      completionRate,
      streak: this.progressData.streakData.currentStreak,
      lastStudyDate: this.progressData.streakData.lastStudyDate ? new Date(this.progressData.streakData.lastStudyDate) : undefined
    };
  }

  /**
   * Check if today is consecutive to the last study date
   */
  private isConsecutiveDay(lastStudyDate: string): boolean {
    const today = new Date();
    const lastDate = new Date(lastStudyDate);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1;
  }

  /**
   * Check if today is the same as the last study date
   */
  private isSameDay(lastStudyDate: string): boolean {
    const today = new Date();
    const lastDate = new Date(lastStudyDate);
    
    return today.toDateString() === lastDate.toDateString();
  }

  /**
   * Save progress for a specific sentence
   * Requirements: 6.1, 6.2, 6.3
   */
  saveProgress(grade: Grade, sentenceId: string): void {
    if (!grade || !sentenceId) {
      console.error('Invalid grade or sentence ID provided');
      return;
    }

    // Add sentence to studied sentences set
    this.progressData.studiedSentences[grade].add(sentenceId);

    // Update study count in data service
    dataService.updateStudyCount(sentenceId);

    // Update streak
    this.updateStreak();

    // Recalculate progress for this grade
    this.recalculateGradeProgress(grade);

    // Save to storage
    this.saveToStorage().catch(error => {
      console.error('Failed to save progress:', error);
    });
  }

  /**
   * Get progress for a specific grade
   * Requirements: 6.1, 6.2
   */
  getProgress(grade: Grade): LearningProgress {
    if (!grade) {
      console.error('Invalid grade provided');
      return {
        grade: 'middle1',
        totalSentences: 0,
        studiedSentences: 0,
        completionRate: 0,
        streak: 0
      };
    }

    // Ensure progress is up to date
    this.recalculateGradeProgress(grade);
    
    return { ...this.progressData.gradeProgress[grade] };
  }

  /**
   * Update learning streak
   * Requirements: 6.4
   */
  updateStreak(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { lastStudyDate, currentStreak, longestStreak } = this.progressData.streakData;

    if (!lastStudyDate) {
      // First time studying
      this.progressData.streakData.currentStreak = 1;
      this.progressData.streakData.lastStudyDate = today;
      this.progressData.streakData.longestStreak = Math.max(1, longestStreak);
    } else if (this.isSameDay(lastStudyDate)) {
      // Same day, don't increment streak but update date
      this.progressData.streakData.lastStudyDate = today;
    } else if (this.isConsecutiveDay(lastStudyDate)) {
      // Consecutive day, increment streak
      this.progressData.streakData.currentStreak = currentStreak + 1;
      this.progressData.streakData.lastStudyDate = today;
      this.progressData.streakData.longestStreak = Math.max(
        this.progressData.streakData.currentStreak,
        longestStreak
      );
    } else {
      // Gap in studying, reset streak
      this.progressData.streakData.currentStreak = 1;
      this.progressData.streakData.lastStudyDate = today;
      // Keep longest streak as is
    }

    // Update streak in all grade progress
    const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
    grades.forEach(grade => {
      this.progressData.gradeProgress[grade].streak = this.progressData.streakData.currentStreak;
      this.progressData.gradeProgress[grade].lastStudyDate = new Date(today);
    });
  }

  /**
   * Get current learning streak
   * Requirements: 6.4
   */
  getStreak(): number {
    return this.progressData.streakData.currentStreak;
  }

  /**
   * Get detailed streak information
   */
  getStreakInfo(): {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: Date | null;
  } {
    return {
      currentStreak: this.progressData.streakData.currentStreak,
      longestStreak: this.progressData.streakData.longestStreak,
      lastStudyDate: this.progressData.streakData.lastStudyDate 
        ? new Date(this.progressData.streakData.lastStudyDate) 
        : null
    };
  }

  /**
   * Get overall progress across all grades
   */
  getOverallProgress(): {
    totalSentences: number;
    totalStudiedSentences: number;
    overallCompletionRate: number;
    gradeProgress: Record<Grade, LearningProgress>;
  } {
    let totalSentences = 0;
    let totalStudiedSentences = 0;

    const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
    const gradeProgress: Record<Grade, LearningProgress> = {} as Record<Grade, LearningProgress>;

    grades.forEach(grade => {
      const progress = this.getProgress(grade);
      gradeProgress[grade] = progress;
      totalSentences += progress.totalSentences;
      totalStudiedSentences += progress.studiedSentences;
    });

    const overallCompletionRate = totalSentences > 0 
      ? Math.round((totalStudiedSentences / totalSentences) * 100) 
      : 0;

    return {
      totalSentences,
      totalStudiedSentences,
      overallCompletionRate,
      gradeProgress
    };
  }

  /**
   * Reset progress for a specific grade
   */
  resetGradeProgress(grade: Grade): void {
    this.progressData.studiedSentences[grade].clear();
    this.recalculateGradeProgress(grade);
    this.saveToStorage().catch(error => {
      console.error('Failed to save after resetting grade progress:', error);
    });
  }

  /**
   * Reset all progress data
   */
  async resetAllProgress(): Promise<void> {
    this.progressData = this.initializeProgressData();
    
    try {
      await storageService.clearAllData();
    } catch (error) {
      console.error('Error clearing progress storage:', error);
    }
  }

  /**
   * Get sentences that need more practice (studied less than 3 times)
   */
  getSentencesNeedingPractice(grade: Grade): string[] {
    const sentences = dataService.getSentencesByGrade(grade);
    return sentences
      .filter(sentence => sentence.studyCount < 3)
      .map(sentence => sentence.id);
  }

  /**
   * Check if a sentence has been studied
   */
  isSentenceStudied(grade: Grade, sentenceId: string): boolean {
    return this.progressData.studiedSentences[grade].has(sentenceId);
  }
}

// Create and export a singleton instance
export const progressService = new ProgressServiceImpl();