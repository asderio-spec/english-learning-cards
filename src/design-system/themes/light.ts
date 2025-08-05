/**
 * Linear 디자인 시스템 - 라이트 테마 정의
 * 밝은 배경과 어두운 텍스트를 사용하는 라이트 모드 색상 스키마
 */

import { colors } from '../tokens/colors';
import type { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    // 배경 색상 - 밝은 배경 사용
    background: {
      primary: colors.neutral[50],    // 가장 밝은 기본 배경
      secondary: colors.neutral[100], // 약간 어두운 보조 배경
      elevated: '#FFFFFF'             // 카드, 모달 등 상승된 요소 배경
    },
    
    // 표면 색상 - 컴포넌트 배경
    surface: {
      primary: '#FFFFFF',             // 기본 표면 (카드, 입력 필드)
      secondary: colors.neutral[50],  // 보조 표면
      tertiary: colors.neutral[100]   // 3차 표면 (비활성 영역)
    },
    
    // 텍스트 색상 - 어두운 텍스트 사용 (라이트 모드)
    text: {
      primary: colors.neutral[800],   // 주요 텍스트 (제목, 본문)
      secondary: colors.neutral[500], // 보조 텍스트 (설명, 라벨)
      tertiary: colors.neutral[400],  // 3차 텍스트 (플레이스홀더)
      disabled: colors.neutral[300],  // 비활성 텍스트
      inverse: '#FFFFFF'              // 역방향 텍스트 (다크 배경 위)
    },
    
    // 경계선 색상
    border: {
      primary: colors.neutral[200],   // 기본 경계선
      secondary: colors.neutral[100], // 보조 경계선 (더 연함)
      focus: colors.primary[500]      // 포커스 상태 경계선
    },
    
    // 그림자 - 라이트 모드용 연한 그림자
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    
    // 의미적 색상 - 라이트 모드 최적화
    semantic: {
      primary: {
        background: colors.primary[50],
        border: colors.primary[200],
        text: colors.primary[700],
        textStrong: colors.primary[800]
      },
      secondary: {
        background: colors.secondary[50],
        border: colors.secondary[200],
        text: colors.secondary[700],
        textStrong: colors.secondary[800]
      },
      success: {
        background: colors.success[50],
        border: colors.success[200],
        text: colors.success[700],
        textStrong: colors.success[800]
      },
      warning: {
        background: colors.warning[50],
        border: colors.warning[200],
        text: colors.warning[700],
        textStrong: colors.warning[800]
      },
      error: {
        background: colors.error[50],
        border: colors.error[200],
        text: colors.error[700],
        textStrong: colors.error[800]
      }
    },
    
    // 인터랙션 상태 색상
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',     // 호버 오버레이
      pressed: 'rgba(0, 0, 0, 0.08)',   // 눌림 상태 오버레이
      selected: colors.primary[50],      // 선택된 상태 배경
      focus: colors.primary[100]         // 포커스 상태 배경
    }
  }
} as const;