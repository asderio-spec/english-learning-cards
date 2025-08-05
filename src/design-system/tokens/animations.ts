/**
 * Linear 디자인 시스템 - 애니메이션 토큰
 * 부드럽고 의미있는 애니메이션을 위한 토큰 시스템
 */

export const animations = {
  // 애니메이션 지속시간
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms'
  },
  
  // 이징 함수 (Linear 스타일)
  easing: {
    // 표준 이징
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // 커스텀 이징 (Linear 스타일)
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    gentle: 'cubic-bezier(0.16, 1, 0.3, 1)'
  },
  
  // 변환 값
  scale: {
    sm: '0.95',
    md: '0.97',
    lg: '1.05',
    xl: '1.1'
  },
  
  // 이동 거리
  translate: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px'
  }
} as const;

// 공통 애니메이션 패턴
export const animationPatterns = {
  // 페이드 인/아웃
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  
  // 슬라이드 애니메이션
  slideUp: {
    from: { 
      opacity: 0, 
      transform: `translateY(${animations.translate.lg})` 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0)' 
    }
  },
  
  slideDown: {
    from: { 
      opacity: 0, 
      transform: `translateY(-${animations.translate.lg})` 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0)' 
    }
  },
  
  slideLeft: {
    from: { 
      opacity: 0, 
      transform: `translateX(${animations.translate.lg})` 
    },
    to: { 
      opacity: 1, 
      transform: 'translateX(0)' 
    }
  },
  
  slideRight: {
    from: { 
      opacity: 0, 
      transform: `translateX(-${animations.translate.lg})` 
    },
    to: { 
      opacity: 1, 
      transform: 'translateX(0)' 
    }
  },
  
  // 스케일 애니메이션
  scaleIn: {
    from: { 
      opacity: 0, 
      transform: `scale(${animations.scale.sm})` 
    },
    to: { 
      opacity: 1, 
      transform: 'scale(1)' 
    }
  },
  
  scaleOut: {
    from: { 
      opacity: 1, 
      transform: 'scale(1)' 
    },
    to: { 
      opacity: 0, 
      transform: `scale(${animations.scale.sm})` 
    }
  },
  
  // 버튼 프레스 효과
  buttonPress: {
    from: { transform: 'scale(1)' },
    to: { transform: `scale(${animations.scale.md})` }
  },
  
  // 호버 효과
  hover: {
    from: { transform: 'scale(1)' },
    to: { transform: `scale(${animations.scale.lg})` }
  },
  
  // 로딩 스피너
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  }
} as const;

// Framer Motion 변형
export const motionVariants = {
  // 페이드 인/아웃
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: parseFloat(animations.duration.normal) / 1000,
      ease: [0.25, 0.46, 0.45, 0.94] // smooth easing
    }
  },
  
  // 슬라이드 업
  slideUp: {
    initial: { 
      opacity: 0, 
      y: parseInt(animations.translate.lg) 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    exit: { 
      opacity: 0, 
      y: -parseInt(animations.translate.lg) 
    },
    transition: {
      duration: parseFloat(animations.duration.normal) / 1000,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  
  // 스케일 인
  scaleIn: {
    initial: { 
      opacity: 0, 
      scale: parseFloat(animations.scale.sm) 
    },
    animate: { 
      opacity: 1, 
      scale: 1 
    },
    exit: { 
      opacity: 0, 
      scale: parseFloat(animations.scale.sm) 
    },
    transition: {
      duration: parseFloat(animations.duration.fast) / 1000,
      ease: [0.68, -0.55, 0.265, 1.55] // snappy easing
    }
  },
  
  // 스태거 애니메이션 (목록용)
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  // 스태거 아이템
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: parseFloat(animations.duration.normal) / 1000
    }
  }
} as const;

// CSS 애니메이션 클래스 생성 유틸리티
export const createAnimationClass = (
  name: string,
  pattern: typeof animationPatterns[keyof typeof animationPatterns],
  duration: keyof typeof animations.duration = 'normal',
  easing: keyof typeof animations.easing = 'smooth'
) => {
  return `
    @keyframes ${name} {
      from {
        ${Object.entries(pattern.from)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n        ')}
      }
      to {
        ${Object.entries(pattern.to)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n        ')}
      }
    }
    
    .${name} {
      animation: ${name} ${animations.duration[duration]} ${animations.easing[easing]};
    }
  `;
};

// 접근성을 고려한 애니메이션 유틸리티
export const respectsReducedMotion = (animationCSS: string) => {
  return `
    @media (prefers-reduced-motion: no-preference) {
      ${animationCSS}
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
};

// 타입 정의
export type AnimationDuration = keyof typeof animations.duration;
export type AnimationEasing = keyof typeof animations.easing;
export type AnimationPattern = keyof typeof animationPatterns;
export type MotionVariant = keyof typeof motionVariants;