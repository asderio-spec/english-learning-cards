// Storage Service tests
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageServiceImpl, type UserPreferences, type CompleteStoredData } from '../storageService';
import type { Grade, LearningProgress } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => {
      // Handle quota exceeded simulation
      if (store['__quota_exceeded__']) {
        throw new Error('Storage quota exceeded');
      }
      // Handle localStorage not available simulation
      if (store['__not_available__']) {
        throw new Error('localStorage not available');
      }
      // Handle storage error simulation
      if (store['__storage_error__']) {
        throw new Error('Storage error');
      }
      return store[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      // Handle quota exceeded simulation
      if (store['__quota_exceeded__']) {
        const error = new Error('Storage quota exceeded');
        (error as any).code = 22;
        throw error;
      }
      // Handle write error simulation
      if (store['__write_error__']) {
        throw new Error('Write failed');
      }
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

// Replace global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('StorageService', () => {
  let storageService: StorageServiceImpl;

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset error simulation flags
    delete (localStorageMock as any)['__quota_exceeded__'];
    delete (localStorageMock as any)['__not_available__'];
    delete (localStorageMock as any)['__storage_error__'];
    delete (localStorageMock as any)['__write_error__'];
    storageService = new StorageServiceImpl();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('User Preferences', () => {
    it('should save and load user preferences', async () => {
      const preferences: UserPreferences = {
        autoPlaySpeed: 'fast',
        ttsVoiceIndex: 2,
        soundEnabled: false,
        animationsEnabled: true
      };

      await storageService.saveUserPreferences(preferences);
      const loaded = await storageService.loadUserPreferences();

      expect(loaded.autoPlaySpeed).toBe('fast');
      expect(loaded.ttsVoiceIndex).toBe(2);
      expect(loaded.soundEnabled).toBe(false);
      expect(loaded.animationsEnabled).toBe(true);
    });

    it('should return default preferences when none exist', async () => {
      const preferences = await storageService.loadUserPreferences();

      expect(preferences.autoPlaySpeed).toBe('normal');
      expect(preferences.ttsVoiceIndex).toBe(0);
      expect(preferences.soundEnabled).toBe(true);
      expect(preferences.animationsEnabled).toBe(true);
    });

    it('should handle localStorage errors gracefully', async () => {
      // Simulate quota exceeded error
      (localStorageMock as any)['__quota_exceeded__'] = true;

      const preferences: UserPreferences = {
        autoPlaySpeed: 'slow',
        ttsVoiceIndex: 1,
        soundEnabled: true,
        animationsEnabled: false
      };

      // Should not throw an error
      await expect(storageService.saveUserPreferences(preferences)).resolves.toBeUndefined();
    });
  });

  describe('Progress Data', () => {
    it('should save and load progress data', async () => {
      const progress: Record<Grade, LearningProgress> = {
        middle1: {
          grade: 'middle1',
          totalSentences: 100,
          studiedSentences: 25,
          completionRate: 25,
          streak: 3,
          lastStudyDate: new Date('2024-01-15')
        },
        middle2: {
          grade: 'middle2',
          totalSentences: 100,
          studiedSentences: 50,
          completionRate: 50,
          streak: 3
        }
      } as Record<Grade, LearningProgress>;

      await storageService.saveProgress(progress);
      const loaded = await storageService.loadProgress();

      expect(loaded).toEqual(progress);
    });

    it('should return null when no progress data exists', async () => {
      const progress = await storageService.loadProgress();
      expect(progress).toBeNull();
    });
  });

  describe('Important Sentences', () => {
    it('should save and load important sentences', async () => {
      const importantSentences = ['sentence1', 'sentence2', 'sentence3'];

      await storageService.saveImportantSentences(importantSentences);
      const loaded = await storageService.loadImportantSentences();

      expect(loaded).toEqual(importantSentences);
    });

    it('should return empty array when no important sentences exist', async () => {
      const sentences = await storageService.loadImportantSentences();
      expect(sentences).toEqual([]);
    });

    it('should handle corrupted important sentences data', async () => {
      // Simulate quota exceeded error during save
      (localStorageMock as any)['__quota_exceeded__'] = true;

      const sentences = ['test1', 'test2'];
      await storageService.saveImportantSentences(sentences);
      
      // Reset error and try to load
      delete (localStorageMock as any)['__quota_exceeded__'];
      const loaded = await storageService.loadImportantSentences();
      expect(loaded).toEqual([]);
    });
  });

  describe('Complete Data Management', () => {
    it('should save and load complete data structure', async () => {
      const completeData: Partial<CompleteStoredData> = {
        version: '1.0.0',
        progress: {
          middle1: {
            grade: 'middle1',
            totalSentences: 100,
            studiedSentences: 30,
            completionRate: 30,
            streak: 5
          }
        } as Record<Grade, LearningProgress>,
        importantSentences: ['sent1', 'sent2'],
        userPreferences: {
          autoPlaySpeed: 'fast',
          ttsVoiceIndex: 1,
          soundEnabled: true,
          animationsEnabled: false
        },
        studiedSentences: {
          middle1: ['sent1', 'sent2', 'sent3']
        } as Record<Grade, string[]>,
        streakData: {
          currentStreak: 5,
          lastStudyDate: '2024-01-15',
          longestStreak: 10
        }
      };

      await storageService.saveCompleteData(completeData);
      const loaded = await storageService.loadCompleteData();

      expect(loaded).toBeDefined();
      expect(loaded!.version).toBe('1.0.0');
      expect(loaded!.importantSentences).toEqual(['sent1', 'sent2']);
      expect(loaded!.userPreferences.autoPlaySpeed).toBe('fast');
      expect(loaded!.streakData.currentStreak).toBe(5);
    });

    it('should provide defaults for missing fields in complete data', async () => {
      const partialData: Partial<CompleteStoredData> = {
        importantSentences: ['sent1']
      };

      await storageService.saveCompleteData(partialData);
      const loaded = await storageService.loadCompleteData();

      expect(loaded).toBeDefined();
      expect(loaded!.version).toBe('1.0.0');
      expect(loaded!.importantSentences).toEqual(['sent1']);
      expect(loaded!.userPreferences.autoPlaySpeed).toBe('normal');
      expect(loaded!.streakData.currentStreak).toBe(0);
    });
  });

  describe('Data Export and Import', () => {
    it('should export data as JSON string', async () => {
      const testData: Partial<CompleteStoredData> = {
        importantSentences: ['test1', 'test2'],
        userPreferences: {
          autoPlaySpeed: 'slow',
          ttsVoiceIndex: 0,
          soundEnabled: true,
          animationsEnabled: true
        }
      };

      await storageService.saveCompleteData(testData);
      const exported = await storageService.exportData();

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed.importantSentences).toEqual(['test1', 'test2']);
      expect(parsed.userPreferences.autoPlaySpeed).toBe('slow');
      expect(parsed.exportDate).toBeDefined();
    });

    it('should import data from JSON string', async () => {
      const importData: CompleteStoredData = {
        version: '1.0.0',
        progress: {} as Record<Grade, LearningProgress>,
        importantSentences: ['imported1', 'imported2'],
        sentences: {} as any,
        userPreferences: {
          autoPlaySpeed: 'fast',
          ttsVoiceIndex: 2,
          soundEnabled: false,
          animationsEnabled: true
        },
        studiedSentences: {} as Record<Grade, string[]>,
        streakData: {
          currentStreak: 7,
          lastStudyDate: '2024-01-20',
          longestStreak: 15
        }
      };

      const jsonData = JSON.stringify(importData);
      const success = await storageService.importData(jsonData);

      expect(success).toBe(true);

      const loaded = await storageService.loadCompleteData();
      expect(loaded!.importantSentences).toEqual(['imported1', 'imported2']);
      expect(loaded!.userPreferences.autoPlaySpeed).toBe('fast');
      expect(loaded!.streakData.currentStreak).toBe(7);
    });

    it('should handle invalid JSON during import', async () => {
      const success = await storageService.importData('invalid json');
      expect(success).toBe(false);
    });

    it('should validate imported data structure', async () => {
      const invalidData = {
        version: '1.0.0'
        // Missing required fields
      };

      const success = await storageService.importData(JSON.stringify(invalidData));
      expect(success).toBe(false);
    });
  });

  describe('Storage Information', () => {
    it('should calculate storage information', async () => {
      const testData: Partial<CompleteStoredData> = {
        importantSentences: ['test1', 'test2'],
        userPreferences: {
          autoPlaySpeed: 'normal',
          ttsVoiceIndex: 0,
          soundEnabled: true,
          animationsEnabled: true
        }
      };

      await storageService.saveCompleteData(testData);
      const info = await storageService.getStorageInfo();

      expect(info.totalSize).toBeGreaterThan(0);
      expect(info.itemCount).toBeGreaterThan(0);
    });

    it('should handle storage info calculation errors', async () => {
      // Simulate storage error
      (localStorageMock as any)['__storage_error__'] = true;

      const info = await storageService.getStorageInfo();

      expect(info.totalSize).toBe(0);
      expect(info.itemCount).toBe(0);
      expect(info.lastModified).toBeNull();
    });
  });

  describe('Data Cleanup and Management', () => {
    it('should clear all data', async () => {
      // Add some test data
      await storageService.saveCompleteData({
        importantSentences: ['test1'],
        userPreferences: {
          autoPlaySpeed: 'fast',
          ttsVoiceIndex: 1,
          soundEnabled: true,
          animationsEnabled: true
        }
      });

      await storageService.clearAllData();

      const loaded = await storageService.loadCompleteData();
      expect(loaded).toBeNull();

      const preferences = await storageService.loadUserPreferences();
      expect(preferences.autoPlaySpeed).toBe('normal'); // Should return defaults
    });

    it('should handle quota exceeded errors with cleanup', async () => {
      // First simulate quota exceeded, then allow success
      let callCount = 0;
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem.mockImplementation((key: string, value: string) => {
        callCount++;
        if (callCount === 1) {
          const error = new Error('Storage quota exceeded');
          (error as any).code = 22;
          throw error;
        }
        // Second call should succeed
        return originalSetItem(key, value);
      });

      const preferences: UserPreferences = {
        autoPlaySpeed: 'slow',
        ttsVoiceIndex: 1,
        soundEnabled: true,
        animationsEnabled: false
      };

      // Should not throw an error and should retry after cleanup
      await expect(storageService.saveUserPreferences(preferences)).resolves.toBeUndefined();
      expect(callCount).toBe(2); // First call fails, second succeeds
    });
  });

  describe('Backup and Restore', () => {
    it('should create and list backups', async () => {
      const testData: Partial<CompleteStoredData> = {
        importantSentences: ['backup-test'],
        userPreferences: {
          autoPlaySpeed: 'normal',
          ttsVoiceIndex: 0,
          soundEnabled: true,
          animationsEnabled: true
        }
      };

      await storageService.saveCompleteData(testData);
      const backupKey = await storageService.createBackup();

      expect(backupKey).toBeTruthy();
      expect(backupKey.startsWith('english-card-learning-backup-')).toBe(true);

      const backups = await storageService.listBackups();
      expect(backups.length).toBe(1);
      expect(backups[0].key).toBe(backupKey);
      expect(backups[0].size).toBeGreaterThan(0);
    });

    it('should restore from backup', async () => {
      const originalData: Partial<CompleteStoredData> = {
        importantSentences: ['original'],
        userPreferences: {
          autoPlaySpeed: 'fast',
          ttsVoiceIndex: 1,
          soundEnabled: true,
          animationsEnabled: true
        }
      };

      await storageService.saveCompleteData(originalData);
      const backupKey = await storageService.createBackup();

      // Change data
      await storageService.saveCompleteData({
        importantSentences: ['changed'],
        userPreferences: {
          autoPlaySpeed: 'slow',
          ttsVoiceIndex: 0,
          soundEnabled: false,
          animationsEnabled: false
        }
      });

      // Restore from backup
      const success = await storageService.restoreFromBackup(backupKey);
      expect(success).toBe(true);

      const restored = await storageService.loadCompleteData();
      expect(restored!.importantSentences).toEqual(['original']);
      expect(restored!.userPreferences.autoPlaySpeed).toBe('fast');
    });

    it('should handle restore from non-existent backup', async () => {
      const success = await storageService.restoreFromBackup('non-existent-backup');
      expect(success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage not available', async () => {
      // Simulate localStorage not available
      (localStorageMock as any)['__not_available__'] = true;

      const preferences = await storageService.loadUserPreferences();
      expect(preferences.autoPlaySpeed).toBe('normal'); // Should return defaults
    });

    it('should handle JSON parsing errors', async () => {
      // Set invalid JSON data directly in the mock store
      (localStorageMock as any).store = { 'english-card-learning-data': 'invalid json' };

      const data = await storageService.loadCompleteData();
      expect(data).toBeNull();
    });

    it('should handle storage write errors', async () => {
      // Simulate write error
      (localStorageMock as any)['__write_error__'] = true;

      // Should not throw an error
      await expect(storageService.saveCompleteData({})).resolves.toBeUndefined();
    });
  });
});