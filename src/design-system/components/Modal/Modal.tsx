import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing, componentSpacing } from '../../tokens/spacing';
import { 
  useReducedMotion,
  modalVariants
} from '../../tokens/animationUtils';

export interface ModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 배경 클릭으로 닫기 비활성화 */
  disableBackdropClose?: boolean;
  /** ESC 키로 닫기 비활성화 */
  disableEscapeClose?: boolean;
  /** 접근성 라벨 */
  'aria-label'?: string;
  /** 설명 텍스트 ID */
  'aria-describedby'?: string;
  /** 모달 내용 */
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  disableBackdropClose = false,
  disableEscapeClose = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  children
}) => {
  const reducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 모달 크기 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          maxWidth: '400px',
          width: '90vw'
        };
      case 'md':
        return {
          maxWidth: '500px',
          width: '90vw'
        };
      case 'lg':
        return {
          maxWidth: '700px',
          width: '90vw'
        };
      case 'xl':
        return {
          maxWidth: '900px',
          width: '95vw'
        };
      default:
        return {
          maxWidth: '500px',
          width: '90vw'
        };
    }
  };

  // ESC 키 처리
  useEffect(() => {
    if (!isOpen || disableEscapeClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, disableEscapeClose, onClose]);

  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // 모달에 포커스 설정
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // 모달이 닫힐 때 이전 포커스 복원
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // 배경 클릭 처리
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (disableBackdropClose) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 포커스 트랩
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const backdropStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    zIndex: 1000
  };

  const modalStyles = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative' as const,
    outline: 'none',
    ...getSizeStyles()
  };

  const headerStyles = {
    padding: `${componentSpacing.modal.header.y} ${componentSpacing.modal.header.x}`,
    borderBottom: `1px solid ${colors.neutral[100]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const titleStyles = {
    fontSize: typography.heading.large.fontSize,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: colors.neutral[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px'
  };

  const contentStyles = {
    padding: componentSpacing.modal.content,
    maxHeight: '70vh',
    overflowY: 'auto' as const
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={backdropStyles}
          onClick={handleBackdropClick}
          variants={reducedMotion ? undefined : modalVariants.backdrop}
          initial={reducedMotion ? undefined : "initial"}
          animate={reducedMotion ? undefined : "animate"}
          exit={reducedMotion ? undefined : "exit"}
          transition={{
            duration: reducedMotion ? 0.001 : 0.2
          }}
        >
          <motion.div
            ref={modalRef}
            style={modalStyles}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-describedby={ariaDescribedBy}
            variants={reducedMotion ? undefined : modalVariants.modal}
            initial={reducedMotion ? undefined : "initial"}
            animate={reducedMotion ? undefined : "animate"}
            exit={reducedMotion ? undefined : "exit"}
            transition={{
              duration: reducedMotion ? 0.001 : 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {title && (
              <div style={headerStyles}>
                <h2 style={titleStyles}>{title}</h2>
                <button
                  style={closeButtonStyles}
                  onClick={onClose}
                  aria-label="모달 닫기"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}
            
            <div style={contentStyles}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;