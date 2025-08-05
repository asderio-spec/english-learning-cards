/**
 * PWA 유틸리티 함수들
 * 설치 프롬프트, 오프라인 감지, 캐시 관리 등을 제공합니다.
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

/**
 * PWA 설치 관련 상태 관리
 */
export class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstallable = false;
  private isInstalled = false;
  private listeners: Array<(installable: boolean) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // 설치 프롬프트 이벤트 리스너
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      this.notifyListeners();
    });

    // 앱 설치 완료 이벤트 리스너
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.deferredPrompt = null;
      this.notifyListeners();
    });

    // 이미 설치된 상태인지 확인
    this.checkIfInstalled();
  }

  private checkIfInstalled() {
    // PWA가 이미 설치되어 있는지 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isInstallable));
  }

  /**
   * 설치 가능 상태 변경 리스너 등록
   */
  onInstallableChange(callback: (installable: boolean) => void) {
    this.listeners.push(callback);
    // 현재 상태를 즉시 알림
    callback(this.isInstallable);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * PWA 설치 프롬프트 표시
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      this.deferredPrompt = null;
      this.isInstallable = false;
      this.notifyListeners();
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA 설치 프롬프트 오류:', error);
      return false;
    }
  }

  /**
   * 설치 가능 여부 확인
   */
  get canInstall(): boolean {
    return this.isInstallable && !this.isInstalled;
  }

  /**
   * 설치 완료 여부 확인
   */
  get installed(): boolean {
    return this.isInstalled;
  }
}

/**
 * 네트워크 상태 관리
 */
export class NetworkManager {
  private isOnline = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  /**
   * 네트워크 상태 변경 리스너 등록
   */
  onNetworkChange(callback: (online: boolean) => void) {
    this.listeners.push(callback);
    // 현재 상태를 즉시 알림
    callback(this.isOnline);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 온라인 상태 확인
   */
  get online(): boolean {
    return this.isOnline;
  }

  /**
   * 네트워크 연결 품질 테스트
   */
  async testConnection(): Promise<'fast' | 'slow' | 'offline'> {
    if (!this.isOnline) {
      return 'offline';
    }

    try {
      const start = Date.now();
      await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const duration = Date.now() - start;
      
      return duration < 1000 ? 'fast' : 'slow';
    } catch {
      return 'offline';
    }
  }
}

/**
 * 캐시 관리
 */
export class CacheManager {
  private readonly CACHE_NAME = 'english-cards-v1';
  private readonly OFFLINE_URL = '/offline.html';

  /**
   * 캐시 크기 확인
   */
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) {
      return 0;
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const requests = await cache.keys();
      let totalSize = 0;

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('캐시 크기 확인 오류:', error);
      return 0;
    }
  }

  /**
   * 캐시 정리
   */
  async clearCache(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      return true;
    } catch (error) {
      console.error('캐시 정리 오류:', error);
      return false;
    }
  }

  /**
   * 특정 URL 캐시에서 제거
   */
  async removeFromCache(url: string): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      return await cache.delete(url);
    } catch (error) {
      console.error('캐시 항목 제거 오류:', error);
      return false;
    }
  }

  /**
   * 오프라인 페이지 캐시
   */
  async cacheOfflinePage(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      await cache.add(this.OFFLINE_URL);
    } catch (error) {
      console.error('오프라인 페이지 캐시 오류:', error);
    }
  }
}

// 싱글톤 인스턴스들
export const pwaInstallManager = new PWAInstallManager();
export const networkManager = new NetworkManager();
export const cacheManager = new CacheManager();

/**
 * PWA 기능 지원 여부 확인
 */
export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'caches' in window;
};

/**
 * Service Worker 등록 상태 확인
 */
export const getServiceWorkerStatus = (): 'unsupported' | 'installing' | 'waiting' | 'active' | 'redundant' => {
  if (!('serviceWorker' in navigator)) {
    return 'unsupported';
  }

  const registration = navigator.serviceWorker.controller;
  if (!registration) {
    return 'installing';
  }

  return registration.state as 'installing' | 'waiting' | 'active' | 'redundant';
};

/**
 * 앱 업데이트 확인 및 적용
 */
export const checkForUpdates = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
    return false;
  } catch (error) {
    console.error('업데이트 확인 오류:', error);
    return false;
  }
};