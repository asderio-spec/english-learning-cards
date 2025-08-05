/**
 * 플랫폼 추상화 레이어 테스트
 */

import { Platform, platformSelect, getCurrentPlatform } from '../index';

// Mock navigator for testing
const mockNavigator = (product?: string) => {
  Object.defineProperty(global, 'navigator', {
    value: {
      product,
      userAgent: 'test-agent'
    },
    writable: true
  });
};

describe('Platform Detection', () => {
  beforeEach(() => {
    // Reset navigator mock
    delete (global as any).navigator;
  });

  it('should detect web platform by default', () => {
    mockNavigator();
    expect(getCurrentPlatform()).toBe('web');
    expect(Platform.OS).toBe('web');
    expect(Platform.isWeb).toBe(true);
    expect(Platform.isNative).toBe(false);
  });

  it('should detect React Native platform', () => {
    mockNavigator('ReactNative');
    
    // Mock React Native Platform
    jest.doMock('react-native', () => ({
      Platform: {
        OS: 'android'
      }
    }), { virtual: true });

    // Re-import to get updated platform detection
    jest.resetModules();
    const { getCurrentPlatform } = require('../index');
    
    expect(getCurrentPlatform()).toBe('android');
  });

  it('should handle missing React Native gracefully', () => {
    mockNavigator('ReactNative');
    
    // Mock missing React Native
    jest.doMock('react-native', () => {
      throw new Error('React Native not found');
    }, { virtual: true });

    jest.resetModules();
    const { getCurrentPlatform } = require('../index');
    
    // Should fallback to web
    expect(getCurrentPlatform()).toBe('web');
  });
});

describe('Platform Select', () => {
  beforeEach(() => {
    mockNavigator();
  });

  it('should select web value correctly', () => {
    const result = platformSelect({
      web: 'web-value',
      ios: 'ios-value',
      android: 'android-value'
    });
    
    expect(result).toBe('web-value');
  });

  it('should use default value when platform value is not available', () => {
    const result = platformSelect({
      ios: 'ios-value',
      android: 'android-value',
      default: 'default-value'
    });
    
    expect(result).toBe('default-value');
  });

  it('should use native value for mobile platforms', () => {
    // Mock iOS platform
    jest.doMock('../index', () => ({
      getCurrentPlatform: () => 'ios'
    }), { virtual: true });

    const result = platformSelect({
      web: 'web-value',
      native: 'native-value',
      default: 'default-value'
    });
    
    expect(result).toBe('native-value');
  });

  it('should throw error when no suitable value is found', () => {
    expect(() => {
      platformSelect({
        ios: 'ios-value',
        android: 'android-value'
      });
    }).toThrow('No value provided for platform: web');
  });
});

describe('Platform Properties', () => {
  beforeEach(() => {
    mockNavigator();
  });

  it('should have correct platform properties for web', () => {
    expect(Platform.isWeb).toBe(true);
    expect(Platform.isIOS).toBe(false);
    expect(Platform.isAndroid).toBe(false);
    expect(Platform.isNative).toBe(false);
  });

  it('should provide select function', () => {
    expect(typeof Platform.select).toBe('function');
    
    const result = Platform.select({
      web: 'web-selected',
      default: 'default-selected'
    });
    
    expect(result).toBe('web-selected');
  });

  it('should return N/A for version on web', () => {
    expect(Platform.Version).toBe('N/A');
  });
});