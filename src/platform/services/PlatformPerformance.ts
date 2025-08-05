/**
 * 플랫폼별 성능 최적화 서비스
 */

import { Platform } from '../index';

/**
 * 성능 메트릭 인터페이스
 */
export interface PerformanceMetrics {
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  renderTime?: number;
  bundleSize?: number;
  networkLatency?: number;
  batteryLevel?: number;
  isLowPowerMode?: boolean;
}

/**
 * 성능 모니터링 클래스
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: Array<(metrics: PerformanceMetrics) => void> = [];
  private monitoringInterval?: NodeJS.Timeout;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 성능 모니터링 시작
   */
  startMonitoring(intervalMs: number = 5000): void {
    this.stopMonitoring();
    
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
    }, intervalMs);

    // 초기 메트릭 수집
    this.updateMetrics();
  }

  /**
   * 성능 모니터링 중지
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * 메트릭 업데이트
   */
  private async updateMetrics(): Promise<void> {
    const newMetrics: PerformanceMetrics = {};

    // 메모리 사용량 (웹)
    if (Platform.isWeb && 'memory' in performance) {
      const memInfo = (performance as any).memory;
      newMetrics.memoryUsage = {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit
      };
    }

    // 메모리 사용량 (React Native)
    if (Platform.isNative) {
      try {
        // React Native에서는 네이티브 모듈을 통해 메모리 정보 수집
        const memoryInfo = await this.getNativeMemoryInfo();
        newMetrics.memoryUsage = memoryInfo;
      } catch (error) {
        console.warn('Failed to get native memory info:', error);
      }
    }

    // 배터리 정보 (지원하는 경우)
    if (Platform.isWeb && 'getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        newMetrics.batteryLevel = battery.level;
      } catch (error) {
        console.warn('Battery API not supported:', error);
      }
    }

    // React Native 배터리 정보
    if (Platform.isNative) {
      try {
        const batteryInfo = await this.getNativeBatteryInfo();
        newMetrics.batteryLevel = batteryInfo.level;
        newMetrics.isLowPowerMode = batteryInfo.isLowPowerMode;
      } catch (error) {
        console.warn('Failed to get native battery info:', error);
      }
    }

    // 네트워크 지연시간 측정
    newMetrics.networkLatency = await this.measureNetworkLatency();

    this.metrics = { ...this.metrics, ...newMetrics };
    this.notifyObservers();
  }

  /**
   * React Native 메모리 정보 수집
   */
  private async getNativeMemoryInfo(): Promise<{ used: number; total: number; limit: number }> {
    // 실제 구현에서는 네이티브 모듈 사용
    return {
      used: 0,
      total: 0,
      limit: 0
    };
  }

  /**
   * React Native 배터리 정보 수집
   */
  private async getNativeBatteryInfo(): Promise<{ level: number; isLowPowerMode: boolean }> {
    // 실제 구현에서는 react-native-device-info 등 사용
    return {
      level: 1.0,
      isLowPowerMode: false
    };
  }

  /**
   * 네트워크 지연시간 측정
   */
  private async measureNetworkLatency(): Promise<number> {
    try {
      const start = Date.now();
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      return Date.now() - start;
    } catch (error) {
      return -1; // 오프라인 또는 오류
    }
  }

  /**
   * 렌더링 시간 측정
   */
  measureRenderTime(componentName: string, renderFn: () => void): number {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    const renderTime = end - start;

    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    return renderTime;
  }

  /**
   * 메트릭 관찰자 등록
   */
  subscribe(observer: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(observer);
    
    // 현재 메트릭 즉시 전달
    observer(this.metrics);
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * 관찰자들에게 알림
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.metrics));
  }

  /**
   * 현재 메트릭 반환
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 메모리 압박 상황 감지
   */
  isMemoryPressure(): boolean {
    const { memoryUsage } = this.metrics;
    if (!memoryUsage) return false;

    const usageRatio = memoryUsage.used / memoryUsage.limit;
    return usageRatio > 0.8; // 80% 이상 사용 시 압박 상황
  }

  /**
   * 저전력 모드 감지
   */
  isLowPowerMode(): boolean {
    return this.metrics.isLowPowerMode || false;
  }

  /**
   * 네트워크 상태 확인
   */
  isSlowNetwork(): boolean {
    const { networkLatency } = this.metrics;
    return networkLatency ? networkLatency > 1000 : false; // 1초 이상
  }
}

/**
 * 메모리 최적화 유틸리티
 */
export class MemoryOptimizer {
  private static imageCache = new Map<string, HTMLImageElement>();
  private static componentCache = new WeakMap();

  /**
   * 이미지 캐시 관리
   */
  static optimizeImageCache(): void {
    // 캐시 크기 제한 (최대 50개)
    if (this.imageCache.size > 50) {
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
    }

    // 메모리 압박 시 캐시 정리
    const monitor = PerformanceMonitor.getInstance();
    if (monitor.isMemoryPressure()) {
      this.clearImageCache();
    }
  }

  /**
   * 이미지 캐시 정리
   */
  static clearImageCache(): void {
    this.imageCache.clear();
    console.log('Image cache cleared due to memory pressure');
  }

  /**
   * 컴포넌트 메모이제이션 최적화
   */
  static shouldComponentUpdate<T>(
    component: React.Component<T>,
    nextProps: T,
    nextState: any
  ): boolean {
    const monitor = PerformanceMonitor.getInstance();
    
    // 저전력 모드에서는 업데이트 빈도 감소
    if (monitor.isLowPowerMode()) {
      const lastUpdate = this.componentCache.get(component) || 0;
      const now = Date.now();
      
      // 최소 500ms 간격으로 업데이트
      if (now - lastUpdate < 500) {
        return false;
      }
      
      this.componentCache.set(component, now);
    }

    return true;
  }

  /**
   * 가비지 컬렉션 힌트
   */
  static triggerGC(): void {
    if (Platform.isWeb && process.env.NODE_ENV === 'development') {
      // 개발 환경에서만 사용
      if ('gc' in window) {
        (window as any).gc();
      }
    }

    // React Native에서는 네이티브 GC 트리거
    if (Platform.isNative) {
      try {
        // 실제 구현에서는 네이티브 모듈 사용
        console.log('Triggering native GC');
      } catch (error) {
        console.warn('Failed to trigger native GC:', error);
      }
    }
  }

  /**
   * 메모리 사용량 최적화
   */
  static optimizeMemoryUsage(): void {
    const monitor = PerformanceMonitor.getInstance();
    
    if (monitor.isMemoryPressure()) {
      // 이미지 캐시 정리
      this.clearImageCache();
      
      // 가비지 컬렉션 트리거
      this.triggerGC();
      
      // 불필요한 DOM 요소 정리 (웹)
      if (Platform.isWeb) {
        this.cleanupDOMElements();
      }
      
      console.log('Memory optimization triggered');
    }
  }

  /**
   * DOM 요소 정리 (웹 전용)
   */
  private static cleanupDOMElements(): void {
    // 보이지 않는 이미지 요소들의 src 제거
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        img.removeAttribute('src');
      }
    });

    // 사용하지 않는 스타일 시트 제거
    const styleSheets = document.querySelectorAll('style');
    styleSheets.forEach(style => {
      if (!style.textContent?.trim()) {
        style.remove();
      }
    });
  }
}

/**
 * 배터리 최적화 유틸리티
 */
export class BatteryOptimizer {
  private static animationFrameId?: number;
  private static isOptimizing = false;

  /**
   * 배터리 최적화 시작
   */
  static startOptimization(): void {
    if (this.isOptimizing) return;
    
    this.isOptimizing = true;
    const monitor = PerformanceMonitor.getInstance();

    const optimize = () => {
      if (monitor.isLowPowerMode()) {
        this.applyLowPowerOptimizations();
      } else {
        this.applyNormalOptimizations();
      }

      if (this.isOptimizing) {
        this.animationFrameId = requestAnimationFrame(optimize);
      }
    };

    optimize();
  }

  /**
   * 배터리 최적화 중지
   */
  static stopOptimization(): void {
    this.isOptimizing = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  /**
   * 저전력 모드 최적화 적용
   */
  private static applyLowPowerOptimizations(): void {
    // 애니메이션 비활성화
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // 그림자 효과 제거
    document.documentElement.style.setProperty('--box-shadow', 'none');
    
    // 그라데이션 단순화
    document.documentElement.style.setProperty('--gradient-complexity', 'low');
    
    // 업데이트 빈도 감소
    document.documentElement.classList.add('low-power-mode');
  }

  /**
   * 일반 모드 최적화 적용
   */
  private static applyNormalOptimizations(): void {
    // 애니메이션 복원
    document.documentElement.style.removeProperty('--animation-duration');
    
    // 그림자 효과 복원
    document.documentElement.style.removeProperty('--box-shadow');
    
    // 그라데이션 복원
    document.documentElement.style.removeProperty('--gradient-complexity');
    
    // 저전력 모드 클래스 제거
    document.documentElement.classList.remove('low-power-mode');
  }
}

/**
 * 플랫폼 성능 최적화 초기화
 */
export const initPlatformPerformance = (): void => {
  const monitor = PerformanceMonitor.getInstance();
  
  // 성능 모니터링 시작
  monitor.startMonitoring();
  
  // 배터리 최적화 시작
  BatteryOptimizer.startOptimization();
  
  // 메모리 최적화 주기적 실행
  setInterval(() => {
    MemoryOptimizer.optimizeMemoryUsage();
  }, 30000); // 30초마다

  // 페이지 가시성 변경 시 최적화
  if (Platform.isWeb) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 백그라운드로 갈 때 최적화
        MemoryOptimizer.optimizeMemoryUsage();
      }
    });
  }

  console.log('Platform performance optimization initialized');
};