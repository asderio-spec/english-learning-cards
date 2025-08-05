# 기여 가이드

Linear Design System에 기여해 주셔서 감사합니다! 이 가이드는 프로젝트에 효과적으로 기여하는 방법을 안내합니다.

## 📋 목차

- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [코드 스타일](#코드-스타일)
- [컴포넌트 개발](#컴포넌트-개발)
- [테스트 작성](#테스트-작성)
- [문서화](#문서화)
- [Pull Request](#pull-request)
- [리뷰 프로세스](#리뷰-프로세스)

## 🤝 기여 방법

### 기여할 수 있는 영역

- **🐛 버그 수정**: 이슈 트래커에서 버그 리포트 확인 후 수정
- **✨ 새 기능**: 새로운 컴포넌트나 기능 추가
- **📚 문서화**: 사용법, API 문서, 예제 개선
- **🧪 테스트**: 테스트 커버리지 향상
- **♿ 접근성**: 접근성 개선 및 WCAG 준수
- **🎨 디자인**: 디자인 토큰, 스타일 개선
- **⚡ 성능**: 성능 최적화 및 번들 크기 개선

### 기여 전 확인사항

1. [이슈 트래커](https://github.com/your-org/linear-design-system/issues)에서 중복 이슈 확인
2. [로드맵](https://github.com/your-org/linear-design-system/projects)에서 계획된 작업 확인
3. 큰 변경사항은 먼저 이슈로 논의

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상
- Git

### 프로젝트 설정

```bash
# 저장소 포크 및 클론
git clone https://github.com/your-username/linear-design-system.git
cd linear-design-system

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# Storybook 실행
npm run storybook

# 테스트 실행
npm test
```

### 브랜치 전략

```bash
# 새 기능 개발
git checkout -b feature/button-loading-state

# 버그 수정
git checkout -b fix/modal-focus-trap

# 문서 개선
git checkout -b docs/accessibility-guide

# 성능 개선
git checkout -b perf/bundle-size-optimization
```

## 📝 코드 스타일

### ESLint 및 Prettier

프로젝트는 ESLint와 Prettier를 사용합니다.

```bash
# 린트 검사
npm run lint

# 자동 수정
npm run lint:fix

# 포맷팅
npm run format
```

### TypeScript 가이드라인

```tsx
// ✅ 올바른 타입 정의
interface ButtonProps {
  /** 버튼의 시각적 스타일 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 상태 */
  loading?: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 버튼 내용 */
  children: ReactNode;
}

// ✅ 제네릭 사용
interface SelectProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  getItemLabel: (item: T) => string;
}

// ❌ any 타입 사용 금지
interface BadProps {
  data: any; // 사용 금지
  callback: (...args: any[]) => any; // 사용 금지
}
```

### 네이밍 컨벤션

```tsx
// 컴포넌트: PascalCase
export const Button = () => {};
export const UserProfile = () => {};

// 훅: camelCase with 'use' prefix
export const useTheme = () => {};
export const useKeyboardNavigation = () => {};

// 유틸리티 함수: camelCase
export const calculateContrastRatio = () => {};
export const formatCurrency = () => {};

// 상수: SCREAMING_SNAKE_CASE
export const DEFAULT_THEME = {};
export const BREAKPOINT_VALUES = {};

// 타입/인터페이스: PascalCase
export interface ButtonProps {}
export type ThemeMode = 'light' | 'dark';
```

## 🧩 컴포넌트 개발

### 컴포넌트 구조

```
src/design-system/components/Button/
├── index.ts              # 내보내기
├── Button.tsx            # 메인 컴포넌트
├── Button.stories.tsx    # Storybook 스토리
├── __tests__/
│   ├── Button.test.tsx   # 단위 테스트
│   └── Button.a11y.test.tsx # 접근성 테스트
└── README.md            # 컴포넌트 문서
```

### 컴포넌트 템플릿

```tsx
// Button.tsx
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

export interface ButtonProps 
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 버튼의 시각적 스타일 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 상태 */
  loading?: boolean;
  /** HTML 버튼 타입 */
  type?: 'button' | 'submit' | 'reset';
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 왼쪽 아이콘 */
  icon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  iconRight?: React.ReactNode;
}

/**
 * 사용자 액션을 트리거하는 버튼 컴포넌트
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   클릭하세요
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      type = 'button',
      fullWidth = false,
      icon,
      iconRight,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const { theme } = useTheme();
    
    // 스타일 계산
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all';
    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      ghost: 'bg-transparent text-primary-500 hover:bg-primary-50'
    };
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-sm min-h-[40px]',
      lg: 'px-6 py-3 text-base min-h-[48px]'
    };
    
    const isDisabled = disabled || loading;
    
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-60 cursor-not-allowed',
          className
        )}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        aria-disabled={isDisabled}
        {...rest}
      >
        {loading && <LoadingSpinner />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
        {!loading && iconRight && <span className="ml-2">{iconRight}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
```

### 접근성 고려사항

```tsx
// ✅ 접근성 모범 사례
export const AccessibleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? 'loading-text' : undefined}
        {...rest}
      >
        {loading && (
          <>
            <LoadingSpinner aria-hidden="true" />
            <span id="loading-text" className="sr-only">
              로딩 중
            </span>
          </>
        )}
        {children}
      </button>
    );
  }
);
```

## 🧪 테스트 작성

### 테스트 구조

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  describe('렌더링', () => {
    it('기본 props로 렌더링된다', () => {
      render(<Button>클릭하세요</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('variant에 따라 올바른 스타일이 적용된다', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
    });
  });

  describe('상호작용', () => {
    it('클릭 이벤트가 올바르게 처리된다', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>클릭</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('키보드로 활성화된다', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>클릭</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    it('적절한 ARIA 속성을 가진다', () => {
      render(<Button disabled>비활성</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('로딩 상태가 스크린 리더에 전달된다', () => {
      render(<Button loading>저장 중</Button>);
      expect(screen.getByText('로딩 중')).toBeInTheDocument();
    });
  });
});
```

### 접근성 테스트

```tsx
// Button.a11y.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button 접근성', () => {
  it('axe 위반사항이 없다', async () => {
    const { container } = render(
      <Button onClick={() => {}}>접근성 테스트</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('키보드 네비게이션이 가능하다', () => {
    render(<Button>키보드 테스트</Button>);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
  });
});
```

## 📚 문서화

### JSDoc 주석

```tsx
/**
 * 사용자 액션을 트리거하는 버튼 컴포넌트
 * 
 * @example
 * ```tsx
 * // 기본 사용법
 * <Button onClick={handleClick}>클릭하세요</Button>
 * 
 * // 로딩 상태
 * <Button loading>저장 중...</Button>
 * 
 * // 아이콘과 함께
 * <Button icon={<PlusIcon />}>추가</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  /**
   * @param variant - 버튼의 시각적 스타일
   * @param size - 버튼 크기
   * @param loading - 로딩 상태 표시
   * @param disabled - 비활성화 상태
   * @param children - 버튼 내용
   */
  ({ variant = 'primary', size = 'md', loading, disabled, children, ...rest }, ref) => {
    // 구현...
  }
);
```

### Storybook 스토리

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { PlusIcon } from '@heroicons/react/24/outline';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: '사용자 액션을 트리거하는 버튼 컴포넌트입니다.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: '기본 버튼'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
};

export const WithIcon: Story = {
  args: {
    icon: <PlusIcon className="w-4 h-4" />,
    children: '추가하기'
  }
};

export const Loading: Story = {
  args: {
    loading: true,
    children: '저장 중...'
  }
};
```

## 🔄 Pull Request

### PR 체크리스트

- [ ] 코드가 ESLint 규칙을 준수하는가?
- [ ] 모든 테스트가 통과하는가?
- [ ] 새로운 기능에 대한 테스트가 작성되었는가?
- [ ] 접근성 테스트가 포함되었는가?
- [ ] Storybook 스토리가 작성되었는가?
- [ ] 문서가 업데이트되었는가?
- [ ] 변경사항이 CHANGELOG에 기록되었는가?

### PR 템플릿

```markdown
## 변경사항 요약
<!-- 이 PR에서 변경된 내용을 간단히 설명해주세요 -->

## 변경 유형
- [ ] 버그 수정
- [ ] 새 기능
- [ ] 문서 개선
- [ ] 성능 개선
- [ ] 리팩토링
- [ ] 테스트 추가

## 테스트
<!-- 어떤 테스트를 수행했는지 설명해주세요 -->
- [ ] 단위 테스트 추가/수정
- [ ] 접근성 테스트 확인
- [ ] 브라우저 테스트 완료
- [ ] 스크린 리더 테스트 완료

## 스크린샷
<!-- UI 변경사항이 있다면 스크린샷을 첨부해주세요 -->

## 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] 문서 업데이트 완료
- [ ] 테스트 커버리지 확인
- [ ] 접근성 가이드라인 준수
```

### 커밋 메시지 규칙

```bash
# 형식: type(scope): description

# 예시
feat(button): add loading state support
fix(modal): resolve focus trap issue
docs(readme): update installation guide
test(card): add accessibility tests
perf(bundle): optimize component imports
```

## 👥 리뷰 프로세스

### 리뷰 기준

1. **기능성**: 요구사항을 올바르게 구현했는가?
2. **코드 품질**: 읽기 쉽고 유지보수 가능한가?
3. **성능**: 성능에 부정적 영향을 주지 않는가?
4. **접근성**: WCAG 2.1 AA 기준을 만족하는가?
5. **테스트**: 충분한 테스트 커버리지를 가지는가?
6. **문서**: 적절한 문서화가 되어 있는가?

### 리뷰어 가이드

```markdown
## 코드 리뷰 체크리스트

### 기능성
- [ ] 요구사항이 올바르게 구현되었는가?
- [ ] 엣지 케이스가 고려되었는가?
- [ ] 에러 처리가 적절한가?

### 코드 품질
- [ ] 코드가 읽기 쉬운가?
- [ ] 네이밍이 명확한가?
- [ ] 중복 코드가 없는가?
- [ ] 타입 정의가 정확한가?

### 성능
- [ ] 불필요한 리렌더링이 없는가?
- [ ] 메모리 누수 가능성이 없는가?
- [ ] 번들 크기에 미치는 영향이 적절한가?

### 접근성
- [ ] 키보드 네비게이션이 가능한가?
- [ ] 스크린 리더 호환성이 있는가?
- [ ] 색상 대비가 충분한가?
- [ ] ARIA 속성이 올바른가?

### 테스트
- [ ] 단위 테스트가 충분한가?
- [ ] 접근성 테스트가 포함되었는가?
- [ ] 통합 테스트가 필요한가?
```

## 🏷️ 이슈 라벨

| 라벨 | 설명 |
|------|------|
| `bug` | 버그 리포트 |
| `feature` | 새 기능 요청 |
| `enhancement` | 기존 기능 개선 |
| `documentation` | 문서 관련 |
| `accessibility` | 접근성 관련 |
| `performance` | 성능 관련 |
| `good first issue` | 초보자에게 적합한 이슈 |
| `help wanted` | 도움이 필요한 이슈 |
| `priority: high` | 높은 우선순위 |
| `priority: low` | 낮은 우선순위 |

## 🎯 기여 목표

### 단기 목표 (1-3개월)
- [ ] 모든 컴포넌트 WCAG 2.1 AA 준수
- [ ] 테스트 커버리지 90% 이상
- [ ] Storybook 문서 완성
- [ ] 성능 최적화

### 장기 목표 (6-12개월)
- [ ] 다국어 지원
- [ ] 모바일 최적화
- [ ] 고급 애니메이션
- [ ] 테마 시스템 확장

## 🙏 감사의 말

Linear Design System에 기여해 주시는 모든 분들께 감사드립니다. 여러분의 기여가 더 나은 사용자 경험을 만들어 갑니다.

### 기여자 인정

- 모든 기여자는 README의 Contributors 섹션에 추가됩니다
- 주요 기여자는 릴리스 노트에 언급됩니다
- 연간 기여자 시상 프로그램 운영

## 📞 문의

궁금한 점이 있으시면 언제든 연락주세요:

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **GitHub Discussions**: 일반적인 질문 및 토론
- **Discord**: 실시간 채팅 및 커뮤니티
- **이메일**: design-system@your-org.com

함께 더 나은 디자인 시스템을 만들어 나가요! 🚀