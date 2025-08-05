/**
 * PWA 훅들의 테스트
 */

import { renderHook, act } from '@testing-library/react';
import { usePWAInstall, useNetworkStatus, useCache, useServiceWorker } from '../usePWA';

// Mock PWA utilities
jest.mock('../../utils/pwaUtils', () => ({
  pwaInstallManager: {
    onInstallableChange: jest.fn((callback) => {
      callback(true);
      return jest.fn(); // unsubscribe function
    }),
    promptInstall: jest.fn().mockResolvedValue(true),
    installed: false,
    canInstall: true
  },
  networkManager: {
    onNetworkChange: jest.fn((callback) => {
      callback(true);
      return jest.fn(); // unsubscribe function
    }),
    online: true,
    testConnection: jest.fn().mockResolvedValue('fast')
  },
  cacheManager: {
    getCacheSize: jest.fn().mockResolvedValue(1024),
    clearCache: jest.fn().mockResolvedValue(true),
    removeFromCache: jest.fn().mockResolvedValue(true)
  },
  isPWASupported: jest.fn().mockReturnValue(true),
  getServiceWorkerStatus: jest.fn().mockReturnValue('active'),
  checkForUpdates: jest.fn().mockResolvedValue(true)
}));

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true,
    serviceWorker: {
      getRegistration: jest.fn().mockResolvedValue({
        waiting: null,
        update: jest.fn().mockResolvedValue(undefined)
      }),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
  },
  writable: true
});

describe('usePWAInstall', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.canInstall).toBe(true);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isInstalling).toBe(false);
    expect(result.current.isSupported).toBe(true);
  });

  it('should handle install prompt correctly', async () => {
    const { result } = renderHook(() => usePWAInstall());

    await act(async () => {
      const success = await result.current.promptInstall();
      expect(success).toBe(true);
    });
  });

  it('should not allow install when not installable', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    // Mock canInstall as false
    result.current.canInstall = false;
    
    act(() => {
      result.current.promptInstall();
    });
    
    // Should not change installing state when not installable
    expect(result.current.isInstalling).toBe(false);
  });
});

describe('useNetworkStatus', () => {
  it('should initialize with correct network status', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.connectionQuality).toBe('fast');
  });

  it('should test connection quality', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      const quality = await result.current.testConnection();
      expect(quality).toBe('fast');
    });
  });
});

describe('useCache', () => {
  it('should initialize with cache information', async () => {
    const { result } = renderHook(() => useCache());

    // Wait for cache size to be loaded
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.cacheSize).toBe(1024);
    expect(result.current.isClearing).toBe(false);
  });

  it('should clear cache correctly', async () => {
    const { result } = renderHook(() => useCache());

    await act(async () => {
      const success = await result.current.clearCache();
      expect(success).toBe(true);
    });

    expect(result.current.cacheSize).toBe(0);
  });

  it('should format cache size correctly', () => {
    const { result } = renderHook(() => useCache());

    expect(result.current.formatSize(0)).toBe('0 B');
    expect(result.current.formatSize(1024)).toBe('1 KB');
    expect(result.current.formatSize(1048576)).toBe('1 MB');
  });

  it('should remove items from cache', async () => {
    const { result } = renderHook(() => useCache());

    await act(async () => {
      const success = await result.current.removeFromCache('/test-url');
      expect(success).toBe(true);
    });
  });
});

describe('useServiceWorker', () => {
  it('should initialize with service worker status', () => {
    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.status).toBe('active');
    expect(result.current.hasUpdate).toBe(false);
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.isSupported).toBe(true);
  });

  it('should check for updates', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      const hasUpdates = await result.current.checkForAppUpdates();
      expect(hasUpdates).toBe(true);
    });
  });

  it('should handle update when no update is available', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      const success = await result.current.updateApp();
      expect(success).toBe(false); // No update available
    });
  });
});

// Integration test for usePWA
describe('usePWA integration', () => {
  it('should provide all PWA functionality', () => {
    const { usePWA } = require('../usePWA');
    const { result } = renderHook(() => usePWA());

    expect(result.current.install).toBeDefined();
    expect(result.current.network).toBeDefined();
    expect(result.current.cache).toBeDefined();
    expect(result.current.serviceWorker).toBeDefined();
    expect(result.current.isSupported).toBe(true);
  });
});