// Storage Service implementation for localStorage data persistence
import type { Grade, LearningProgress, PlaybackSpeed, Sentence } from '../types';

// Storage keys
const STORAGE_KEYS = {
  MAIN_DATA: 'english-card-learning-data',
  PROGRESS: 'english-card-learning-progress',
  USER_PREFERENCES: 'english-card-learning-preferences',
  VERSION: 'english-card-learning-version'
} as const;

// Current data version for migration purposes
const CURRENT_VERSION = '1.0.0';

// User preferences interface
export interface UserPreferences {
  autoPlaySpeed: PlaybackSpeed;
  ttsVoiceIndex: number;
  theme?: 'light' | 'dark';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

// Complete storage data structure
export interface CompleteStoredData {
  version: string;
  progress: Record<Grade, LearningProgress>;
  importantSentences: string[];
  sentences: Record<Grade, Sentence[]>;
  userPreferences: UserPreferences;
  studiedSentences: Record<Grade, string[]>;
  streakData: {
    currentStreak: number;
    lastStudyDate: string | null;
    longestStreak: number;
  };
  lastBackupDate?: string;
}

export interface StorageService {
  // Data persistence
  saveCompleteData(data: Partial<CompleteStoredData>): Promise<void>;
  loadCompleteData(): Promise<CompleteStoredData | null>;
  
  // Progress data
  saveProgress(progress: Record<Grade, LearningProgress>): Promise<void>;
  loadProgress(): Promise<Record<Grade, LearningProgress> | null>;
  
  // Important sentences
  saveImportantSentences(sentenceIds: string[]): Promise<void>;
  loadImportantSentences(): Promise<string[]>;
  
  // User preferences
  saveUserPreferences(preferences: UserPreferences): Promise<void>;
  loadUserPreferences(): Promise<UserPreferences>;
  
  // Sentence data with study counts
  saveSentenceData(sentences: Record<Grade, Sentence[]>): Promise<void>;
  loadSentenceData(): Promise<Record<Grade, Sentence[]> | null>;
  
  // Utility methods
  clearAllData(): Promise<void>;
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<boolean>;
  getStorageInfo(): Promise<{
    totalSize: number;
    itemCount: number;
    lastModified: Date | null;
  }>;
}

export class StorageServiceImpl implements StorageService {
  private defaultPreferences: UserPreferences = {
    autoPlaySpeed: 'normal',
    ttsVoiceIndex: 0,
    soundEnabled: true,
    animationsEnabled: true
  };

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage and perform migration if needed
   */
  private async initializeStorage(): Promise<void> {
    try {
      const currentVersion = await this.getStorageVersion();
      if (currentVersion !== CURRENT_VERSION) {
        await this.migrateData(currentVersion, CURRENT_VERSION);
        await this.setStorageVersion(CURRENT_VERSION);
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Get current storage version
   */
  private async getStorageVersion(): Promise<string> {
    try {
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      return version || '0.0.0';
    } catch (error) {
      console.error('Error getting storage version:', error);
      return '0.0.0';
    }
  }

  /**
   * Set storage version
   */
  private async setStorageVersion(version: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, version);
    } catch (error) {
      console.error('Error setting storage version:', error);
    }
  }

  /**
   * Migrate data between versions
   */
  private async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);
    
    try {
      // Migration logic based on version differences
      if (fromVersion === '0.0.0') {
        // First time setup - no migration needed
        return;
      }

      // Add specific migration logic here for future versions
      // For example:
      // if (fromVersion < '1.1.0') {
      //   await this.migrateToV1_1_0();
      // }
      
    } catch (error) {
      console.error('Error during data migration:', error);
      throw error;
    }
  }

  /**
   * Safe localStorage operation with error handling
   */
  private async safeStorageOperation<T>(
    operation: () => T,
    fallback: T,
    operationName: string
  ): Promise<T> {
    try {
      return operation();
    } catch (error) {
      console.error(`Error in ${operationName}:`, error);
      
      // Check if it's a quota exceeded error
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage quota exceeded, attempting cleanup');
        await this.cleanupOldData();
        
        // Retry the operation once
        try {
          return operation();
        } catch (retryError) {
          console.error(`Retry failed for ${operationName}:`, retryError);
          return fallback;
        }
      }
      
      return fallback;
    }
  }

  /**
   * Clean up old or unnecessary data to free space
   */
  private async cleanupOldData(): Promise<void> {
    try {
      // Remove any old backup data or temporary keys
      const keysToCheck = Object.keys(localStorage);
      const oldKeys = keysToCheck.filter(key => 
        key.startsWith('english-card-learning-') && 
        key.includes('backup') || 
        key.includes('temp')
      );
      
      oldKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove old key ${key}:`, error);
        }
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Save complete data structure
   * Requirements: 4.1, 6.1, 6.3
   */
  async saveCompleteData(data: Partial<CompleteStoredData>): Promise<void> {
    const completeData: CompleteStoredData = {
      version: CURRENT_VERSION,
      progress: data.progress || {} as Record<Grade, LearningProgress>,
      importantSentences: data.importantSentences || [],
      sentences: data.sentences || {} as Record<Grade, Sentence[]>,
      userPreferences: { ...this.defaultPreferences, ...data.userPreferences },
      studiedSentences: data.studiedSentences || {} as Record<Grade, string[]>,
      streakData: data.streakData || {
        currentStreak: 0,
        lastStudyDate: null,
        longestStreak: 0
      },
      lastBackupDate: new Date().toISOString()
    };

    await this.safeStorageOperation(
      () => {
        localStorage.setItem(STORAGE_KEYS.MAIN_DATA, JSON.stringify(completeData));
      },
      undefined,
      'saveCompleteData'
    );
  }

  /**
   * Load complete data structure
   * Requirements: 4.1, 6.1, 6.3
   */
  async loadCompleteData(): Promise<CompleteStoredData | null> {
    return this.safeStorageOperation(
      () => {
        const dataStr = localStorage.getItem(STORAGE_KEYS.MAIN_DATA);
        if (!dataStr) return null;
        
        const data = JSON.parse(dataStr) as CompleteStoredData;
        
        // Validate and provide defaults for missing fields
        return {
          version: data.version || CURRENT_VERSION,
          progress: data.progress || {},
          importantSentences: data.importantSentences || [],
          sentences: data.sentences || {} as Record<Grade, Sentence[]>,
          userPreferences: { ...this.defaultPreferences, ...data.userPreferences },
          studiedSentences: data.studiedSentences || {} as Record<Grade, string[]>,
          streakData: data.streakData || {
            currentStreak: 0,
            lastStudyDate: null,
            longestStreak: 0
          },
          lastBackupDate: data.lastBackupDate
        };
      },
      null,
      'loadCompleteData'
    );
  }

  /**
   * Save progress data
   * Requirements: 6.1, 6.3
   */
  async saveProgress(progress: Record<Grade, LearningProgress>): Promise<void> {
    await this.safeStorageOperation(
      () => {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      },
      undefined,
      'saveProgress'
    );
  }

  /**
   * Load progress data
   * Requirements: 6.1, 6.3
   */
  async loadProgress(): Promise<Record<Grade, LearningProgress> | null> {
    return this.safeStorageOperation(
      () => {
        const progressStr = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return progressStr ? JSON.parse(progressStr) : null;
      },
      null,
      'loadProgress'
    );
  }

  /**
   * Save important sentences
   * Requirements: 4.1
   */
  async saveImportantSentences(sentenceIds: string[]): Promise<void> {
    await this.safeStorageOperation(
      () => {
        const data = { importantSentences: sentenceIds, lastUpdated: new Date().toISOString() };
        localStorage.setItem('english-card-learning-important', JSON.stringify(data));
      },
      undefined,
      'saveImportantSentences'
    );
  }

  /**
   * Load important sentences
   * Requirements: 4.1
   */
  async loadImportantSentences(): Promise<string[]> {
    return this.safeStorageOperation(
      () => {
        const dataStr = localStorage.getItem('english-card-learning-important');
        if (!dataStr) return [];
        
        const data = JSON.parse(dataStr);
        return Array.isArray(data.importantSentences) ? data.importantSentences : [];
      },
      [],
      'loadImportantSentences'
    );
  }

  /**
   * Save user preferences
   * Requirements: Auto play speed and other user settings
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    const preferencesToSave = {
      ...this.defaultPreferences,
      ...preferences,
      lastUpdated: new Date().toISOString()
    };

    await this.safeStorageOperation(
      () => {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferencesToSave));
      },
      undefined,
      'saveUserPreferences'
    );
  }

  /**
   * Load user preferences
   * Requirements: Auto play speed and other user settings
   */
  async loadUserPreferences(): Promise<UserPreferences> {
    return this.safeStorageOperation(
      () => {
        const prefsStr = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (!prefsStr) return this.defaultPreferences;
        
        const storedPrefs = JSON.parse(prefsStr);
        return { ...this.defaultPreferences, ...storedPrefs };
      },
      this.defaultPreferences,
      'loadUserPreferences'
    );
  }

  /**
   * Save sentence data with study counts
   * Requirements: 6.3
   */
  async saveSentenceData(sentences: Record<Grade, Sentence[]>): Promise<void> {
    await this.safeStorageOperation(
      () => {
        const dataToSave = {
          sentences,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('english-card-learning-sentences', JSON.stringify(dataToSave));
      },
      undefined,
      'saveSentenceData'
    );
  }

  /**
   * Load sentence data with study counts
   * Requirements: 6.3
   */
  async loadSentenceData(): Promise<Record<Grade, Sentence[]> | null> {
    return this.safeStorageOperation(
      () => {
        const dataStr = localStorage.getItem('english-card-learning-sentences');
        if (!dataStr) return null;
        
        const data = JSON.parse(dataStr);
        return data.sentences || null;
      },
      null,
      'loadSentenceData'
    );
  }

  /**
   * Clear all stored data
   */
  async clearAllData(): Promise<void> {
    await this.safeStorageOperation(
      () => {
        // Remove all app-related keys
        const keysToRemove = Object.values(STORAGE_KEYS);
        const additionalKeys = [
          'english-card-learning-important',
          'english-card-learning-sentences'
        ];
        
        [...keysToRemove, ...additionalKeys].forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.warn(`Failed to remove key ${key}:`, error);
          }
        });
      },
      undefined,
      'clearAllData'
    );
  }

  /**
   * Export all data as JSON string
   */
  async exportData(): Promise<string> {
    return this.safeStorageOperation(
      async () => {
        const completeData = await this.loadCompleteData();
        const exportData = {
          ...completeData,
          exportDate: new Date().toISOString(),
          appVersion: CURRENT_VERSION
        };
        
        return JSON.stringify(exportData, null, 2);
      },
      Promise.resolve('{}'),
      'exportData'
    );
  }

  /**
   * Import data from JSON string
   */
  async importData(jsonData: string): Promise<boolean> {
    return this.safeStorageOperation(
      async () => {
        try {
          const importedData = JSON.parse(jsonData) as CompleteStoredData;
          
          // Validate the imported data structure
          if (!this.validateImportedData(importedData)) {
            console.error('Invalid data structure in import');
            return false;
          }
          
          // Save the imported data
          await this.saveCompleteData(importedData);
          
          return true;
        } catch (error) {
          console.error('Error parsing imported data:', error);
          return false;
        }
      },
      Promise.resolve(false),
      'importData'
    );
  }

  /**
   * Validate imported data structure
   */
  private validateImportedData(data: any): data is CompleteStoredData {
    if (!data || typeof data !== 'object') return false;
    
    // Check required fields exist
    const requiredFields = ['progress', 'importantSentences', 'userPreferences'];
    return requiredFields.every(field => field in data);
  }

  /**
   * Get storage information
   */
  async getStorageInfo(): Promise<{
    totalSize: number;
    itemCount: number;
    lastModified: Date | null;
  }> {
    return this.safeStorageOperation(
      () => {
        let totalSize = 0;
        let itemCount = 0;
        let lastModified: Date | null = null;

        // Calculate size of all app-related localStorage items
        const appKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('english-card-learning-')
        );

        appKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              totalSize += new Blob([value]).size;
              itemCount++;
              
              // Try to extract last modified date from stored data
              try {
                const parsed = JSON.parse(value);
                if (parsed.lastUpdated || parsed.lastBackupDate) {
                  const date = new Date(parsed.lastUpdated || parsed.lastBackupDate);
                  if (!lastModified || date > lastModified) {
                    lastModified = date;
                  }
                }
              } catch {
                // Ignore parsing errors for date extraction
              }
            }
          } catch (error) {
            console.warn(`Error calculating size for key ${key}:`, error);
          }
        });

        return { totalSize, itemCount, lastModified };
      },
      { totalSize: 0, itemCount: 0, lastModified: null },
      'getStorageInfo'
    );
  }

  /**
   * Create a backup of current data
   */
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupKey = `english-card-learning-backup-${timestamp}`;
    
    return this.safeStorageOperation(
      async () => {
        const completeData = await this.loadCompleteData();
        const backupData = {
          ...completeData,
          backupDate: new Date().toISOString()
        };
        
        localStorage.setItem(backupKey, JSON.stringify(backupData));
        return backupKey;
      },
      Promise.resolve(''),
      'createBackup'
    );
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<Array<{ key: string; date: Date; size: number }>> {
    return this.safeStorageOperation(
      () => {
        const backups: Array<{ key: string; date: Date; size: number }> = [];
        
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('english-card-learning-backup-')) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                const data = JSON.parse(value);
                backups.push({
                  key,
                  date: new Date(data.backupDate || key.split('-').pop()?.replace(/-/g, ':')),
                  size: new Blob([value]).size
                });
              }
            } catch (error) {
              console.warn(`Error processing backup ${key}:`, error);
            }
          }
        });
        
        return backups.sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      [],
      'listBackups'
    );
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupKey: string): Promise<boolean> {
    return this.safeStorageOperation(
      async () => {
        const backupData = localStorage.getItem(backupKey);
        if (!backupData) return false;
        
        const data = JSON.parse(backupData);
        await this.saveCompleteData(data);
        
        return true;
      },
      Promise.resolve(false),
      'restoreFromBackup'
    );
  }
}

// Create and export singleton instance
export const storageService = new StorageServiceImpl();