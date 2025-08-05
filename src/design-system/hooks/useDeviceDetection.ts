/**
 * Linear 디자인 시스템 - 디바이스 감지 훅
 * 터치 디바이스, 모바일 디바이스, 브라우저 등을 감지
 */

import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

export interface DeviceInfo {
  // 디바이스 타입
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // 입력 방식
  isTouchDevice: boolean;
  hasHover: boolean;
  hasFinePointer: boolean;
  
  // 운영체제
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  
  // 브라우저
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  
  // 기타
  isOnline: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
}

/**
 * 디바이스 정보를 감지하는 훅
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return getDefaultDeviceInfo();
    }
    return detectDevice();
  });

  // 미디어 쿼리 훅 사용
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  const hasHover = useMediaQuery('(hover: hover)');
  const hasFinePointer = useMediaQuery('(pointer: fine)');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDeviceInfo = () => {
      setDeviceInfo(detectDevice());
    };

    const handleOnlineStatusChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine,
      }));
    };

    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      }));
    };

    // 초기 감지
    updateDeviceInfo();

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 미디어 쿼리 결과를 deviceInfo에 반영
  useEffect(() => {
    setDeviceInfo(prev => ({
      ...prev,
      isTouchDevice,
      hasHover,
      hasFinePointer,
    }));
  }, [isTouchDevice, hasHover, hasFinePointer]);

  return deviceInfo;
};

/**
 * 디바이스 정보 감지 함수
 */
function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return getDefaultDeviceInfo();
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  // 운영체제 감지
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || (platform === 'macintel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isWindows = /win/.test(platform);
  const isMacOS = /mac/.test(platform) && !isIOS;
  const isLinux = /linux/.test(platform) && !isAndroid;

  // 브라우저 감지
  const isChrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isEdge = /edg/.test(userAgent);

  // 디바이스 타입 감지 (화면 크기 기반)
  const screenWidth = window.screen.width;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return {
    // 디바이스 타입
    isMobile,
    isTablet,
    isDesktop,
    
    // 입력 방식 (초기값, useEffect에서 업데이트됨)
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    hasHover: window.matchMedia('(hover: hover)').matches,
    hasFinePointer: window.matchMedia('(pointer: fine)').matches,
    
    // 운영체제
    isIOS,
    isAndroid,
    isWindows,
    isMacOS,
    isLinux,
    
    // 브라우저
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    
    // 기타
    isOnline: navigator.onLine,
    pixelRatio: window.devicePixelRatio || 1,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}

/**
 * SSR 환경에서 사용할 기본 디바이스 정보
 */
function getDefaultDeviceInfo(): DeviceInfo {
  return {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    hasHover: true,
    hasFinePointer: true,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isEdge: false,
    isOnline: true,
    pixelRatio: 1,
    screenWidth: 1024,
    screenHeight: 768,
  };
}

/**
 * 터치 디바이스 여부만 간단히 확인하는 훅
 */
export const useIsTouchDevice = (): boolean => {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
};

/**
 * 모바일 디바이스 여부만 간단히 확인하는 훅
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

/**
 * 온라인 상태만 간단히 확인하는 훅
 */
export const useIsOnline = (): boolean => {
  const { isOnline } = useDeviceDetection();
  return isOnline;
};

/**
 * 디바이스별 최적화된 스타일을 반환하는 훅
 */
export const useDeviceOptimizedStyles = () => {
  const deviceInfo = useDeviceDetection();

  return {
    // 터치 타겟 크기
    touchTargetSize: deviceInfo.isTouchDevice ? '44px' : '32px',
    
    // 호버 효과 활성화 여부
    enableHover: deviceInfo.hasHover,
    
    // 스크롤 동작
    scrollBehavior: deviceInfo.isTouchDevice ? 'auto' : 'smooth',
    
    // 애니메이션 성능 최적화
    willChange: deviceInfo.isMobile ? 'transform' : 'auto',
    
    // 폰트 렌더링 최적화
    fontSmoothing: deviceInfo.isMacOS || deviceInfo.isIOS ? 'antialiased' : 'auto',
  };
};