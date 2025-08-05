import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing, componentSpacing } from '../../tokens/spacing';
import { animations } from '../../tokens/animations';
import { 
  useReducedMotion, 
  getAnimationDuration, 
  createTransition,
  createPressAnimation,
  spinnerVariants
} from '../../tokens/animationUtils';
import { useTouchOptimization } from '../../hooks/useResponsiveLayout';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 스타일 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 상태 */
  loading?: boolean;
  /** 아이콘 (텍스트 앞에 표시) */
  icon?: React.ReactNode;
  /** 아이콘 (텍스트 뒤에 표시) */
  iconRight?: React.ReactNode;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 터치 최적화 활성화 */
  touchOptimized?: boolean;
  /** 접근성 라벨 */
  'aria-label'?: string;
  /** 설명 텍스트 ID */
  'aria-describedby'?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  touchOptimized = true,
  className = '',
  children,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  // 스타일 계산
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary[500],
          color: '#FFFFFF',
          border: `1px solid ${colors.primary[500]}`,
          '&:hover:not(:disabled)': {
            backgroundColor: colors.primary[600],
            borderColor: colors.primary[600],
          },
          '&:focus': {
            outline: `2px solid ${colors.primary[200]}`,
            outlineOffset: '2px',
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.primary[700],
            borderColor: colors.primary[700],
          }
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary[500],
          color: '#FFFFFF',
          border: `1px solid ${colors.secondary[500]}`,
          '&:hover:not(:disabled)': {
            backgroundColor: colors.secondary[600],
            borderColor: colors.secondary[600],
          },
          '&:focus': {
            outline: `2px solid ${colors.secondary[200]}`,
            outlineOffset: '2px',
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.secondary[700],
            borderColor: colors.secondary[700],
          }
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.neutral[700],
          border: `1px solid ${colors.neutral[200]}`,
          '&:hover:not(:disabled)': {
            backgroundColor: colors.neutral[50],
            borderColor: colors.neutral[300],
          },
          '&:focus': {
            outline: `2px solid ${colors.primary[200]}`,
            outlineOffset: '2px',
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.neutral[100],
            borderColor: colors.neutral[400],
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${componentSpacing.button.sm.y} ${componentSpacing.button.sm.x}`,
          fontSize: typography.caption.medium.fontSize,
          lineHeight: typography.caption.medium.lineHeight,
          fontWeight: typography.fontWeight.medium,
          minHeight: '32px',
        };
      case 'md':
        return {
          padding: `${componentSpacing.button.md.y} ${componentSpacing.button.md.x}`,
          fontSize: typography.body.small.fontSize,
          lineHeight: typography.body.small.lineHeight,
          fontWeight: typography.fontWeight.medium,
          minHeight: '40px',
        };
      case 'lg':
        return {
          padding: `${componentSpacing.button.lg.y} ${componentSpacing.button.lg.x}`,
          fontSize: typography.body.medium.fontSize,
          lineHeight: typography.body.medium.lineHeight,
          fontWeight: typography.fontWeight.medium,
          minHeight: '48px',
        };
      default:
        return {};
    }
  };

  const reducedMotion = useReducedMotion();
  
  // 터치 최적화 스타일
  const touchOptimization = useTouchOptimization(size, touchOptimized);
  
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontFamily: typography.fontFamily.sans.join(', '),
    cursor: disabled || loading ? 'not-allowed' : (touchOptimization.isTouchDevice ? 'default' : 'pointer'),
    transition: createTransition(['background-color', 'border-color', 'box-shadow', 'transform'], 'fast'),
    textDecoration: 'none',
    userSelect: 'none' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    // 터치 최적화 스타일 적용
    ...touchOptimization.styles,
    ...getSizeStyles(),
    ...getVariantStyles(),
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter와 Space 키 지원
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled && !loading) {
        onClick?.(event as any);
      }
    }
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      style={baseStyles}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      whileHover={!disabled && !loading && !reducedMotion ? { 
        scale: 1.02,
        y: -1
      } : undefined}
      whileTap={!disabled && !loading && !reducedMotion ? { 
        scale: 0.98,
        y: 0
      } : undefined}
      transition={{
        duration: reducedMotion ? 0.001 : parseFloat(animations.duration.fast) / 1000,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      {...props}
    >
      {loading && (
        <motion.div
          variants={spinnerVariants}
          animate={reducedMotion ? undefined : "animate"}
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
      )}
      
      {!loading && icon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      <motion.span 
        animate={{ 
          opacity: loading ? 0.7 : 1 
        }}
        transition={{
          duration: reducedMotion ? 0.001 : parseFloat(animations.duration.fast) / 1000
        }}
      >
        {children}
      </motion.span>
      
      {!loading && iconRight && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {iconRight}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;