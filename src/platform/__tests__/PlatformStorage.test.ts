/**
 * 플랫폼 스토리지 테스트
 */

import { PlatformStorage, StorageUtils, createPlatformStorage } from '../services/PlatformStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('PlatformStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve items', async () => {
      await PlatformStorage.setItem('test-key', 'test-value');
      const value = await PlatformStorage.getItem('test-key');
      
      expect(value).toBe('test-value');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent items', async () => {
      const value = await PlatformStorage.getItem('non-existent');
      expect(value).toBeNull();
    });

    it('should remove items', async () => {
      await PlatformStorage.setItem('test-key', 'test-value');
      await PlatformStorage.removeItem('test-key');
      const value = await PlatformStorage.getItem('test-key');
      
      expect(value).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should clear all items', async () => {
      await PlatformStorage.setItem('key1', 'value1');
      await PlatformStorage.setItem('key2', 'value2');
      await PlatformStorage.clear();
      
      const value1 = await PlatformStorage.getItem('key1');
      const value2 = await PlatformStorage.getItem('key2');
      
      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
  });

  describe('Batch Operations', () => {
    it('should get all keys', async () => {
      await PlatformStorage.setItem('key1', 'value1');
      await PlatformStorage.setItem('key2', 'value2');
      
      const keys = await PlatformStorage.getAllKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    it('should perform multiGet operation', async () => {
      await PlatformStorage.setItem('key1', 'value1');
      await PlatformStorage.setItem('key2', 'value2');
      
      const results = await PlatformStorage.multiGet(['key1', 'key2', 'key3']);
      
      expect(results).toEqual([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', null]
      ]);
    });

    it('should perform multiSet operation', async () => {
      await PlatformStorage.multiSet([
        ['key1', 'value1'],
        ['key2', 'value2']
      ]);
      
      const value1 = await PlatformStorage.getItem('key1');
      const value2 = await PlatformStorage.getItem('key2');
      
      expect(value1).toBe('value1');
      expect(value2).toBe('value2');
    });

    it('should perform multiRemove operation', async () => {
      await PlatformStorage.setItem('key1', 'value1');
      await PlatformStorage.setItem('key2', 'value2');
      await PlatformStorage.setItem('key3', 'value3');
      
      await PlatformStorage.multiRemove(['key1', 'key2']);
      
      const value1 = await PlatformStorage.getItem('key1');
      const value2 = await PlatformStorage.getItem('key2');
      const value3 = await PlatformStorage.getItem('key3');
      
      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toBe('value3');
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      // Mock storage error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      await expect(PlatformStorage.setItem('key', 'value')).rejects.toThrow();
    });

    it('should return null on getItem error', async () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const value = await PlatformStorage.getItem('key');
      expect(value).toBeNull();
    });
  });
});

describe('StorageUtils', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Object Storage', () => {
    it('should store and retrieve objects', async () => {
      const testObject = { name: 'test', value: 123, nested: { prop: true } };
      
      await StorageUtils.setObject('test-object', testObject);
      const retrieved = await StorageUtils.getObject('test-object');
      
      expect(retrieved).toEqual(testObject);
    });

    it('should return null for non-existent objects', async () => {
      const result = await StorageUtils.getObject('non-existent');
      expect(result).toBeNull();
    });

    it('should return default value when object not found', async () => {
      const defaultValue = { default: true };
      const result = await StorageUtils.getObjectWithDefault('non-existent', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('should handle JSON parsing errors', async () => {
      // Manually set invalid JSON
      localStorageMock.setItem('invalid-json', 'invalid json string');
      
      const result = await StorageUtils.getObject('invalid-json');
      expect(result).toBeNull();
    });
  });

  describe('Pattern Operations', () => {
    beforeEach(async () => {
      await PlatformStorage.setItem('user:1', 'user1');
      await PlatformStorage.setItem('user:2', 'user2');
      await PlatformStorage.setItem('settings:theme', 'dark');
      await PlatformStorage.setItem('settings:lang', 'ko');
      await PlatformStorage.setItem('cache:data', 'cached');
    });

    it('should find keys by pattern', async () => {
      const userKeys = await StorageUtils.getKeysByPattern(/^user:/);
      const settingsKeys = await StorageUtils.getKeysByPattern(/^settings:/);
      
      expect(userKeys).toContain('user:1');
      expect(userKeys).toContain('user:2');
      expect(userKeys).not.toContain('settings:theme');
      
      expect(settingsKeys).toContain('settings:theme');
      expect(settingsKeys).toContain('settings:lang');
      expect(settingsKeys).not.toContain('user:1');
    });

    it('should remove keys by pattern', async () => {
      await StorageUtils.removeByPattern(/^user:/);
      
      const user1 = await PlatformStorage.getItem('user:1');
      const user2 = await PlatformStorage.getItem('user:2');
      const theme = await PlatformStorage.getItem('settings:theme');
      
      expect(user1).toBeNull();
      expect(user2).toBeNull();
      expect(theme).toBe('dark'); // Should remain
    });
  });

  describe('Backup and Restore', () => {
    beforeEach(async () => {
      await PlatformStorage.setItem('key1', 'value1');
      await PlatformStorage.setItem('key2', 'value2');
      await PlatformStorage.setItem('key3', 'value3');
    });

    it('should create backup', async () => {
      const backup = await StorageUtils.backup();
      
      expect(backup).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      });
    });

    it('should restore from backup', async () => {
      await PlatformStorage.clear();
      
      const backup = {
        restored1: 'value1',
        restored2: 'value2'
      };
      
      await StorageUtils.restore(backup);
      
      const value1 = await PlatformStorage.getItem('restored1');
      const value2 = await PlatformStorage.getItem('restored2');
      
      expect(value1).toBe('value1');
      expect(value2).toBe('value2');
    });
  });

  describe('Storage Size', () => {
    it('should calculate storage size', async () => {
      await PlatformStorage.setItem('small', 'x');
      await PlatformStorage.setItem('medium', 'x'.repeat(100));
      await PlatformStorage.setItem('large', 'x'.repeat(1000));
      
      const size = await StorageUtils.getStorageSize();
      expect(size).toBeGreaterThan(0);
    });
  });
});

describe('Platform Storage Factory', () => {
  it('should create appropriate storage for platform', () => {
    const storage = createPlatformStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.getItem).toBe('function');
    expect(typeof storage.setItem).toBe('function');
  });
});