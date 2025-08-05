import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DataServiceImpl } from '../dataService';
import type { Grade, Sentence } from '../../types';

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

describe('DataService', () => {
  let dataService: DataServiceImpl;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Create fresh instance
    dataService = new DataServiceImpl();
  });

  afterEach(() => {
    // Clean up
    dataService.clearStoredData();
  });

  describe('getSentencesByGrade', () => {
    it('should return sentences for valid grade', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      expect(sentences).toBeInstanceOf(Array);
      expect(sentences.length).toBeGreaterThan(0);
      
      // Check sentence structure
      const firstSentence = sentences[0];
      expect(firstSentence).toHaveProperty('id');
      expect(firstSentence).toHaveProperty('korean');
      expect(firstSentence).toHaveProperty('english');
      expect(firstSentence).toHaveProperty('grade', 'middle1');
      expect(firstSentence).toHaveProperty('isImportant', false);
      expect(firstSentence).toHaveProperty('studyCount', 0);
    });

    it('should return empty array for invalid grade', () => {
      const sentences = dataService.getSentencesByGrade('invalid' as Grade);
      expect(sentences).toEqual([]);
    });

    it('should return copies of sentences to prevent external modification', () => {
      const sentences1 = dataService.getSentencesByGrade('middle1');
      const sentences2 = dataService.getSentencesByGrade('middle1');
      
      // Modify first array
      if (sentences1.length > 0) {
        sentences1[0].isImportant = true;
        
        // Second array should not be affected
        expect(sentences2[0].isImportant).toBe(false);
      }
    });
  });

  describe('toggleImportant', () => {
    it('should toggle important status of a sentence', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      expect(sentences.length).toBeGreaterThan(0);
      
      const firstSentence = sentences[0];
      const initialImportant = firstSentence.isImportant;
      
      // Toggle important status
      dataService.toggleImportant(firstSentence.id);
      
      // Check updated status
      const updatedSentences = dataService.getSentencesByGrade('middle1');
      const updatedSentence = updatedSentences.find(s => s.id === firstSentence.id);
      
      expect(updatedSentence?.isImportant).toBe(!initialImportant);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle invalid sentence ID gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      dataService.toggleImportant('invalid-id');
      
      expect(consoleSpy).toHaveBeenCalledWith('Sentence with ID invalid-id not found');
      consoleSpy.mockRestore();
    });

    it('should handle empty or invalid sentence ID', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      dataService.toggleImportant('');
      dataService.toggleImportant(null as any);
      dataService.toggleImportant(undefined as any);
      
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });
  });

  describe('getImportantSentences', () => {
    it('should return empty array when no sentences are marked important', () => {
      const importantSentences = dataService.getImportantSentences();
      expect(importantSentences).toEqual([]);
    });

    it('should return important sentences from all grades', () => {
      // Mark sentences from different grades as important
      const middle1Sentences = dataService.getSentencesByGrade('middle1');
      const high1Sentences = dataService.getSentencesByGrade('high1');
      
      if (middle1Sentences.length > 0 && high1Sentences.length > 0) {
        dataService.toggleImportant(middle1Sentences[0].id);
        dataService.toggleImportant(high1Sentences[0].id);
        
        const importantSentences = dataService.getImportantSentences();
        expect(importantSentences).toHaveLength(2);
        
        // Check that sentences are from different grades
        const grades = importantSentences.map(s => s.grade);
        expect(grades).toContain('middle1');
        expect(grades).toContain('high1');
      }
    });

    it('should return sentences sorted by grade and ID', () => {
      // Mark multiple sentences as important
      const middle1Sentences = dataService.getSentencesByGrade('middle1');
      const middle2Sentences = dataService.getSentencesByGrade('middle2');
      
      if (middle1Sentences.length > 1 && middle2Sentences.length > 0) {
        dataService.toggleImportant(middle2Sentences[0].id);
        dataService.toggleImportant(middle1Sentences[1].id);
        dataService.toggleImportant(middle1Sentences[0].id);
        
        const importantSentences = dataService.getImportantSentences();
        expect(importantSentences.length).toBeGreaterThanOrEqual(3);
        
        // Check sorting: middle1 sentences should come before middle2
        const middle1Count = importantSentences.filter(s => s.grade === 'middle1').length;
        const firstMiddle2Index = importantSentences.findIndex(s => s.grade === 'middle2');
        
        if (firstMiddle2Index !== -1) {
          expect(firstMiddle2Index).toBeGreaterThanOrEqual(middle1Count);
        }
      }
    });

    it('should return copies of sentences to prevent external modification', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        dataService.toggleImportant(sentences[0].id);
        
        const importantSentences1 = dataService.getImportantSentences();
        const importantSentences2 = dataService.getImportantSentences();
        
        // Modify first array
        if (importantSentences1.length > 0) {
          importantSentences1[0].korean = 'Modified';
          
          // Second array should not be affected
          expect(importantSentences2[0].korean).not.toBe('Modified');
        }
      }
    });
  });

  describe('localStorage integration', () => {
    it('should save important sentences to localStorage', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        dataService.toggleImportant(sentences[0].id);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'english-card-learning-important',
          expect.stringContaining(sentences[0].id)
        );
      }
    });

    it('should load important sentences from localStorage', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        const mockStoredData = {
          importantSentences: [sentences[0].id],
          sentences: {},
          userPreferences: {
            autoPlaySpeed: 'normal',
            ttsVoiceIndex: 0
          }
        };
        
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoredData));
        
        // Create new instance to test loading
        const newDataService = new DataServiceImpl();
        const loadedSentences = newDataService.getSentencesByGrade('middle1');
        const importantSentence = loadedSentences.find(s => s.id === sentences[0].id);
        
        expect(importantSentence?.isImportant).toBe(true);
      }
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Should not throw error
      expect(() => new DataServiceImpl()).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });

  describe('utility methods', () => {
    it('should get sentence by ID', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        const firstSentence = sentences[0];
        const foundSentence = dataService.getSentenceById(firstSentence.id);
        
        expect(foundSentence).toEqual(firstSentence);
      }
    });

    it('should return null for invalid sentence ID', () => {
      const foundSentence = dataService.getSentenceById('invalid-id');
      expect(foundSentence).toBeNull();
    });

    it('should return statistics', () => {
      const stats = dataService.getStatistics();
      
      expect(stats).toHaveProperty('totalSentences');
      expect(stats).toHaveProperty('importantSentences');
      expect(stats).toHaveProperty('sentencesByGrade');
      
      expect(stats.totalSentences).toBeGreaterThan(0);
      expect(stats.importantSentences).toBeGreaterThanOrEqual(0);
      expect(Object.keys(stats.sentencesByGrade)).toHaveLength(6); // 6 grades
    });

    it('should update study count', () => {
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        const firstSentence = sentences[0];
        const initialCount = firstSentence.studyCount;
        
        dataService.updateStudyCount(firstSentence.id);
        
        const updatedSentences = dataService.getSentencesByGrade('middle1');
        const updatedSentence = updatedSentences.find(s => s.id === firstSentence.id);
        
        expect(updatedSentence?.studyCount).toBe(initialCount + 1);
        expect(updatedSentence?.lastStudied).toBeInstanceOf(Date);
      }
    });

    it('should clear stored data', () => {
      // Mark a sentence as important
      const sentences = dataService.getSentencesByGrade('middle1');
      if (sentences.length > 0) {
        dataService.toggleImportant(sentences[0].id);
        
        // Clear data
        dataService.clearStoredData();
        
        // Check that important sentences are cleared
        const importantSentences = dataService.getImportantSentences();
        expect(importantSentences).toHaveLength(0);
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('english-card-learning-data');
      }
    });
  });
});