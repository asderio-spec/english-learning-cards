# 디자인 토큰 가이드

디자인 토큰은 디자인 시스템의 핵심 구성 요소로, 색상, 타이포그래피, 간격, 애니메이션 등의 디자인 결정사항을 코드로 표현합니다.

## 📋 목차

- [디자인 토큰이란?](#디자인-토큰이란)
- [색상 토큰](#색상-토큰)
- [타이포그래피 토큰](#타이포그래피-토큰)
- [간격 토큰](#간격-토큰)
- [애니메이션 토큰](#애니메이션-토큰)
- [사용 방법](#사용-방법)
- [커스터마이징](#커스터마이징)

## 🎨 디자인 토큰이란?

디자인 토큰은 디자인 시스템에서 사용되는 시각적 속성의 이름-값 쌍입니다. 이를 통해 일관성 있는 디자인을 유지하고, 변경사항을 효율적으로 관리할 수 있습니다.

### 장점

- **일관성**: 모든 컴포넌트에서 동일한 값 사용
- **유지보수성**: 한 곳에서 값을 변경하면 전체에 적용
- **확장성**: 새로운 토큰을 쉽게 추가 가능
- **협업**: 디자이너와 개발자 간 공통 언어 제공

## 🌈 색상 토큰

### 기본 색상 팔레트

```tsx
import { colors } from '@your-org/linear-design-system/tokens';

// Primary 색상 (파란색 계열)
colors.primary[50]   // #F0F4FF - 매우 연한 파란색
colors.primary[100]  // #E0E7FF - 연한 파란색
colors.primary[200]  // #C7D2FE - 밝은 파란색
colors.primary[300]  // #A5B4FC - 중간 밝은 파란색
colors.primary[400]  // #818CF8 - 중간 파란색
colors.primary[500]  // #5E6AD2 - 기본 파란색 (브랜드 컬러)
colors.primary[600]  // #4F46E5 - 진한 파란색
colors.primary[700]  // #4338CA - 더 진한 파란색
colors.primary[800]  // #3730A3 - 매우 진한 파란색
colors.primary[900]  // #312E81 - 가장 진한 파란색

// Secondary 색상 (청록색 계열)
colors.secondary[50]  // #F0FDFA
colors.secondary[500] // #00D2FF - 기본 청록색
colors.secondary[900] // #003D47

// Neutral 색상 (회색 계열)
colors.neutral[50]   // #FAFAFA - 매우 연한 회색
colors.neutral[100]  // #F5F5F5 - 연한 회색
colors.neutral[200]  // #E5E5E5 - 밝은 회색
colors.neutral[300]  // #D4D4D4 - 중간 밝은 회색
colors.neutral[400]  // #A3A3A3 - 중간 회색
colors.neutral[500]  // #737373 - 기본 회색
colors.neutral[600]  // #525252 - 진한 회색
colors.neutral[700]  // #404040 - 더 진한 회색
colors.neutral[800]  // #262626 - 매우 진한 회색
colors.neutral[900]  // #171717 - 가장 진한 회색
```

### 시맨틱 색상

```tsx
// 성공 (초록색 계열)
colors.success[50]   // #F0FDF4
colors.success[500]  // #00C896 - 성공 메시지
colors.success[900]  // #14532D

// 경고 (주황색 계열)
colors.warning[50]   // #FFFBEB
colors.warning[500]  // #FF6B35 - 경고 메시지
colors.warning[900]  // #92400E

// 오류 (빨간색 계열)
colors.error[50]     // #FEF2F2
colors.error[500]    // #FF5C5C - 오류 메시지
colors.error[900]    // #991B1B

// 정보 (파란색 계열)
colors.info[50]      // #EFF6FF
colors.info[500]     // #3B82F6 - 정보 메시지
colors.info[900]     // #1E3A8A
```

### 색상 사용 가이드라인

#### 언제 어떤 색상을 사용할까?

**Primary (파란색)**
- 주요 액션 버튼 (저장, 제출, 확인)
- 링크 텍스트
- 활성 상태 표시
- 브랜드 요소

```tsx
// ✅ 올바른 사용
<Button variant="primary">저장</Button>
<a href="#" className="text-primary-500">더 보기</a>

// ❌ 잘못된 사용 - 너무 많은 primary 색상
<div className="bg-primary-500">
  <Button variant="primary">버튼 1</Button>
  <Button variant="primary">버튼 2</Button>
  <Button variant="primary">버튼 3</Button>
</div>
```

**Secondary (청록색)**
- 보조 액션 버튼
- 강조하고 싶은 정보
- 장식적 요소

**Neutral (회색)**
- 텍스트 (제목, 본문, 캡션)
- 배경색
- 테두리
- 비활성 상태

**시맨틱 색상**
- Success: 성공 메시지, 완료 상태
- Warning: 주의 메시지, 경고 상태
- Error: 오류 메시지, 실패 상태
- Info: 정보 메시지, 도움말

## ✍️ 타이포그래피 토큰

### 폰트 크기 및 스타일

```tsx
import { typography } from '@your-org/linear-design-system/tokens';

// Display (가장 큰 제목)
typography.display.large = {
  fontSize: '48px',
  lineHeight: '56px',
  fontWeight: 700,
  letterSpacing: '-0.02em'
}

typography.display.medium = {
  fontSize: '40px',
  lineHeight: '48px',
  fontWeight: 700,
  letterSpacing: '-0.02em'
}

typography.display.small = {
  fontSize: '32px',
  lineHeight: '40px',
  fontWeight: 700,
  letterSpacing: '-0.01em'
}

// Heading (섹션 제목)
typography.heading.large = {
  fontSize: '32px',
  lineHeight: '40px',
  fontWeight: 700,
  letterSpacing: '-0.01em'
}

typography.heading.medium = {
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 600,
  letterSpacing: '-0.01em'
}

typography.heading.small = {
  fontSize: '20px',
  lineHeight: '28px',
  fontWeight: 600,
  letterSpacing: '0em'
}

// Body (본문 텍스트)
typography.body.large = {
  fontSize: '18px',
  lineHeight: '28px',
  fontWeight: 400,
  letterSpacing: '0em'
}

typography.body.medium = {
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 400,
  letterSpacing: '0em'
}

typography.body.small = {
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
  letterSpacing: '0em'
}

// Caption (작은 텍스트)
typography.caption.large = {
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 500,
  letterSpacing: '0.01em'
}

typography.caption.medium = {
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 500,
  letterSpacing: '0.01em'
}

typography.caption.small = {
  fontSize: '10px',
  lineHeight: '12px',
  fontWeight: 500,
  letterSpacing: '0.02em'
}
```

### 폰트 가중치

```tsx
typography.fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
}
```

### 타이포그래피 사용 가이드라인

```tsx
// ✅ 올바른 사용 - 계층 구조 명확
<article>
  <h1 className="text-display-large">메인 제목</h1>
  <h2 className="text-heading-large">섹션 제목</h2>
  <p className="text-body-medium">본문 내용입니다.</p>
  <span className="text-caption-small">작은 정보</span>
</article>

// ❌ 잘못된 사용 - 계층 구조 혼란
<article>
  <h1 className="text-body-small">메인 제목</h1>
  <p className="text-display-large">본문 내용</p>
</article>
```

## 📏 간격 토큰

### 간격 스케일

```tsx
import { spacing } from '@your-org/linear-design-system/tokens';

spacing.xs   = '4px'   // 0.25rem
spacing.sm   = '8px'   // 0.5rem
spacing.md   = '16px'  // 1rem
spacing.lg   = '24px'  // 1.5rem
spacing.xl   = '32px'  // 2rem
spacing['2xl'] = '48px'  // 3rem
spacing['3xl'] = '64px'  // 4rem
spacing['4xl'] = '80px'  // 5rem
spacing['5xl'] = '96px'  // 6rem
```

### 간격 사용 가이드라인

#### 컴포넌트 내부 간격 (Padding)

```tsx
// ✅ 올바른 사용
<Card className="p-md">     {/* 16px 패딩 */}
  <h3 className="mb-sm">제목</h3>  {/* 8px 하단 마진 */}
  <p>내용</p>
</Card>

// 크기별 패딩 가이드
<Button size="sm" className="px-sm py-xs">   {/* 8px 좌우, 4px 상하 */}
<Button size="md" className="px-md py-sm">   {/* 16px 좌우, 8px 상하 */}
<Button size="lg" className="px-lg py-md">   {/* 24px 좌우, 16px 상하 */}
```

#### 컴포넌트 간 간격 (Margin)

```tsx
// ✅ 올바른 사용 - 관련성에 따른 간격
<section>
  <h2 className="mb-md">섹션 제목</h2>        {/* 16px */}
  <p className="mb-sm">첫 번째 문단</p>        {/* 8px */}
  <p className="mb-lg">두 번째 문단</p>        {/* 24px */}
  
  <h3 className="mb-sm">하위 제목</h3>         {/* 8px */}
  <p>관련 내용</p>
</section>
```

#### 레이아웃 간격

```tsx
// ✅ 올바른 사용
<div className="space-y-xl">      {/* 자식 요소 간 32px 간격 */}
  <Header />
  <Main className="px-lg">        {/* 좌우 24px 패딩 */}
    <div className="space-y-md">  {/* 자식 요소 간 16px 간격 */}
      <Card />
      <Card />
      <Card />
    </div>
  </Main>
  <Footer />
</div>
```

## 🎬 애니메이션 토큰

### 지속 시간 (Duration)

```tsx
import { animations } from '@your-org/linear-design-system/tokens';

animations.duration = {
  instant: '0ms',      // 즉시
  fast: '150ms',       // 빠른 애니메이션 (호버, 포커스)
  normal: '300ms',     // 일반 애니메이션 (모달, 드롭다운)
  slow: '500ms',       // 느린 애니메이션 (페이지 전환)
  slower: '800ms'      // 매우 느린 애니메이션 (복잡한 전환)
}
```

### 이징 함수 (Easing)

```tsx
animations.easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
}
```

### 애니메이션 사용 가이드라인

```tsx
// ✅ 올바른 사용 - 적절한 지속시간과 이징
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ 
    duration: animations.duration.fast,  // 150ms
    ease: animations.easing.easeOut 
  }}
>
  호버 효과
</motion.div>

// 모달 애니메이션
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ 
    duration: animations.duration.normal,  // 300ms
    ease: animations.easing.easeInOut 
  }}
>
  모달 내용
</motion.div>
```

## 🛠️ 사용 방법

### JavaScript/TypeScript에서 사용

```tsx
import { 
  colors, 
  typography, 
  spacing, 
  animations 
} from '@your-org/linear-design-system/tokens';

// 스타일 객체에서 사용
const buttonStyle = {
  backgroundColor: colors.primary[500],
  color: colors.white,
  padding: `${spacing.sm} ${spacing.md}`,
  fontSize: typography.body.medium.fontSize,
  transition: `all ${animations.duration.fast} ${animations.easing.easeOut}`
};

// 조건부 스타일
const getButtonColor = (variant: string) => {
  switch (variant) {
    case 'primary':
      return colors.primary[500];
    case 'secondary':
      return colors.secondary[500];
    default:
      return colors.neutral[500];
  }
};
```

### CSS에서 사용

```css
/* CSS 변수로 자동 변환됨 */
.button {
  background-color: var(--color-primary-500);
  color: var(--color-white);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--typography-body-medium-font-size);
  transition: all var(--animation-duration-fast) var(--animation-easing-ease-out);
}

.button:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
}
```

### Tailwind CSS에서 사용

```tsx
// 토큰이 Tailwind 설정에 자동으로 추가됨
<div className="bg-primary-500 text-white p-md rounded-lg">
  <h2 className="text-heading-medium font-semibold mb-sm">
    제목
  </h2>
  <p className="text-body-medium">
    내용
  </p>
</div>
```

## 🎨 커스터마이징

### 토큰 확장

```tsx
// 새로운 색상 추가
const customColors = {
  ...colors,
  brand: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e'
  }
};

// 새로운 간격 추가
const customSpacing = {
  ...spacing,
  '6xl': '128px',
  '7xl': '160px'
};
```

### 토큰 오버라이드

```tsx
// 기존 토큰 값 변경
const customTheme = {
  colors: {
    ...colors,
    primary: {
      ...colors.primary,
      500: '#6366f1'  // 기본 primary 색상 변경
    }
  },
  typography: {
    ...typography,
    body: {
      ...typography.body,
      medium: {
        ...typography.body.medium,
        fontSize: '15px'  // 기본 본문 크기 변경
      }
    }
  }
};
```

### 다크 모드 토큰

```tsx
const darkModeColors = {
  ...colors,
  neutral: {
    50: '#171717',   // 다크 모드에서는 순서가 반대
    100: '#262626',
    200: '#404040',
    // ...
    800: '#E5E5E5',
    900: '#FAFAFA'
  }
};
```

## 📚 모범 사례

### DO (권장사항)

```tsx
// ✅ 토큰 사용
const style = {
  color: colors.primary[500],
  fontSize: typography.body.medium.fontSize,
  margin: spacing.md
};

// ✅ 시맨틱 의미 고려
<Button variant="primary">주요 액션</Button>
<Button variant="secondary">보조 액션</Button>

// ✅ 일관된 간격 사용
<div className="space-y-md">
  <Card className="p-lg" />
  <Card className="p-lg" />
</div>
```

### DON'T (비권장사항)

```tsx
// ❌ 하드코딩된 값 사용
const style = {
  color: '#5E6AD2',
  fontSize: '16px',
  margin: '16px'
};

// ❌ 의미 없는 색상 사용
<Button style={{ backgroundColor: 'red' }}>저장</Button>

// ❌ 불일치한 간격
<div>
  <Card style={{ padding: '20px' }} />
  <Card style={{ padding: '15px' }} />
</div>
```

## 🔍 문제 해결

### 자주 묻는 질문

**Q: 토큰 값이 적용되지 않아요.**
A: CSS 변수가 올바르게 로드되었는지 확인하고, 브라우저 개발자 도구에서 계산된 값을 확인하세요.

**Q: 다크 모드에서 색상이 이상해요.**
A: 다크 모드 토큰이 올바르게 정의되었는지 확인하고, CSS 변수가 테마에 따라 동적으로 변경되는지 확인하세요.

**Q: 커스텀 토큰을 어떻게 추가하나요?**
A: 테마 설정에서 기존 토큰을 확장하거나 새로운 토큰을 추가할 수 있습니다.

### 디버깅 도구

```tsx
// 개발 모드에서 토큰 값 확인
if (process.env.NODE_ENV === 'development') {
  console.log('Current tokens:', {
    colors,
    typography,
    spacing,
    animations
  });
}

// CSS 변수 값 확인
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary-500');
console.log('Primary color:', primaryColor);
```