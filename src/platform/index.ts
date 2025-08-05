/**
 * 플랫폼별 추상화 레이어
 * 웹과 React Native 간의 호환성을 제공합니다.
 */

export type Platform = 'web' | 'ios' | 'android';

/**
 * 현재 플랫폼 감지
 */
export const getCurrentPlatform = (): Platform => {
  // React Native 환경 감지
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // React Native에서는 Platform API 사용
    const { Platform } = require('react-native');
    return Platform.OS === 'ios' ? 'ios' : 'android';
  }
  
  // 웹 환경
  return 'web';
};

/**
 * 플랫폼별 값 선택
 */
export const platformSelect = <T>(values: {
  web?: T;
  ios?: T;
  android?: T;
  native?: T; // iOS와 Android 공통
  default?: T;
}): T => {
  const platform = getCurrentPlatform();
  
  if (values[platform]) {
    return values[platform]!;
  }
  
  if (platform !== 'web' && values.native) {
    return values.native;
  }
  
  if (values.default) {
    return values.default;
  }
  
  throw new Error(`No value provided for platform: ${platform}`);
};

/**
 * 플랫폼 확인 유틸리티
 */
export const Platform = {
  OS: getCurrentPlatform(),
  isWeb: getCurrentPlatform() === 'web',
  isIOS: getCurrentPlatform() === 'ios',
  isAndroid: getCurrentPlatform() === 'android',
  isNative: getCurrentPlatform() !== 'web',
  
  select: platformSelect,
  
  /**
   * 버전 정보 (React Native에서만 사용)
   */
  get Version(): string | number {
    if (this.isWeb) return 'N/A';
    
    try {
      const { Platform: RNPlatform } = require('react-native');
      return RNPlatform.Version;
    } catch {
      return 'N/A';
    }
  }
};