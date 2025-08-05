/**
 * PWA 기능을 위한 React 훅들
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  pwaInstallManager, 
  networkManager, 
  cacheManager,
  isPWASupported,
  getServiceWorkerStatus,
  checkForUpdates
} from '../utils/pwaUtils';

/**
 * PWA 설치 관련 훅
 */
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaInstallManager.onInstallableChange((installable) => {
      setCanInstall(installable);
    });

    setIsInstalled(pwaInstallManager.installed);

    return unsubscribe;
  }, []);

  const promptInstall = useCallback(async () => {
    if (!canInstall) return false;

    setIsInstalling(true);
    try {
      const result = await pwaInstallManager.promptInstall();
      if (result) {
        setIsInstalled(true);
        setCanInstall(false);
      }
      return result;
    } finally {
      setIsInstalling(false);
    }
  }, [canInstall]);

  return {
    canInstall,
    isInstalled,
    isInstalling,
    promptInstall,
    isSupported: isPWASupported()
  };
};

/**
 * 네트워크 상태 관련 훅
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'fast' | 'slow' | 'offline'>('fast');

  useEffect(() => {
    const unsubscribe = networkManager.onNetworkChange((online) => {
      setIsOnline(online);
      if (!online) {
        setConnectionQuality('offline');
      }
    });

    return unsubscribe;
  }, []);

  const testConnection = useCallback(async () => {
    const quality = await networkManager.testConnection();
    setConnectionQuality(quality);
    return quality;
  }, []);

  return {
    isOnline,
    connectionQuality,
    testConnection
  };
};

/**
 * 캐시 관리 관련 훅
 */
export const useCache = () => {
  const [cacheSize, setCacheSize] = useState(0);
  const [isClearing, setIsClearing] = useState(false);

  const updateCacheSize = useCallback(async () => {
    const size = await cacheManager.getCacheSize();
    setCacheSize(size);
  }, []);

  const clearCache = useCallback(async () => {
    setIsClearing(true);
    try {
      const success = await cacheManager.clearCache();
      if (success) {
        setCacheSize(0);
      }
      return success;
    } finally {
      setIsClearing(false);
    }
  }, []);

  const removeFromCache = useCallback(async (url: string) => {
    const success = await cacheManager.removeFromCache(url);
    if (success) {
      await updateCacheSize();
    }
    return success;
  }, [updateCacheSize]);

  useEffect(() => {
    updateCacheSize();
  }, [updateCacheSize]);

  return {
    cacheSize,
    isClearing,
    clearCache,
    removeFromCache,
    updateCacheSize,
    formatSize: (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  };
};

/**
 * Service Worker 상태 관련 훅
 */
export const useServiceWorker = () => {
  const [status, setStatus] = useState(getServiceWorkerStatus());
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleControllerChange = () => {
      setStatus(getServiceWorkerStatus());
    };

    const handleUpdateFound = () => {
      setHasUpdate(true);
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    
    // Service Worker 등록 상태 확인
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.addEventListener('updatefound', handleUpdateFound);
        
        if (registration.waiting) {
          setHasUpdate(true);
        }
      }
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const updateApp = useCallback(async () => {
    if (!hasUpdate) return false;

    setIsUpdating(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
        return true;
      }
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [hasUpdate]);

  const checkForAppUpdates = useCallback(async () => {
    const hasUpdates = await checkForUpdates();
    if (hasUpdates) {
      setHasUpdate(true);
    }
    return hasUpdates;
  }, []);

  return {
    status,
    hasUpdate,
    isUpdating,
    updateApp,
    checkForAppUpdates,
    isSupported: 'serviceWorker' in navigator
  };
};

/**
 * PWA 전체 상태를 관리하는 통합 훅
 */
export const usePWA = () => {
  const install = usePWAInstall();
  const network = useNetworkStatus();
  const cache = useCache();
  const serviceWorker = useServiceWorker();

  return {
    install,
    network,
    cache,
    serviceWorker,
    isSupported: isPWASupported()
  };
};