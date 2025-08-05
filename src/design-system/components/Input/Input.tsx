import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors, lightTheme } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing, layout } from '../../tokens/spacing';
import { animations } from '../../tokens/animations';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 타입 */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  /** 입력 필드 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 에러 상태 */
  error?: boolean;
  /** 라벨 텍스트 */
  label?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
  /** 컨테이너 클래스명 */
  containerClassName?: string;
  /** 라벨 클래스명 */
  labelClassName?: string;
  /** 도움말 텍스트 클래스명 */
  helperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  size = 'md',
  error = false,
  disabled = false,
  label,
  helperText,
  errorMessage,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helperClassName = '',
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 고유 ID 생성
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${inputId}-helper`;
  const errorMessageId = `${inputId}-error`;

  // 스타일 계산
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: '32px',
          padding: leftIcon || rightIcon ? '0 32px' : '0 12px',
          fontSize: typography.caption.medium.fontSize,
          lineHeight: typography.caption.medium.lineHeight,
        };
      case 'md':
        return {
          height: layout.minSize.input,
          padding: leftIcon || rightIcon ? '0 40px' : '0 16px',
          fontSize: typography.body.small.fontSize,
          lineHeight: typography.body.small.lineHeight,
        };
      case 'lg':
        return {
          height: '48px',
          padding: leftIcon || rightIcon ? '0 48px' : '0 20px',
          fontSize: typography.body.medium.fontSize,
          lineHeight: typography.body.medium.lineHeight,
        };
      default:
        return {};
    }
  };

  const getStateStyles = () => {
    if (disabled) {
      return {
        backgroundColor: colors.neutral[50],
        borderColor: colors.neutral[200],
        color: colors.neutral[400],
        cursor: 'not-allowed',
      };
    }

    if (error) {
      return {
        borderColor: colors.error[500],
        backgroundColor: '#FFFFFF',
        color: colors.neutral[800],
        '&:focus': {
          borderColor: colors.error[600],
          outline: `2px solid ${colors.error[200]}`,
          outlineOffset: '0px',
        },
      };
    }

    if (focused) {
      return {
        borderColor: colors.primary[500],
        backgroundColor: '#FFFFFF',
        color: colors.neutral[800],
        outline: `2px solid ${colors.primary[200]}`,
        outlineOffset: '0px',
      };
    }

    return {
      backgroundColor: '#FFFFFF',
      borderColor: colors.neutral[200],
      color: colors.neutral[800],
      '&:hover': {
        borderColor: colors.neutral[300],
      },
    };
  };

  const baseInputStyles = {
    width: '100%',
    border: '1px solid',
    borderRadius: layout.borderRadius.md,
    fontFamily: typography.fontFamily.sans.join(', '),
    fontWeight: typography.fontWeight.normal,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    outline: 'none',
    ...getSizeStyles(),
    ...getStateStyles(),
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles = {
    fontSize: typography.body.small.fontSize,
    fontWeight: typography.fontWeight.medium,
    color: error ? colors.error[700] : colors.neutral[700],
    marginBottom: spacing[1],
  };

  const helperTextStyles = {
    fontSize: typography.caption.medium.fontSize,
    color: error ? colors.error[600] : colors.neutral[500],
    marginTop: spacing[1],
  };

  const iconContainerStyles = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: disabled ? colors.neutral[400] : colors.neutral[500],
    pointerEvents: 'none' as const,
  };

  const leftIconStyles = {
    ...iconContainerStyles,
    left: size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px',
  };

  const rightIconStyles = {
    ...iconContainerStyles,
    right: size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px',
    pointerEvents: type === 'password' ? 'auto' : 'none',
    cursor: type === 'password' ? 'pointer' : 'default',
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    props.onBlur?.(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const displayErrorMessage = error && errorMessage;
  const displayHelperText = !displayErrorMessage && helperText;

  const describedBy = [
    ariaDescribedBy,
    displayHelperText ? helperTextId : undefined,
    displayErrorMessage ? errorMessageId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div style={containerStyles} className={containerClassName}>
      {label && (
        <label 
          htmlFor={inputId}
          style={labelStyles}
          className={labelClassName}
        >
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        {leftIcon && (
          <div style={leftIconStyles}>
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          className={className}
          style={baseInputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={error}
          aria-describedby={describedBy}
          whileFocus={{
            scale: 1.01,
            transition: {
              duration: parseFloat(animations.duration.fast) / 1000,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
          {...props}
        />
        
        {(rightIcon || type === 'password') && (
          <div 
            style={rightIconStyles}
            onClick={type === 'password' ? togglePasswordVisibility : undefined}
            role={type === 'password' ? 'button' : undefined}
            tabIndex={type === 'password' ? 0 : undefined}
            aria-label={type === 'password' ? (showPassword ? 'Hide password' : 'Show password') : undefined}
            onKeyDown={type === 'password' ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePasswordVisibility();
              }
            } : undefined}
          >
            {type === 'password' ? (
              showPassword ? (
                <span style={{ fontSize: '16px' }}>👁️</span>
              ) : (
                <span style={{ fontSize: '16px' }}>🙈</span>
              )
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {displayErrorMessage && (
        <div 
          id={errorMessageId}
          style={helperTextStyles}
          className={helperClassName}
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      )}
      
      {displayHelperText && (
        <div 
          id={helperTextId}
          style={helperTextStyles}
          className={helperClassName}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;