/**
 * Linear 디자인 시스템 - 테마 토글 컴포넌트
 * 라이트/다크 모드 전환을 위한 버튼 컴포넌트
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../Button';

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  variant = 'ghost',
  showLabel = false,
  className
}) => {
  const { isDarkMode, toggleTheme, isSystemTheme, config } = useTheme();

  const getIcon = () => {
    if (isSystemTheme) {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 2.5a5.5 5.5 0 0 0-5.5 5.5c0 1.61.69 3.06 1.79 4.06L8 8.35l3.71 3.71A5.48 5.48 0 0 0 13.5 8 5.5 5.5 0 0 0 8 2.5Z"
            fill="currentColor"
          />
          <path
            d="M8 13.5a5.48 5.48 0 0 1-3.71-1.44L8 8.35l3.71 3.71A5.48 5.48 0 0 1 8 13.5Z"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      );
    }

    if (isDarkMode) {
      // Moon icon for dark mode
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 1a7 7 0 1 0 0 14 5.5 5.5 0 0 1 0-11 7.006 7.006 0 0 0 0-3Z"
            fill="currentColor"
          />
        </svg>
      );
    }

    // Sun icon for light mode
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path
          d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.95 3.05l-1.41 1.41M4.46 11.54l-1.41 1.41M12.95 12.95l-1.41-1.41M4.46 4.46L3.05 3.05"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const getLabel = () => {
    if (isSystemTheme) {
      return `시스템 (${config.systemTheme === 'dark' ? '다크' : '라이트'})`;
    }
    return isDarkMode ? '다크 모드' : '라이트 모드';
  };

  const getAriaLabel = () => {
    if (isSystemTheme) {
      return '시스템 테마에서 라이트 모드로 전환';
    }
    return isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환';
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      icon={getIcon()}
      className={className}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {showLabel && getLabel()}
    </Button>
  );
};