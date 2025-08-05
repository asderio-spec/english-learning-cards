import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors, lightTheme, darkTheme } from '../../tokens/colors';
import { spacing, componentSpacing, layout } from '../../tokens/spacing';
import { animations } from '../../tokens/animations';
import { 
  useReducedMotion, 
  getMotionVariant,
  createTransition
} from '../../tokens/animationUtils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 변형 스타일 */
  variant?: 'default' | 'elevated' | 'outlined';
  /** 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg';
  /** 인터랙티브 상태 (호버 효과 등) */
  interactive?: boolean;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 등장 애니메이션 활성화 */
  animate?: boolean;
  /** 애니메이션 지연 시간 (초) */
  animationDelay?: number;
  /** 접근성 역할 */
  role?: string;
  /** 접근성 라벨 */
  'aria-label'?: string;
  /** 설명 텍스트 ID */
  'aria-describedby'?: string;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  interactive = false,
  fullWidth = false,
  animate = true,
  animationDelay = 0,
  className = '',
  children,
  onClick,
  onKeyDown,
  role,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const reducedMotion = useReducedMotion();
  // 스타일 계산
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: 'var(--surface-primary)',
          border: `1px solid var(--border-primary)`,
          boxShadow: 'var(--shadow-sm)',
        };
      case 'elevated':
        return {
          backgroundColor: 'var(--surface-primary)',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
        };
      case 'outlined':
        return {
          backgroundColor: 'var(--surface-primary)',
          border: `2px solid var(--border-primary)`,
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return {
          padding: componentSpacing.card.sm,
        };
      case 'md':
        return {
          padding: componentSpacing.card.md,
        };
      case 'lg':
        return {
          padding: componentSpacing.card.lg,
        };
      default:
        return {};
    }
  };

  const getInteractiveStyles = () => {
    if (!interactive) return {};
    
    return {
      cursor: 'pointer',
      transition: createTransition(['transform', 'box-shadow', 'border-color'], 'normal'),
      '&:focus': {
        outline: `2px solid ${colors.primary[500]}`,
        outlineOffset: '2px',
      }
    };
  };

  const baseStyles = {
    borderRadius: layout.borderRadius.lg,
    position: 'relative' as const,
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    minHeight: layout.minSize.card,
    ...getPaddingStyles(),
    ...getVariantStyles(),
    ...getInteractiveStyles(),
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    // Enter와 Space 키 지원 (interactive한 경우)
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as any);
    }
    
    onKeyDown?.(event);
  };

  // 애니메이션 변형 설정
  const slideUpVariant = getMotionVariant('slideUp');
  
  const motionProps = {
    // 등장 애니메이션
    ...(animate && !reducedMotion ? {
      initial: slideUpVariant.initial,
      animate: slideUpVariant.animate,
      transition: {
        ...slideUpVariant.transition,
        delay: animationDelay
      }
    } : {}),
    
    // 인터랙티브 애니메이션
    ...(interactive && !reducedMotion ? {
      whileHover: { 
        y: -4,
        boxShadow: variant === 'elevated' ? lightTheme.shadow.lg : lightTheme.shadow.md,
        transition: {
          duration: parseFloat(animations.duration.fast) / 1000,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      whileTap: { 
        y: -1,
        scale: 0.98,
        transition: {
          duration: parseFloat(animations.duration.fast) / 1000,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    } : {})
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={baseStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? (role || 'button') : role}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;