/**
 * Linear 디자인 시스템 - 애니메이션 유틸리티
 * 접근성을 고려한 애니메이션 헬퍼 함수들
 */

import { animations, motionVariants, type AnimationDuration, type AnimationEasing } from './animations';

/**
 * prefers-reduced-motion 감지 훅
 */
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 접근성을 고려한 애니메이션 지속시간 반환
 */
export const getAnimationDuration = (
  duration: AnimationDuration,
  respectReducedMotion = true
): string => {
  if (respectReducedMotion && useReducedMotion()) {
    return '0.01ms';
  }
  return animations.duration[duration];
};

/**
 * 접근성을 고려한 Framer Motion 변형 반환
 */
export const getMotionVariant = (
  variantName: keyof typeof motionVariants,
  respectReducedMotion = true
) => {
  const variant = motionVariants[variantName];
  
  if (respectReducedMotion && useReducedMotion()) {
    return {
      ...variant,
      transition: {
        ...variant.transition,
        duration: 0.001
      }
    };
  }
  
  return variant;
};

/**
 * CSS 트랜지션 생성 유틸리티
 */
export const createTransition = (
  property: string | string[],
  duration: AnimationDuration = 'normal',
  easing: AnimationEasing = 'smooth',
  delay: AnimationDuration = 'instant'
) => {
  const properties = Array.isArray(property) ? property : [property];
  const durationValue = getAnimationDuration(duration);
  const delayValue = getAnimationDuration(delay);
  
  return properties
    .map(prop => `${prop} ${durationValue} ${animations.easing[easing]} ${delayValue}`)
    .join(', ');
};

/**
 * 호버 애니메이션 생성 유틸리티
 */
export const createHoverAnimation = (
  scale = animations.scale.lg,
  duration: AnimationDuration = 'fast'
) => {
  const transitionValue = createTransition('transform', duration);
  
  return {
    transition: transitionValue,
    '&:hover': {
      transform: `scale(${scale})`
    }
  };
};

/**
 * 포커스 애니메이션 생성 유틸리티
 */
export const createFocusAnimation = (
  duration: AnimationDuration = 'fast'
) => {
  const transitionValue = createTransition(['box-shadow', 'outline'], duration);
  
  return {
    transition: transitionValue,
    '&:focus-visible': {
      outline: '2px solid var(--color-primary-500)',
      outlineOffset: '2px'
    }
  };
};

/**
 * 버튼 프레스 애니메이션 생성 유틸리티
 */
export const createPressAnimation = (
  scale = animations.scale.md,
  duration: AnimationDuration = 'fast'
) => {
  const transitionValue = createTransition('transform', duration);
  
  return {
    transition: transitionValue,
    '&:active': {
      transform: `scale(${scale})`
    }
  };
};

/**
 * 스태거 애니메이션을 위한 지연 계산
 */
export const calculateStaggerDelay = (
  index: number,
  baseDelay = 0.1,
  maxDelay = 1
): number => {
  const delay = baseDelay * index;
  return Math.min(delay, maxDelay);
};

/**
 * 스프링 애니메이션 설정
 */
export const springConfig = {
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
    mass: 1
  },
  wobbly: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 12,
    mass: 1
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
    mass: 1
  }
};

/**
 * 접근성을 고려한 스프링 설정 반환
 */
export const getSpringConfig = (
  configName: keyof typeof springConfig,
  respectReducedMotion = true
) => {
  if (respectReducedMotion && useReducedMotion()) {
    return {
      type: 'tween' as const,
      duration: 0.001
    };
  }
  
  return springConfig[configName];
};

/**
 * 페이지 전환 애니메이션 변형
 */
export const pageTransitionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    duration: parseFloat(animations.duration.normal) / 1000,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

/**
 * 모달 애니메이션 변형
 */
export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  modal: {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    }
  }
};

/**
 * 드롭다운 애니메이션 변형
 */
export const dropdownVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    y: -10
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -10
  }
};

/**
 * 토스트 알림 애니메이션 변형
 */
export const toastVariants = {
  initial: { 
    opacity: 0, 
    x: 300,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    x: 300,
    scale: 0.95
  }
};

/**
 * 로딩 스피너 애니메이션
 */
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/**
 * 펄스 애니메이션 (로딩 상태용)
 */
export const pulseVariants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};