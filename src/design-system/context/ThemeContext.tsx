/**
 * Linear 디자인 시스템 - 테마 컨텍스트
 * 테마 상태 관리 및 전환 로직
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Theme, ThemeMode, ThemeConfig } from '../themes/types';
import {
  getTheme,
  getSystemTheme,
  resolveThemeMode,
  applyThemeToDOM,
  saveThemeToStorage,
  loadThemeFromStorage
} from '../themes';

interface ThemeContextValue {
  // 현재 테마 상태
  config: ThemeConfig;
  theme: Theme;
  
  // 테마 변경 함수
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  
  // 유틸리티
  isSystemTheme: boolean;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  enableSystemTheme?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  enableSystemTheme = true
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());

  // 해석된 테마 (system -> light/dark)
  const resolvedTheme = resolveThemeMode(currentTheme === 'system' ? systemTheme : currentTheme);
  const theme = getTheme(resolvedTheme);

  // 테마 설정 객체
  const config: ThemeConfig = {
    currentTheme,
    systemTheme,
    resolvedTheme
  };

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (!enableSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [enableSystemTheme]);

  // 초기 테마 로드 (로컬 스토리지에서)
  useEffect(() => {
    const savedTheme = loadThemeFromStorage();
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // DOM에 테마 적용
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // 테마 변경 함수
  const setTheme = useCallback((mode: ThemeMode) => {
    setCurrentTheme(mode);
    saveThemeToStorage(mode);
  }, []);

  // 테마 토글 함수 (light <-> dark)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // 유틸리티 값들
  const isSystemTheme = currentTheme === 'system';
  const isDarkMode = resolvedTheme === 'dark';

  const contextValue: ThemeContextValue = {
    config,
    theme,
    setTheme,
    toggleTheme,
    isSystemTheme,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 테마 컨텍스트 훅
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// 테마 색상만 필요한 경우를 위한 간단한 훅
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// 다크 모드 여부만 필요한 경우를 위한 훅
export const useDarkMode = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return { isDarkMode, toggleTheme };
};