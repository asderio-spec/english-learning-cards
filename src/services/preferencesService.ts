// User Preferences Service implementation
import type { PlaybackSpeed } from '../types';
import { storageService, type UserPreferences } from './storageService';

export interface PreferencesService {
  // Auto play preferences
  getAutoPlaySpeed(): Promise<PlaybackSpeed>;
  setAutoPlaySpeed(speed: PlaybackSpeed): Promise<void>;
  
  // TTS preferences
  getTTSVoiceIndex(): Promise<number>;
  setTTSVoiceIndex(index: number): Promise<void>;
  
  // UI preferences
  getSoundEnabled(): Promise<boolean>;
  setSoundEnabled(enabled: boolean): Promise<void>;
  
  getAnimationsEnabled(): Promise<boolean>;
  setAnimationsEnabled(enabled: boolean): Promise<void>;
  
  // Complete preferences
  getAllPreferences(): Promise<UserPreferences>;
  updatePreferences(preferences: Partial<UserPreferences>): Promise<void>;
  resetPreferences(): Promise<void>;
}

export class PreferencesServiceImpl implements PreferencesService {
  private cachedPreferences: UserPreferences | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializePreferences();
  }

  /**
   * Initialize preferences on service creation
   */
  private async initializePreferences(): Promise<void> {
    try {
      await this.loadPreferences();
    } catch (error) {
      console.error('Error initializing preferences:', error);
    }
  }

  /**
   * Load preferences with caching
   */
  private async loadPreferences(): Promise<UserPreferences> {
    const now = Date.now();
    
    // Return cached preferences if still valid
    if (this.cachedPreferences && now < this.cacheExpiry) {
      return this.cachedPreferences;
    }

    try {
      this.cachedPreferences = await storageService.loadUserPreferences();
      this.cacheExpiry = now + this.CACHE_DURATION;
      return this.cachedPreferences;
    } catch (error) {
      console.error('Error loading preferences:', error);
      
      // Return default preferences if loading fails
      const defaultPrefs: UserPreferences = {
        autoPlaySpeed: 'normal',
        ttsVoiceIndex: 0,
        soundEnabled: true,
        animationsEnabled: true
      };
      
      this.cachedPreferences = defaultPrefs;
      this.cacheExpiry = now + this.CACHE_DURATION;
      return defaultPrefs;
    }
  }

  /**
   * Save preferences and update cache
   */
  private async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await storageService.saveUserPreferences(preferences);
      this.cachedPreferences = preferences;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Get auto play speed preference
   * Requirements: Auto play speed setting persistence
   */
  async getAutoPlaySpeed(): Promise<PlaybackSpeed> {
    try {
      const preferences = await this.loadPreferences();
      return preferences.autoPlaySpeed;
    } catch (error) {
      console.error('Error getting auto play speed:', error);
      return 'normal';
    }
  }

  /**
   * Set auto play speed preference
   * Requirements: Auto play speed setting persistence
   */
  async setAutoPlaySpeed(speed: PlaybackSpeed): Promise<void> {
    try {
      const preferences = await this.loadPreferences();
      const updatedPreferences = { ...preferences, autoPlaySpeed: speed };
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error setting auto play speed:', error);
      throw error;
    }
  }

  /**
   * Get TTS voice index preference
   * Requirements: TTS voice selection persistence
   */
  async getTTSVoiceIndex(): Promise<number> {
    try {
      const preferences = await this.loadPreferences();
      return preferences.ttsVoiceIndex;
    } catch (error) {
      console.error('Error getting TTS voice index:', error);
      return 0;
    }
  }

  /**
   * Set TTS voice index preference
   * Requirements: TTS voice selection persistence
   */
  async setTTSVoiceIndex(index: number): Promise<void> {
    try {
      const preferences = await this.loadPreferences();
      const updatedPreferences = { ...preferences, ttsVoiceIndex: Math.max(0, index) };
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error setting TTS voice index:', error);
      throw error;
    }
  }

  /**
   * Get sound enabled preference
   */
  async getSoundEnabled(): Promise<boolean> {
    try {
      const preferences = await this.loadPreferences();
      return preferences.soundEnabled;
    } catch (error) {
      console.error('Error getting sound enabled preference:', error);
      return true;
    }
  }

  /**
   * Set sound enabled preference
   */
  async setSoundEnabled(enabled: boolean): Promise<void> {
    try {
      const preferences = await this.loadPreferences();
      const updatedPreferences = { ...preferences, soundEnabled: enabled };
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error setting sound enabled preference:', error);
      throw error;
    }
  }

  /**
   * Get animations enabled preference
   */
  async getAnimationsEnabled(): Promise<boolean> {
    try {
      const preferences = await this.loadPreferences();
      return preferences.animationsEnabled;
    } catch (error) {
      console.error('Error getting animations enabled preference:', error);
      return true;
    }
  }

  /**
   * Set animations enabled preference
   */
  async setAnimationsEnabled(enabled: boolean): Promise<void> {
    try {
      const preferences = await this.loadPreferences();
      const updatedPreferences = { ...preferences, animationsEnabled: enabled };
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error setting animations enabled preference:', error);
      throw error;
    }
  }

  /**
   * Get all preferences
   */
  async getAllPreferences(): Promise<UserPreferences> {
    return this.loadPreferences();
  }

  /**
   * Update multiple preferences at once
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.loadPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Reset all preferences to defaults
   */
  async resetPreferences(): Promise<void> {
    try {
      const defaultPreferences: UserPreferences = {
        autoPlaySpeed: 'normal',
        ttsVoiceIndex: 0,
        soundEnabled: true,
        animationsEnabled: true
      };
      
      await this.savePreferences(defaultPreferences);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }

  /**
   * Clear preferences cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cachedPreferences = null;
    this.cacheExpiry = 0;
  }

  /**
   * Get preferences synchronously from cache (may be stale)
   * Use this only when you need immediate access and can tolerate stale data
   */
  getCachedPreferences(): UserPreferences | null {
    return this.cachedPreferences;
  }

  /**
   * Check if preferences are cached and valid
   */
  isCacheValid(): boolean {
    return this.cachedPreferences !== null && Date.now() < this.cacheExpiry;
  }

  /**
   * Preload preferences into cache
   * Useful for performance optimization
   */
  async preloadPreferences(): Promise<void> {
    await this.loadPreferences();
  }
}

// Create and export singleton instance
export const preferencesService = new PreferencesServiceImpl();