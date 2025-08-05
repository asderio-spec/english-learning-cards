// Data Service implementation
import type { DataService, Grade, Sentence } from '../types';
import { sentenceData, createSentence, isSentence, isValidGrade } from '../data/sentences';
import { storageService } from './storageService';

export class DataServiceImpl implements DataService {
  private sentences: Record<Grade, Sentence[]> = {} as Record<Grade, Sentence[]>;
  private importantSentenceIds: Set<string> = new Set();

  constructor() {
    this.initializeData();
    this.loadStoredData().catch(error => {
      console.error('Failed to load stored data during initialization:', error);
    });
  }

  /**
   * Initialize sentence data for all grades
   */
  private initializeData(): void {
    try {
      for (const grade of Object.keys(sentenceData) as Grade[]) {
        if (isValidGrade(grade)) {
          this.sentences[grade] = sentenceData[grade].map(createSentence);
        }
      }
    } catch (error) {
      console.error('Error initializing sentence data:', error);
      // Initialize with empty arrays as fallback
      const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
      grades.forEach(grade => {
        this.sentences[grade] = [];
      });
    }
  }

  /**
   * Load stored data from localStorage using storage service
   */
  private async loadStoredData(): Promise<void> {
    try {
      // Load important sentences
      const importantSentences = await storageService.loadImportantSentences();
      this.importantSentenceIds = new Set(importantSentences);
      this.updateImportantFlags();

      // Load sentence study data
      const sentenceData = await storageService.loadSentenceData();
      if (sentenceData) {
        this.mergeSentenceData(sentenceData);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      // Continue with default data if loading fails
    }
  }

  /**
   * Update important flags based on stored important sentence IDs
   */
  private updateImportantFlags(): void {
    for (const grade of Object.keys(this.sentences) as Grade[]) {
      this.sentences[grade].forEach(sentence => {
        sentence.isImportant = this.importantSentenceIds.has(sentence.id);
      });
    }
  }

  /**
   * Merge stored sentence data with current data
   */
  private mergeSentenceData(storedSentences: Record<Grade, Sentence[]>): void {
    try {
      for (const grade of Object.keys(storedSentences) as Grade[]) {
        if (isValidGrade(grade) && this.sentences[grade]) {
          const storedGradeSentences = storedSentences[grade];
          
          // Create a map for quick lookup
          const storedSentenceMap = new Map<string, Sentence>();
          storedGradeSentences.forEach(sentence => {
            if (isSentence(sentence)) {
              storedSentenceMap.set(sentence.id, sentence);
            }
          });

          // Update current sentences with stored data
          this.sentences[grade].forEach(sentence => {
            const storedSentence = storedSentenceMap.get(sentence.id);
            if (storedSentence) {
              sentence.studyCount = storedSentence.studyCount || 0;
              sentence.lastStudied = storedSentence.lastStudied ? new Date(storedSentence.lastStudied) : undefined;
              sentence.isImportant = storedSentence.isImportant || false;
            }
          });
        }
      }
    } catch (error) {
      console.error('Error merging sentence data:', error);
    }
  }

  /**
   * Save current data to localStorage using storage service
   */
  private async saveToStorage(): Promise<void> {
    try {
      // Save important sentences
      await storageService.saveImportantSentences(Array.from(this.importantSentenceIds));
      
      // Save sentence data with study counts
      await storageService.saveSentenceData(this.sentences);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  /**
   * Get sentences by grade
   */
  getSentencesByGrade(grade: Grade): Sentence[] {
    if (!isValidGrade(grade)) {
      console.error(`Invalid grade: ${grade}`);
      return [];
    }

    if (!this.sentences[grade]) {
      console.error(`No sentences found for grade: ${grade}`);
      return [];
    }

    // Return a copy to prevent external modification
    return this.sentences[grade].map(sentence => ({ ...sentence }));
  }

  /**
   * Toggle important status of a sentence
   */
  toggleImportant(sentenceId: string): void {
    if (!sentenceId || typeof sentenceId !== 'string') {
      console.error('Invalid sentence ID provided');
      return;
    }

    let sentenceFound = false;

    // Find and update the sentence
    for (const grade of Object.keys(this.sentences) as Grade[]) {
      const sentence = this.sentences[grade].find(s => s.id === sentenceId);
      if (sentence) {
        sentence.isImportant = !sentence.isImportant;
        
        // Update the important sentences set
        if (sentence.isImportant) {
          this.importantSentenceIds.add(sentenceId);
        } else {
          this.importantSentenceIds.delete(sentenceId);
        }
        
        sentenceFound = true;
        break;
      }
    }

    if (!sentenceFound) {
      console.error(`Sentence with ID ${sentenceId} not found`);
      return;
    }

    // Save to storage
    this.saveToStorage().catch(error => {
      console.error('Failed to save important sentence toggle:', error);
    });
  }

  /**
   * Get all important sentences
   */
  getImportantSentences(): Sentence[] {
    const importantSentences: Sentence[] = [];

    for (const grade of Object.keys(this.sentences) as Grade[]) {
      const gradeSentences = this.sentences[grade].filter(sentence => sentence.isImportant);
      importantSentences.push(...gradeSentences);
    }

    // Sort by grade and then by ID for consistent ordering
    importantSentences.sort((a, b) => {
      const gradeOrder: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
      const gradeComparison = gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
      
      if (gradeComparison !== 0) {
        return gradeComparison;
      }
      
      return a.id.localeCompare(b.id);
    });

    // Return a copy to prevent external modification
    return importantSentences.map(sentence => ({ ...sentence }));
  }

  /**
   * Update study count for a sentence
   */
  updateStudyCount(sentenceId: string): void {
    if (!sentenceId || typeof sentenceId !== 'string') {
      console.error('Invalid sentence ID provided');
      return;
    }

    let sentenceFound = false;

    // Find and update the sentence
    for (const grade of Object.keys(this.sentences) as Grade[]) {
      const sentence = this.sentences[grade].find(s => s.id === sentenceId);
      if (sentence) {
        sentence.studyCount = (sentence.studyCount || 0) + 1;
        sentence.lastStudied = new Date();
        sentenceFound = true;
        break;
      }
    }

    if (!sentenceFound) {
      console.error(`Sentence with ID ${sentenceId} not found`);
      return;
    }

    // Save to storage
    this.saveToStorage().catch(error => {
      console.error('Failed to save sentence study count:', error);
    });
  }

  /**
   * Get sentence by ID
   */
  getSentenceById(sentenceId: string): Sentence | null {
    if (!sentenceId || typeof sentenceId !== 'string') {
      return null;
    }

    for (const grade of Object.keys(this.sentences) as Grade[]) {
      const sentence = this.sentences[grade].find(s => s.id === sentenceId);
      if (sentence) {
        return { ...sentence }; // Return a copy
      }
    }

    return null;
  }

  /**
   * Clear all stored data (for testing or reset purposes)
   */
  async clearStoredData(): Promise<void> {
    try {
      await storageService.clearAllData();
      this.importantSentenceIds.clear();
      this.initializeData(); // Reinitialize with fresh data
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  /**
   * Get statistics about the data
   */
  getStatistics(): {
    totalSentences: number;
    importantSentences: number;
    sentencesByGrade: Record<Grade, number>;
  } {
    const stats = {
      totalSentences: 0,
      importantSentences: this.importantSentenceIds.size,
      sentencesByGrade: {} as Record<Grade, number>
    };

    for (const grade of Object.keys(this.sentences) as Grade[]) {
      const count = this.sentences[grade].length;
      stats.sentencesByGrade[grade] = count;
      stats.totalSentences += count;
    }

    return stats;
  }
}

// Create and export a singleton instance
export const dataService = new DataServiceImpl();