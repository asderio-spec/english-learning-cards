# Linear Design System

Linear 스타일의 모던하고 접근성을 고려한 디자인 시스템입니다.

## 📋 목차

- [시작하기](#시작하기)
- [디자인 토큰](#디자인-토큰)
- [컴포넌트](#컴포넌트)
- [테마 시스템](#테마-시스템)
- [접근성](#접근성)
- [성능](#성능)

## 🚀 시작하기

### 설치

```bash
npm install @your-org/linear-design-system
```

### 기본 사용법

```tsx
import React from 'react';
import { ThemeProvider, Button, Card } from '@your-org/linear-design-system';
import '@your-org/linear-design-system/dist/styles.css';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <h1>안녕하세요!</h1>
        <Button variant="primary">시작하기</Button>
      </Card>
    </ThemeProvider>
  );
}
```

## 🎨 디자인 토큰

디자인 토큰은 디자인 시스템의 핵심 구성 요소입니다. 색상, 타이포그래피, 간격, 애니메이션 등의 디자인 결정사항을 코드로 표현합니다.

### 색상 토큰

```tsx
import { colors } from '@your-org/linear-design-system/tokens';

// 기본 색상
colors.primary[500]    // #5E6AD2
colors.secondary[500]  // #00D2FF
colors.neutral[900]    // #24292E

// 시맨틱 색상
colors.success[500]    // #00C896
colors.warning[500]    // #FF6B35
colors.error[500]      // #FF5C5C
```

### 타이포그래피 토큰

```tsx
import { typography } from '@your-org/linear-design-system/tokens';

// 헤딩
typography.heading.large    // 32px, 700 weight
typography.heading.medium   // 24px, 600 weight
typography.heading.small    // 20px, 600 weight

// 본문
typography.body.large       // 18px, 400 weight
typography.body.medium      // 16px, 400 weight
typography.body.small       // 14px, 400 weight
```

### 간격 토큰

```tsx
import { spacing } from '@your-org/linear-design-system/tokens';

spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing['2xl'] // 48px
```

## 🧩 컴포넌트

### Button

다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다.

```tsx
import { Button } from '@your-org/linear-design-system';

// 기본 사용법
<Button>클릭하세요</Button>

// 변형
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>

// 크기
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// 상태
<Button loading>로딩 중...</Button>
<Button disabled>비활성화</Button>

// 아이콘
<Button icon={<Icon />}>아이콘 버튼</Button>
<Button iconRight={<Icon />}>오른쪽 아이콘</Button>
```

### Card

콘텐츠를 그룹화하는 카드 컴포넌트입니다.

```tsx
import { Card } from '@your-org/linear-design-system';

// 기본 사용법
<Card>
  <h3>카드 제목</h3>
  <p>카드 내용입니다.</p>
</Card>

// 변형
<Card variant="default">기본 카드</Card>
<Card variant="elevated">그림자 카드</Card>
<Card variant="outlined">테두리 카드</Card>

// 패딩
<Card padding="sm">작은 패딩</Card>
<Card padding="md">중간 패딩</Card>
<Card padding="lg">큰 패딩</Card>

// 인터랙티브
<Card interactive onClick={handleClick}>
  클릭 가능한 카드
</Card>
```

### Input

사용자 입력을 받는 입력 필드 컴포넌트입니다.

```tsx
import { Input } from '@your-org/linear-design-system';

// 기본 사용법
<Input 
  label="이메일"
  placeholder="이메일을 입력하세요"
  value={email}
  onChange={setEmail}
/>

// 타입
<Input type="text" label="텍스트" />
<Input type="email" label="이메일" />
<Input type="password" label="비밀번호" />
<Input type="search" label="검색" />

// 상태
<Input error errorMessage="필수 입력 항목입니다" />
<Input disabled />

// 도움말
<Input 
  label="사용자명"
  helperText="3-20자의 영문, 숫자만 사용 가능합니다"
/>

// 아이콘
<Input 
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>
```

## 🎭 테마 시스템

라이트 모드와 다크 모드를 지원하는 테마 시스템입니다.

### ThemeProvider 사용법

```tsx
import { ThemeProvider } from '@your-org/linear-design-system';

function App() {
  return (
    <ThemeProvider>
      {/* 앱 컨텐츠 */}
    </ThemeProvider>
  );
}
```

### 테마 훅 사용법

```tsx
import { useTheme } from '@your-org/linear-design-system';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {theme.mode === 'dark' ? '라이트 모드' : '다크 모드'}
    </Button>
  );
}
```

### 커스텀 테마

```tsx
const customTheme = {
  colors: {
    primary: {
      50: '#f0f4ff',
      500: '#6366f1',
      900: '#312e81',
    },
  },
};

<ThemeProvider theme={customTheme}>
  {/* 앱 컨텐츠 */}
</ThemeProvider>
```

## ♿ 접근성

모든 컴포넌트는 WCAG 2.1 AA 기준을 준수합니다.

### 키보드 네비게이션

- **Tab**: 다음 포커스 가능한 요소로 이동
- **Shift + Tab**: 이전 포커스 가능한 요소로 이동
- **Enter/Space**: 버튼 및 인터랙티브 요소 활성화
- **Escape**: 모달, 드롭다운 등 닫기

### 스크린 리더 지원

```tsx
// ARIA 라벨 사용
<Button aria-label="메뉴 열기">☰</Button>

// 설명 텍스트 연결
<Input 
  aria-describedby="password-help"
  helperText="8자 이상의 비밀번호를 입력하세요"
/>

// 상태 알림
<div role="status" aria-live="polite">
  저장되었습니다.
</div>
```

### 색상 대비

모든 텍스트와 배경의 색상 대비는 WCAG AA 기준(4.5:1) 이상을 만족합니다.

```tsx
import { calculateContrastRatio, isWCAGCompliant } from '@your-org/linear-design-system/utils';

// 색상 대비 확인
const ratio = calculateContrastRatio('#ffffff', '#5e6ad2');
const isCompliant = isWCAGCompliant('#ffffff', '#5e6ad2', 'AA');
```

## ⚡ 성능

### 코드 분할

```tsx
import { lazy } from 'react';

// 지연 로딩
const Modal = lazy(() => import('@your-org/linear-design-system/Modal'));
const Dropdown = lazy(() => import('@your-org/linear-design-system/Dropdown'));
```

### 트리 셰이킹

```tsx
// ✅ 권장: 개별 임포트
import { Button } from '@your-org/linear-design-system/Button';
import { Card } from '@your-org/linear-design-system/Card';

// ❌ 비권장: 전체 임포트
import { Button, Card } from '@your-org/linear-design-system';
```

### 메모이제이션

```tsx
import { memo } from 'react';

// 컴포넌트 메모이제이션
const OptimizedCard = memo(Card);

// Props 비교 함수 사용
const OptimizedButton = memo(Button, (prevProps, nextProps) => {
  return prevProps.variant === nextProps.variant;
});
```

## 📱 반응형 디자인

### 브레이크포인트

```tsx
const breakpoints = {
  mobile: '0px',      // 0px - 767px
  tablet: '768px',    // 768px - 1023px
  desktop: '1024px',  // 1024px+
};
```

### 반응형 훅

```tsx
import { useBreakpoint, useMediaQuery } from '@your-org/linear-design-system/hooks';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  return (
    <div>
      <p>현재 브레이크포인트: {breakpoint}</p>
      {isMobile && <p>모바일 화면입니다</p>}
    </div>
  );
}
```

## 🎬 애니메이션

### 애니메이션 토큰

```tsx
import { animations } from '@your-org/linear-design-system/tokens';

animations.duration.fast    // 150ms
animations.duration.normal  // 300ms
animations.duration.slow    // 500ms

animations.easing.easeIn    // cubic-bezier(0.4, 0, 1, 1)
animations.easing.easeOut   // cubic-bezier(0, 0, 0.2, 1)
animations.easing.easeInOut // cubic-bezier(0.4, 0, 0.2, 1)
```

### 모션 감소 지원

```tsx
import { useReducedMotion } from '@your-org/linear-design-system/hooks';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.3 
      }}
    >
      콘텐츠
    </motion.div>
  );
}
```

## 🔧 개발 도구

### TypeScript 지원

모든 컴포넌트는 완전한 TypeScript 타입 정의를 제공합니다.

```tsx
import type { ButtonProps, CardProps } from '@your-org/linear-design-system';

interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

### 개발 모드 경고

개발 모드에서는 접근성 및 성능 관련 경고를 제공합니다.

```tsx
// 개발 모드에서만 실행되는 검증
if (process.env.NODE_ENV === 'development') {
  console.warn('Button에 aria-label이 없습니다.');
}
```

## 📚 추가 리소스

- [Storybook 문서](./storybook)
- [접근성 가이드](./accessibility-guide.md)
- [디자인 토큰 가이드](./design-tokens-guide.md)
- [마이그레이션 가이드](./migration-guide.md)
- [기여 가이드](./contributing.md)

## 🤝 기여하기

버그 리포트, 기능 요청, 풀 리퀘스트를 환영합니다!

1. 이슈를 먼저 확인해주세요
2. 포크 후 브랜치를 생성하세요
3. 변경사항을 커밋하세요
4. 테스트를 실행하세요
5. 풀 리퀘스트를 생성하세요

## 📄 라이선스

MIT License