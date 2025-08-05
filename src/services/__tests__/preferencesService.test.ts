// Preferences Service tests
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PreferencesServiceImpl, type UserPreferences } from '../preferencesService';
import type { PlaybackSpeed } from '../../types';

// Mock the storage service
const mockStorageService = {
  saveUserPreferences: vi.fn(),
  loadUserPreferences: vi.fn()
};

vi.mock('../storageService', () => ({
  storageService: mockStorageService
}));

describe('PreferencesService', () => {
  let preferencesService: PreferencesServiceImpl;

  const defaultPreferences: UserPreferences = {
    autoPlaySpeed: 'normal',
    ttsVoiceIndex: 0,
    soundEnabled: true,
    animationsEnabled: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    preferencesService = new PreferencesServiceImpl();
    
    // Setup default mock behavior
    mockStorageService.loadUserPreferences.mockResolvedValue(defaultPreferences);
    mockStorageService.saveUserPreferences.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Auto Play Speed', () => {
    it('should get auto play speed', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      const speed = await preferencesService.getAutoPlaySpeed();
      expect(speed).toBe('fast');
    });

    it('should set auto play speed', async () => {
      const newSpeed: PlaybackSpeed = 'slow';
      
      await preferencesService.setAutoPlaySpeed(newSpeed);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        autoPlaySpeed: newSpeed
      });
    });

    it('should return default speed on error', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Storage error'));

      const speed = await preferencesService.getAutoPlaySpeed();
      expect(speed).toBe('normal');
    });

    it('should handle save errors gracefully', async () => {
      mockStorageService.saveUserPreferences.mockRejectedValue(new Error('Save failed'));

      await expect(preferencesService.setAutoPlaySpeed('fast')).rejects.toThrow('Save failed');
    });
  });

  describe('TTS Voice Index', () => {
    it('should get TTS voice index', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        ttsVoiceIndex: 3
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      const index = await preferencesService.getTTSVoiceIndex();
      expect(index).toBe(3);
    });

    it('should set TTS voice index', async () => {
      const newIndex = 2;
      
      await preferencesService.setTTSVoiceIndex(newIndex);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        ttsVoiceIndex: newIndex
      });
    });

    it('should handle negative voice index', async () => {
      await preferencesService.setTTSVoiceIndex(-1);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        ttsVoiceIndex: 0 // Should be clamped to 0
      });
    });

    it('should return default index on error', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Storage error'));

      const index = await preferencesService.getTTSVoiceIndex();
      expect(index).toBe(0);
    });
  });

  describe('Sound Enabled', () => {
    it('should get sound enabled preference', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        soundEnabled: false
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      const enabled = await preferencesService.getSoundEnabled();
      expect(enabled).toBe(false);
    });

    it('should set sound enabled preference', async () => {
      await preferencesService.setSoundEnabled(false);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        soundEnabled: false
      });
    });

    it('should return default on error', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Storage error'));

      const enabled = await preferencesService.getSoundEnabled();
      expect(enabled).toBe(true);
    });
  });

  describe('Animations Enabled', () => {
    it('should get animations enabled preference', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        animationsEnabled: false
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      const enabled = await preferencesService.getAnimationsEnabled();
      expect(enabled).toBe(false);
    });

    it('should set animations enabled preference', async () => {
      await preferencesService.setAnimationsEnabled(false);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        animationsEnabled: false
      });
    });

    it('should return default on error', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Storage error'));

      const enabled = await preferencesService.getAnimationsEnabled();
      expect(enabled).toBe(true);
    });
  });

  describe('All Preferences', () => {
    it('should get all preferences', async () => {
      const testPreferences: UserPreferences = {
        autoPlaySpeed: 'fast',
        ttsVoiceIndex: 2,
        soundEnabled: false,
        animationsEnabled: true
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      const preferences = await preferencesService.getAllPreferences();
      expect(preferences).toEqual(testPreferences);
    });

    it('should update multiple preferences', async () => {
      const updates: Partial<UserPreferences> = {
        autoPlaySpeed: 'slow',
        soundEnabled: false
      };

      await preferencesService.updatePreferences(updates);

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith({
        ...defaultPreferences,
        ...updates
      });
    });

    it('should reset preferences to defaults', async () => {
      await preferencesService.resetPreferences();

      expect(mockStorageService.saveUserPreferences).toHaveBeenCalledWith(defaultPreferences);
    });
  });

  describe('Caching', () => {
    it('should cache preferences for performance', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      // First call should load from storage
      const speed1 = await preferencesService.getAutoPlaySpeed();
      expect(speed1).toBe('fast');
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const speed2 = await preferencesService.getAutoPlaySpeed();
      expect(speed2).toBe('fast');
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(1); // Still 1
    });

    it('should clear cache', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      // Load preferences to cache
      await preferencesService.getAutoPlaySpeed();
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(1);

      // Clear cache
      preferencesService.clearCache();

      // Next call should reload from storage
      await preferencesService.getAutoPlaySpeed();
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(2);
    });

    it('should check cache validity', async () => {
      expect(preferencesService.isCacheValid()).toBe(false);

      // Load preferences
      await preferencesService.getAutoPlaySpeed();
      expect(preferencesService.isCacheValid()).toBe(true);

      // Clear cache
      preferencesService.clearCache();
      expect(preferencesService.isCacheValid()).toBe(false);
    });

    it('should get cached preferences synchronously', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      // Initially no cache
      expect(preferencesService.getCachedPreferences()).toBeNull();

      // Load preferences to populate cache
      await preferencesService.getAutoPlaySpeed();

      // Now should return cached preferences
      const cached = preferencesService.getCachedPreferences();
      expect(cached).toEqual(testPreferences);
    });

    it('should preload preferences', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      await preferencesService.preloadPreferences();

      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(1);
      expect(preferencesService.isCacheValid()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle storage load errors', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Load failed'));

      const preferences = await preferencesService.getAllPreferences();
      expect(preferences).toEqual(defaultPreferences);
    });

    it('should handle storage save errors', async () => {
      mockStorageService.saveUserPreferences.mockRejectedValue(new Error('Save failed'));

      await expect(preferencesService.setAutoPlaySpeed('fast')).rejects.toThrow('Save failed');
    });

    it('should handle update preferences errors', async () => {
      mockStorageService.loadUserPreferences.mockRejectedValue(new Error('Load failed'));
      mockStorageService.saveUserPreferences.mockRejectedValue(new Error('Save failed'));

      await expect(preferencesService.updatePreferences({ autoPlaySpeed: 'fast' }))
        .rejects.toThrow('Save failed');
    });

    it('should handle reset preferences errors', async () => {
      mockStorageService.saveUserPreferences.mockRejectedValue(new Error('Save failed'));

      await expect(preferencesService.resetPreferences()).rejects.toThrow('Save failed');
    });
  });

  describe('Cache Expiry', () => {
    it('should expire cache after timeout', async () => {
      const testPreferences: UserPreferences = {
        ...defaultPreferences,
        autoPlaySpeed: 'fast'
      };
      mockStorageService.loadUserPreferences.mockResolvedValue(testPreferences);

      // Create service with very short cache duration for testing
      const shortCacheService = new PreferencesServiceImpl();
      
      // Mock the cache duration to be very short
      (shortCacheService as any).CACHE_DURATION = 1; // 1ms

      // Load preferences
      await shortCacheService.getAutoPlaySpeed();
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 2));

      // Next call should reload from storage
      await shortCacheService.getAutoPlaySpeed();
      expect(mockStorageService.loadUserPreferences).toHaveBeenCalledTimes(2);
    });
  });
});