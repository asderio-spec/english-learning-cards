/**
 * 브라우저 호환성 관련 React 훅들
 */

import { useState, useEffect, useCallback } from 'react';
import { BrowserDetector, FeatureDetector } from '../utils/browserCompatibility';

/**
 * 브라우저 정보를 제공하는 훅
 */
export const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState(() => BrowserDetector.detect());

  useEffect(() => {
    // 브라우저 정보는 일반적으로 변경되지 않지만, 
    // 개발 중 User Agent 변경 등을 감지하기 위해 주기적으로 확인
    const interval = setInterval(() => {
      const newInfo = BrowserDetector.detect();
      setBrowserInfo(prevInfo => {
        if (JSON.stringify(prevInfo) !== JSON.stringify(newInfo)) {
          return newInfo;
        }
        return prevInfo;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return browserInfo;
};

/**
 * 특정 기능 지원 여부를 확인하는 훅
 */
export const useFeatureSupport = (features: string[]) => {
  const [support, setSupport] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkSupport = () => {
      const supportMap: Record<string, boolean> = {};
      
      features.forEach(feature => {
        supportMap[feature] = FeatureDetector.supportsAPI(feature);
      });
      
      setSupport(supportMap);
    };

    checkSupport();
  }, [features]);

  return support;
};

/**
 * CSS 기능 지원 여부를 확인하는 훅
 */
export const useCSSSupport = (properties: Array<{ property: string; value?: string }>) => {
  const [support, setSupport] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkSupport = () => {
      const supportMap: Record<string, boolean> = {};
      
      properties.forEach(({ property, value }) => {
        const key = value ? `${property}:${value}` : property;
        supportMap[key] = FeatureDetector.supportsCSS(property, value);
      });
      
      setSupport(supportMap);
    };

    checkSupport();
  }, [properties]);

  return support;
};

/**
 * 미디어 쿼리 상태를 추적하는 훅
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 최신 브라우저
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // 구형 브라우저 호환성
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * 사용자 선호도를 감지하는 훅
 */
export const useUserPreferences = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');

  return {
    prefersDarkMode,
    prefersReducedMotion,
    prefersHighContrast,
    prefersReducedTransparency
  };
};

/**
 * 뷰포트 크기를 추적하는 훅
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
};

/**
 * 온라인/오프라인 상태를 추적하는 훅
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * 배터리 상태를 추적하는 훅 (지원하는 브라우저에서만)
 */
export const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState<{
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
  } | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return;
    }

    const getBatteryInfo = async () => {
      try {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryInfo = () => {
          setBatteryStatus({
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };

        updateBatteryInfo();

        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingtimechange', updateBatteryInfo);
        battery.addEventListener('dischargingtimechange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryInfo);
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingtimechange', updateBatteryInfo);
          battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
        };
      } catch (error) {
        console.warn('Battery API not supported:', error);
      }
    };

    getBatteryInfo();
  }, []);

  return batteryStatus;
};

/**
 * 디바이스 방향을 추적하는 훅
 */
export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<{
    angle: number;
    type: string;
  }>(() => ({
    angle: typeof screen !== 'undefined' && screen.orientation 
      ? screen.orientation.angle 
      : 0,
    type: typeof screen !== 'undefined' && screen.orientation 
      ? screen.orientation.type 
      : 'portrait-primary'
  }));

  useEffect(() => {
    if (typeof screen === 'undefined' || !screen.orientation) return;

    const handleOrientationChange = () => {
      setOrientation({
        angle: screen.orientation.angle,
        type: screen.orientation.type
      });
    };

    screen.orientation.addEventListener('change', handleOrientationChange);

    return () => {
      screen.orientation.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return orientation;
};

/**
 * 브라우저 호환성 경고를 표시하는 훅
 */
export const useBrowserCompatibilityWarning = (requiredFeatures: string[]) => {
  const [warnings, setWarnings] = useState<string[]>([]);
  const browserInfo = useBrowserInfo();
  const featureSupport = useFeatureSupport(requiredFeatures);

  useEffect(() => {
    const newWarnings: string[] = [];

    // 구형 브라우저 경고
    if (browserInfo.name === 'Chrome' && parseInt(browserInfo.version) < 80) {
      newWarnings.push('Chrome 80 이상 버전을 권장합니다.');
    }
    if (browserInfo.name === 'Firefox' && parseInt(browserInfo.version) < 75) {
      newWarnings.push('Firefox 75 이상 버전을 권장합니다.');
    }
    if (browserInfo.name === 'Safari' && parseInt(browserInfo.version) < 13) {
      newWarnings.push('Safari 13 이상 버전을 권장합니다.');
    }

    // 필수 기능 지원 여부 확인
    Object.entries(featureSupport).forEach(([feature, supported]) => {
      if (!supported) {
        newWarnings.push(`${feature} 기능이 지원되지 않습니다.`);
      }
    });

    setWarnings(newWarnings);
  }, [browserInfo, featureSupport]);

  const dismissWarning = useCallback((index: number) => {
    setWarnings(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    warnings,
    dismissWarning,
    hasWarnings: warnings.length > 0
  };
};