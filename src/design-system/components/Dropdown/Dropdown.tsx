import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { 
  useReducedMotion,
  dropdownVariants
} from '../../tokens/animationUtils';

export interface DropdownItem {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  /** 드롭다운 아이템 목록 */
  items: DropdownItem[];
  /** 선택된 값 */
  value?: any;
  /** 값 변경 콜백 */
  onChange?: (value: any, item: DropdownItem) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 접근성 라벨 */
  'aria-label'?: string;
  /** 설명 텍스트 ID */
  'aria-describedby'?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  fullWidth = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const reducedMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 선택된 아이템 찾기
  const selectedItem = items.find(item => item.value === value);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 키보드 네비게이션
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          const item = items[focusedIndex];
          if (!item.disabled) {
            onChange?.(item.value, item);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          const nextIndex = Math.min(focusedIndex + 1, items.length - 1);
          setFocusedIndex(nextIndex);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
        }
        break;
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    onChange?.(item.value, item);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  const triggerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: fullWidth ? '100%' : 'auto',
    minWidth: '200px',
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: '#FFFFFF',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: '8px',
    fontSize: typography.body.small.fontSize,
    fontFamily: typography.fontFamily.sans.join(', '),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'border-color 0.2s ease',
    '&:focus': {
      outline: `2px solid ${colors.primary[500]}`,
      outlineOffset: '2px',
      borderColor: colors.primary[500]
    },
    '&:hover:not(:disabled)': {
      borderColor: colors.neutral[300]
    }
  };

  const dropdownStyles = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: '#FFFFFF',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto' as const
  };

  const itemStyles = (item: DropdownItem, index: number) => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[4]}`,
    fontSize: typography.body.small.fontSize,
    color: item.disabled ? colors.neutral[400] : colors.neutral[700],
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    backgroundColor: focusedIndex === index ? colors.neutral[50] : 'transparent',
    borderBottom: index < items.length - 1 ? `1px solid ${colors.neutral[100]}` : 'none',
    '&:hover': {
      backgroundColor: !item.disabled ? colors.neutral[50] : 'transparent'
    }
  });

  return (
    <div 
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        ref={triggerRef}
        type="button"
        style={triggerStyles}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span style={{ 
          color: selectedItem ? colors.neutral[700] : colors.neutral[400] 
        }}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reducedMotion ? 0.001 : 0.2 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '12px',
            color: colors.neutral[500]
          }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={dropdownStyles}
            variants={reducedMotion ? undefined : dropdownVariants}
            initial={reducedMotion ? undefined : "initial"}
            animate={reducedMotion ? undefined : "animate"}
            exit={reducedMotion ? undefined : "exit"}
            transition={{
              duration: reducedMotion ? 0.001 : 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            role="listbox"
            aria-label="드롭다운 옵션"
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                style={itemStyles(item, index)}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setFocusedIndex(index)}
                role="option"
                aria-selected={item.value === value}
                aria-disabled={item.disabled}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;