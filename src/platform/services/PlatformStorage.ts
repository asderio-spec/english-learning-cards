/**
 * 플랫폼별 스토리지 서비스 추상화
 */

import { Platform } from '../index';

export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet(keys: string[]): Promise<Array<[string, string | null]>>;
  multiSet(keyValuePairs: Array<[string, string]>): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
}

/**
 * 웹 스토리지 구현
 */
class WebStorage implements StorageInterface {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error('WebStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error('WebStorage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('WebStorage removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('WebStorage clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('WebStorage getAllKeys error:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return keys.map(key => [key, this.storage.getItem(key)]);
    } catch (error) {
      console.error('WebStorage multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      keyValuePairs.forEach(([key, value]) => {
        this.storage.setItem(key, value);
      });
    } catch (error) {
      console.error('WebStorage multiSet error:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      keys.forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      console.error('WebStorage multiRemove error:', error);
      throw error;
    }
  }
}

/**
 * React Native AsyncStorage 구현
 */
class NativeStorage implements StorageInterface {
  private asyncStorage: any;

  constructor() {
    try {
      this.asyncStorage = require('@react-native-async-storage/async-storage').default;
    } catch (error) {
      console.warn('AsyncStorage not available, falling back to memory storage');
      this.asyncStorage = new MemoryStorage();
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.asyncStorage.getItem(key);
    } catch (error) {
      console.error('NativeStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.asyncStorage.setItem(key, value);
    } catch (error) {
      console.error('NativeStorage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.asyncStorage.removeItem(key);
    } catch (error) {
      console.error('NativeStorage removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.asyncStorage.clear();
    } catch (error) {
      console.error('NativeStorage clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await this.asyncStorage.getAllKeys();
    } catch (error) {
      console.error('NativeStorage getAllKeys error:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return await this.asyncStorage.multiGet(keys);
    } catch (error) {
      console.error('NativeStorage multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await this.asyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('NativeStorage multiSet error:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await this.asyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('NativeStorage multiRemove error:', error);
      throw error;
    }
  }
}

/**
 * 메모리 스토리지 (fallback)
 */
class MemoryStorage implements StorageInterface {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    return keys.map(key => [key, this.storage.get(key) || null]);
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    keyValuePairs.forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }

  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach(key => {
      this.storage.delete(key);
    });
  }
}

/**
 * 플랫폼별 스토리지 팩토리
 */
export const createPlatformStorage = (): StorageInterface => {
  if (Platform.isWeb) {
    return new WebStorage();
  } else {
    return new NativeStorage();
  }
};

/**
 * 기본 스토리지 인스턴스
 */
export const PlatformStorage = createPlatformStorage();

/**
 * 세션 스토리지 (웹에서만 사용)
 */
export const PlatformSessionStorage = Platform.isWeb 
  ? new WebStorage(sessionStorage) 
  : PlatformStorage;

/**
 * 스토리지 유틸리티 함수들
 */
export const StorageUtils = {
  /**
   * JSON 객체 저장
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await PlatformStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('StorageUtils setObject error:', error);
      throw error;
    }
  },

  /**
   * JSON 객체 불러오기
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await PlatformStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('StorageUtils getObject error:', error);
      return null;
    }
  },

  /**
   * 기본값과 함께 객체 불러오기
   */
  async getObjectWithDefault<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await this.getObject<T>(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error('StorageUtils getObjectWithDefault error:', error);
      return defaultValue;
    }
  },

  /**
   * 스토리지 크기 계산 (웹에서만 정확)
   */
  async getStorageSize(): Promise<number> {
    if (Platform.isWeb) {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } else {
      // React Native에서는 정확한 크기 계산이 어려움
      const keys = await PlatformStorage.getAllKeys();
      const items = await PlatformStorage.multiGet(keys);
      return items.reduce((total, [key, value]) => {
        return total + key.length + (value?.length || 0);
      }, 0);
    }
  },

  /**
   * 키 패턴으로 검색
   */
  async getKeysByPattern(pattern: RegExp): Promise<string[]> {
    const allKeys = await PlatformStorage.getAllKeys();
    return allKeys.filter(key => pattern.test(key));
  },

  /**
   * 키 패턴으로 삭제
   */
  async removeByPattern(pattern: RegExp): Promise<void> {
    const keysToRemove = await this.getKeysByPattern(pattern);
    if (keysToRemove.length > 0) {
      await PlatformStorage.multiRemove(keysToRemove);
    }
  },

  /**
   * 스토리지 백업
   */
  async backup(): Promise<Record<string, string>> {
    const keys = await PlatformStorage.getAllKeys();
    const items = await PlatformStorage.multiGet(keys);
    const backup: Record<string, string> = {};
    
    items.forEach(([key, value]) => {
      if (value !== null) {
        backup[key] = value;
      }
    });
    
    return backup;
  },

  /**
   * 스토리지 복원
   */
  async restore(backup: Record<string, string>): Promise<void> {
    const keyValuePairs: Array<[string, string]> = Object.entries(backup);
    await PlatformStorage.multiSet(keyValuePairs);
  }
};