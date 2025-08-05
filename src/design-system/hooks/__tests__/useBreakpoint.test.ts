/**
 * Linear 디자인 시스템 - useBreakpoint 훅 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useBreakpoint,
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween,
  useBreakpointOnly,
} from '../useBreakpoint';

// window.matchMedia 모킹
const mockMatchMedia = vi.fn();

beforeEach(() => {
  // window 객체 모킹
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  // innerWidth, innerHeight 모킹
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });

  // addEventListener, removeEventListener 모킹
  window.addEventListener = vi.fn();
  window.removeEventListener = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useBreakpoint', () => {
  it('should return correct breakpoint state for desktop', () => {
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.current).toBe('desktop');
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isWide).toBe(false);
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should return correct breakpoint state for mobile', () => {
    // 모바일 크기로 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.current).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isWide).toBe(false);
  });

  it('should return correct breakpoint state for tablet', () => {
    // 태블릿 크기로 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.current).toBe('tablet');
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isWide).toBe(false);
  });

  it('should return correct breakpoint state for wide screen', () => {
    // 와이드 스크린 크기로 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.current).toBe('wide');
    expect(result.current.isWide).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should handle SSR environment', () => {
    // window 객체 제거
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.current).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.width).toBe(320);
    expect(result.current.height).toBe(568);

    // window 객체 복원
    global.window = originalWindow;
  });

  it('should register and cleanup resize event listener', () => {
    const { unmount } = renderHook(() => useBreakpoint());

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

describe('useBreakpointUp', () => {
  it('should return true when screen is larger than breakpoint', () => {
    // 데스크톱 크기 (1024px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useBreakpointUp('tablet'));

    expect(result.current).toBe(true);
  });

  it('should return false when screen is smaller than breakpoint', () => {
    // 모바일 크기 (375px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useBreakpointUp('tablet'));

    expect(result.current).toBe(false);
  });
});

describe('useBreakpointDown', () => {
  it('should return true when screen is smaller than breakpoint', () => {
    // 모바일 크기 (375px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useBreakpointDown('tablet'));

    expect(result.current).toBe(true);
  });

  it('should return false when screen is larger than breakpoint', () => {
    // 데스크톱 크기 (1024px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useBreakpointDown('tablet'));

    expect(result.current).toBe(false);
  });
});

describe('useBreakpointBetween', () => {
  it('should return true when screen is between breakpoints', () => {
    // 태블릿 크기 (768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useBreakpointBetween('tablet', 'desktop'));

    expect(result.current).toBe(true);
  });

  it('should return false when screen is outside breakpoint range', () => {
    // 모바일 크기 (375px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useBreakpointBetween('tablet', 'desktop'));

    expect(result.current).toBe(false);
  });
});

describe('useBreakpointOnly', () => {
  it('should return true when current breakpoint matches', () => {
    // 태블릿 크기 (768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useBreakpointOnly('tablet'));

    expect(result.current).toBe(true);
  });

  it('should return false when current breakpoint does not match', () => {
    // 데스크톱 크기 (1024px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useBreakpointOnly('tablet'));

    expect(result.current).toBe(false);
  });
});