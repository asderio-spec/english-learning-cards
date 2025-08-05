/**
 * Linear 디자인 시스템 - 다크 테마 정의
 * 어두운 배경과 밝은 텍스트를 사용하는 다크 모드 색상 스키마
 */

import { colors } from '../tokens/colors';
import type { Theme } from './types';

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // 배경 색상 - 어두운 배경 사용
    background: {
      primary: colors.neutral[900],   // 가장 어두운 기본 배경
      secondary: colors.neutral[800], // 약간 밝은 보조 배경
      elevated: colors.neutral[700]   // 카드, 모달 등 상승된 요소 배경
    },
    
    // 표면 색상 - 컴포넌트 배경
    surface: {
      primary: colors.neutral[800],   // 기본 표면 (카드, 입력 필드)
      secondary: colors.neutral[700], // 보조 표면
      tertiary: colors.neutral[600]   // 3차 표면 (비활성 영역)
    },
    
    // 텍스트 색상 - 밝은 텍스트 사용 (다크 모드)
    text: {
      primary: colors.neutral[50],    // 주요 텍스트 (제목, 본문) - 가장 밝음
      secondary: colors.neutral[200], // 보조 텍스트 (설명, 라벨)
      tertiary: colors.neutral[300],  // 3차 텍스트 (플레이스홀더)
      disabled: colors.neutral[400],  // 비활성 텍스트
      inverse: colors.neutral[800]    // 역방향 텍스트 (밝은 배경 위)
    },
    
    // 경계선 색상
    border: {
      primary: colors.neutral[600],   // 기본 경계선
      secondary: colors.neutral[700], // 보조 경계선 (더 어두움)
      focus: colors.primary[400]      // 포커스 상태 경계선 (더 밝은 색상)
    },
    
    // 그림자 - 다크 모드용 진한 그림자
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
    },
    
    // 의미적 색상 - 다크 모드 최적화
    semantic: {
      primary: {
        background: colors.primary[900],
        border: colors.primary[700],
        text: colors.primary[300],
        textStrong: colors.primary[200]
      },
      secondary: {
        background: colors.secondary[900],
        border: colors.secondary[700],
        text: colors.secondary[300],
        textStrong: colors.secondary[200]
      },
      success: {
        background: colors.success[900],
        border: colors.success[700],
        text: colors.success[300],
        textStrong: colors.success[200]
      },
      warning: {
        background: colors.warning[900],
        border: colors.warning[700],
        text: colors.warning[300],
        textStrong: colors.warning[200]
      },
      error: {
        background: colors.error[900],
        border: colors.error[700],
        text: colors.error[300],
        textStrong: colors.error[200]
      }
    },
    
    // 인터랙션 상태 색상
    interactive: {
      hover: 'rgba(255, 255, 255, 0.08)',  // 호버 오버레이 (밝은 색상)
      pressed: 'rgba(255, 255, 255, 0.12)', // 눌림 상태 오버레이
      selected: colors.primary[900],         // 선택된 상태 배경
      focus: colors.primary[800]             // 포커스 상태 배경
    }
  }
} as const;