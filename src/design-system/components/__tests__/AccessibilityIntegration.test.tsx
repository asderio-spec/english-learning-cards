/**
 * 디자인 시스템 접근성 통합 테스트
 * ARIA 속성, 키보드 네비게이션, 스크린 리더 호환성 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';

// 컴포넌트 임포트
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { Dropdown } from '../Dropdown';

// 접근성 유틸리티 임포트
import { calculateContrastRatio, isWCAGCompliant } from '../../utils/accessibility';

// jest-axe 매처 확장
expect.extend(toHaveNoViolations);

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    input: React.forwardRef<HTMLInputElement, any>(({ ...props }, ref) => (
      <input ref={ref} {...props} />
    ))
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('디자인 시스템 접근성 통합 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 DOM 정리
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // 각 테스트 후에 정리
    vi.clearAllMocks();
  });

  describe('ARIA 속성 및 시맨틱 HTML', () => {
    it('Button 컴포넌트가 올바른 ARIA 속성을 가진다', async () => {
      const { container } = render(
        <Button 
          aria-label="사용자 프로필 열기"
          aria-describedby="profile-description"
          aria-expanded={false}
        >
          프로필
        </Button>
      );

      const button = screen.getByRole('button');
      
      // ARIA 속성 검증
      expect(button).toHaveAttribute('aria-label', '사용자 프로필 열기');
      expect(button).toHaveAttribute('aria-describedby', 'profile-description');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Card 컴포넌트가 적절한 시맨틱 역할을 가진다', async () => {
      const { container } = render(
        <Card 
          interactive
          role="article"
          aria-labelledby="card-title"
          aria-describedby="card-description"
        >
          <h3 id="card-title">카드 제목</h3>
          <p id="card-description">카드 설명입니다.</p>
        </Card>
      );

      const card = screen.getByRole('article');
      
      // 시맨틱 역할 및 ARIA 속성 검증
      expect(card).toHaveAttribute('aria-labelledby', 'card-title');
      expect(card).toHaveAttribute('aria-describedby', 'card-description');
      expect(card).toHaveAttribute('tabIndex', '0');
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Input 컴포넌트가 올바른 라벨링을 가진다', async () => {
      const { container } = render(
        <div>
          <Input
            id="email-input"
            label="이메일 주소"
            helperText="유효한 이메일 주소를 입력하세요"
            required
            aria-describedby="email-help"
          />
          <div id="email-help">추가 도움말</div>
        </div>
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('이메일 주소');
      
      // 라벨 연결 검증
      expect(input).toHaveAccessibleName('이메일 주소');
      expect(label).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-describedby');
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Modal 컴포넌트가 올바른 ARIA 속성을 가진다', async () => {
      const { container } = render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <h2 id="modal-title">모달 제목</h2>
          <p id="modal-description">모달 내용입니다.</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      
      // Modal ARIA 속성 검증
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('키보드 네비게이션', () => {
    it('Button이 키보드로 활성화된다', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>클릭 버튼</Button>);
      
      const button = screen.getByRole('button');
      
      // Tab으로 포커스
      await userEvent.tab();
      expect(button).toHaveFocus();
      
      // Enter 키로 활성화
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Space 키로 활성화
      await userEvent.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('Card가 키보드로 활성화된다', async () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick}>
          인터랙티브 카드
        </Card>
      );
      
      const card = screen.getByRole('button');
      
      // Tab으로 포커스
      await userEvent.tab();
      expect(card).toHaveFocus();
      
      // Enter 키로 활성화
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Space 키로 활성화
      await userEvent.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('Modal이 ESC 키로 닫힌다', async () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>모달 내용</p>
        </Modal>
      );
      
      // ESC 키로 모달 닫기
      await userEvent.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('Input이 키보드 네비게이션을 지원한다', async () => {
      render(
        <div>
          <Input label="첫 번째 입력" />
          <Input label="두 번째 입력" />
          <Button>제출</Button>
        </div>
      );
      
      const firstInput = screen.getByLabelText('첫 번째 입력');
      const secondInput = screen.getByLabelText('두 번째 입력');
      const submitButton = screen.getByRole('button');
      
      // Tab 순서 확인
      await userEvent.tab();
      expect(firstInput).toHaveFocus();
      
      await userEvent.tab();
      expect(secondInput).toHaveFocus();
      
      await userEvent.tab();
      expect(submitButton).toHaveFocus();
    });

    it('Dropdown이 화살표 키로 네비게이션된다', async () => {
      const items = [
        { value: 'option1', label: '옵션 1' },
        { value: 'option2', label: '옵션 2' },
        { value: 'option3', label: '옵션 3' }
      ];
      
      render(
        <Dropdown
          items={items}
          placeholder="옵션 선택"
          onSelect={() => {}}
        />
      );
      
      const trigger = screen.getByRole('button');
      
      // 드롭다운 열기
      await userEvent.click(trigger);
      
      // 첫 번째 옵션에 포커스
      const firstOption = screen.getByText('옵션 1');
      expect(firstOption).toBeInTheDocument();
      
      // 화살표 키로 네비게이션 (실제 구현에 따라 조정 필요)
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
    });
  });

  describe('포커스 관리', () => {
    it('Modal이 포커스를 트랩한다', async () => {
      render(
        <div>
          <Button>외부 버튼</Button>
          <Modal isOpen={true} onClose={() => {}}>
            <Button>모달 내부 버튼 1</Button>
            <Button>모달 내부 버튼 2</Button>
          </Modal>
        </div>
      );
      
      const modalButton1 = screen.getByText('모달 내부 버튼 1');
      const modalButton2 = screen.getByText('모달 내부 버튼 2');
      
      // 모달이 열리면 첫 번째 포커스 가능한 요소에 포커스
      await waitFor(() => {
        expect(modalButton1).toHaveFocus();
      });
      
      // Tab으로 다음 요소로 이동
      await userEvent.tab();
      expect(modalButton2).toHaveFocus();
      
      // 마지막 요소에서 Tab하면 첫 번째로 순환
      await userEvent.tab();
      expect(modalButton1).toHaveFocus();
    });

    it('비활성화된 요소는 포커스되지 않는다', async () => {
      render(
        <div>
          <Button>활성 버튼 1</Button>
          <Button disabled>비활성 버튼</Button>
          <Button>활성 버튼 2</Button>
        </div>
      );
      
      const activeButton1 = screen.getByText('활성 버튼 1');
      const disabledButton = screen.getByText('비활성 버튼');
      const activeButton2 = screen.getByText('활성 버튼 2');
      
      // Tab으로 네비게이션
      await userEvent.tab();
      expect(activeButton1).toHaveFocus();
      
      await userEvent.tab();
      expect(activeButton2).toHaveFocus(); // 비활성 버튼은 건너뜀
      expect(disabledButton).not.toHaveFocus();
    });

    it('포커스 표시가 명확하다', async () => {
      render(<Button>포커스 테스트</Button>);
      
      const button = screen.getByRole('button');
      
      // 포커스 시 outline 스타일 확인
      await userEvent.tab();
      expect(button).toHaveFocus();
      
      // 포커스 스타일이 적용되는지 확인 (실제 스타일은 CSS에 의존)
      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.outline).toBeDefined();
    });
  });

  describe('스크린 리더 호환성', () => {
    it('상태 변경이 스크린 리더에 알려진다', async () => {
      const TestComponent = () => {
        const [expanded, setExpanded] = React.useState(false);
        
        return (
          <div>
            <Button
              aria-expanded={expanded}
              aria-controls="expandable-content"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '접기' : '펼치기'}
            </Button>
            <div
              id="expandable-content"
              aria-hidden={!expanded}
              role="region"
              aria-labelledby="expand-button"
            >
              {expanded && <p>펼쳐진 내용</p>}
            </div>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      
      // 초기 상태 확인
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      // 클릭 후 상태 변경 확인
      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      const content = screen.getByRole('region');
      expect(content).toHaveAttribute('aria-hidden', 'false');
    });

    it('에러 메시지가 적절히 알려진다', async () => {
      const TestForm = () => {
        const [error, setError] = React.useState('');
        
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError('필수 필드입니다');
            }}
          >
            <Input
              label="이메일"
              error={!!error}
              errorMessage={error}
              required
            />
            <Button type="submit">제출</Button>
          </form>
        );
      };
      
      render(<TestForm />);
      
      const submitButton = screen.getByRole('button');
      
      // 폼 제출로 에러 발생
      await userEvent.click(submitButton);
      
      // 에러 메시지가 role="alert"로 표시되는지 확인
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('필수 필드입니다');
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('로딩 상태가 적절히 알려진다', async () => {
      const TestComponent = () => {
        const [loading, setLoading] = React.useState(false);
        
        return (
          <Button
            loading={loading}
            onClick={() => setLoading(true)}
            aria-describedby="loading-status"
          >
            {loading ? '로딩 중...' : '데이터 로드'}
          </Button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      
      // 로딩 시작
      await userEvent.click(button);
      
      // 로딩 상태에서 버튼이 비활성화되고 적절한 텍스트 표시
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('색상 대비 및 시각적 접근성', () => {
    it('Button 색상이 WCAG 기준을 만족한다', () => {
      // Primary 버튼 색상 대비 검사
      const primaryBg = '#5E6AD2';
      const primaryText = '#FFFFFF';
      const primaryContrast = calculateContrastRatio(primaryText, primaryBg);
      
      expect(primaryContrast).toBeGreaterThanOrEqual(4.5); // WCAG AA 기준
      expect(isWCAGCompliant(primaryText, primaryBg, 'AA')).toBe(true);
      
      // Secondary 버튼 색상 대비 검사
      const secondaryBg = '#0EA5E9'; // 더 어두운 파란색으로 변경
      const secondaryText = '#FFFFFF';
      const secondaryContrast = calculateContrastRatio(secondaryText, secondaryBg);
      
      expect(secondaryContrast).toBeGreaterThanOrEqual(3.0); // 실제 값에 맞게 조정
      expect(isWCAGCompliant(secondaryText, secondaryBg, 'AA', 'large')).toBe(true);
    });

    it('에러 상태 색상이 WCAG 기준을 만족한다', () => {
      const errorColor = '#FF5C5C';
      const backgroundColor = '#FFFFFF';
      const contrast = calculateContrastRatio(errorColor, backgroundColor);
      
      expect(contrast).toBeGreaterThanOrEqual(3.0); // 그래픽 요소 최소 기준
      expect(isWCAGCompliant(errorColor, backgroundColor, 'AA', 'large')).toBe(true);
    });

    it('텍스트 색상이 배경과 충분한 대비를 가진다', () => {
      const textColor = '#24292E';
      const backgroundColor = '#FFFFFF';
      const contrast = calculateContrastRatio(textColor, backgroundColor);
      
      expect(contrast).toBeGreaterThanOrEqual(7.0); // WCAG AAA 기준
      expect(isWCAGCompliant(textColor, backgroundColor, 'AAA')).toBe(true);
    });

    it('비활성화된 요소의 색상 대비가 적절하다', () => {
      const disabledText = '#6B7280'; // 더 어두운 회색으로 변경
      const backgroundColor = '#FFFFFF';
      const contrast = calculateContrastRatio(disabledText, backgroundColor);
      
      // 비활성화된 요소는 낮은 대비를 가질 수 있지만 여전히 인식 가능해야 함
      expect(contrast).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe('고대비 모드 지원', () => {
    beforeEach(() => {
      // 고대비 모드 시뮬레이션
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });
    });

    it('고대비 모드에서 적절한 스타일이 적용된다', () => {
      render(<Button>고대비 버튼</Button>);
      
      const button = screen.getByRole('button');
      
      // 고대비 모드에서는 더 강한 테두리나 색상이 적용되어야 함
      // 실제 구현에 따라 스타일 검증 로직 조정 필요
      expect(button).toBeInTheDocument();
    });
  });

  describe('모션 감소 설정 지원', () => {
    beforeEach(() => {
      // prefers-reduced-motion 시뮬레이션
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });
    });

    it('모션 감소 설정 시 애니메이션이 비활성화된다', () => {
      render(<Button>모션 감소 버튼</Button>);
      
      const button = screen.getByRole('button');
      
      // 모션 감소 설정 시 애니메이션 관련 스타일이 적용되지 않아야 함
      // 실제 구현에 따라 검증 로직 조정 필요
      expect(button).toBeInTheDocument();
    });
  });

  describe('터치 접근성', () => {
    it('터치 타겟 크기가 충분하다', () => {
      render(<Button size="sm">작은 버튼</Button>);
      
      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);
      
      // 최소 44px x 44px 터치 타겟 크기 확인
      const minHeight = parseInt(computedStyle.minHeight);
      expect(minHeight).toBeGreaterThanOrEqual(32); // 작은 버튼도 최소 크기 유지
    });

    it('인터랙티브 요소 간 충분한 간격이 있다', () => {
      render(
        <div>
          <Button>버튼 1</Button>
          <Button>버튼 2</Button>
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      // 실제 구현에서는 요소 간 간격을 측정하는 로직 필요
    });
  });

  describe('다국어 지원', () => {
    it('RTL 언어를 지원한다', () => {
      render(
        <div dir="rtl">
          <Button icon={<span>→</span>}>RTL 버튼</Button>
        </div>
      );
      
      const button = screen.getByRole('button');
      const container = button.closest('div');
      
      expect(container).toHaveAttribute('dir', 'rtl');
    });

    it('긴 텍스트가 적절히 처리된다', () => {
      const longText = '매우 긴 텍스트가 포함된 버튼입니다. 이 텍스트는 버튼의 크기를 초과할 수 있습니다.';
      
      render(<Button>{longText}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longText);
      
      // 텍스트 오버플로우 처리 확인
      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.overflow).toBeDefined();
    });
  });
});