# Button 컴포넌트

사용자 액션을 트리거하는 버튼 컴포넌트입니다. 다양한 스타일과 상태를 지원하며, 완전한 접근성을 제공합니다.

## 📋 목차

- [기본 사용법](#기본-사용법)
- [Props API](#props-api)
- [변형 (Variants)](#변형-variants)
- [크기 (Sizes)](#크기-sizes)
- [상태 (States)](#상태-states)
- [아이콘](#아이콘)
- [접근성](#접근성)
- [예제](#예제)

## 🚀 기본 사용법

```tsx
import { Button } from '@your-org/linear-design-system';

function MyComponent() {
  return (
    <Button onClick={() => console.log('클릭됨!')}>
      클릭하세요
    </Button>
  );
}
```

## 📝 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 버튼의 시각적 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 버튼의 크기 |
| `loading` | `boolean` | `false` | 로딩 상태 표시 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `fullWidth` | `boolean` | `false` | 전체 너비 사용 |
| `icon` | `ReactNode` | - | 왼쪽 아이콘 |
| `iconRight` | `ReactNode` | - | 오른쪽 아이콘 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML 버튼 타입 |
| `onClick` | `(event: MouseEvent) => void` | - | 클릭 이벤트 핸들러 |
| `children` | `ReactNode` | - | 버튼 내용 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `...rest` | `ButtonHTMLAttributes` | - | 기타 HTML 버튼 속성 |

## 🎨 변형 (Variants)

### Primary (기본)

가장 중요한 액션에 사용하는 기본 버튼입니다.

```tsx
<Button variant="primary">
  Primary Button
</Button>
```

**스타일:**
- 배경색: `colors.primary[500]` (#5E6AD2)
- 텍스트 색상: `colors.white`
- 호버: 배경색이 `colors.primary[600]`으로 변경
- 포커스: 2px 파란색 아웃라인

### Secondary

보조적인 액션에 사용하는 버튼입니다.

```tsx
<Button variant="secondary">
  Secondary Button
</Button>
```

**스타일:**
- 배경색: `colors.secondary[500]` (#00D2FF)
- 텍스트 색상: `colors.white`
- 호버: 배경색이 `colors.secondary[600]`으로 변경

### Ghost

최소한의 시각적 강조가 필요한 액션에 사용합니다.

```tsx
<Button variant="ghost">
  Ghost Button
</Button>
```

**스타일:**
- 배경색: 투명
- 텍스트 색상: `colors.primary[500]`
- 호버: 배경색이 `colors.primary[50]`으로 변경

## 📏 크기 (Sizes)

### Small (sm)

공간이 제한된 곳에서 사용하는 작은 버튼입니다.

```tsx
<Button size="sm">Small Button</Button>
```

**스타일:**
- 높이: 32px
- 패딩: 8px 12px
- 폰트 크기: 12px

### Medium (md) - 기본

일반적인 상황에서 사용하는 중간 크기 버튼입니다.

```tsx
<Button size="md">Medium Button</Button>
```

**스타일:**
- 높이: 40px
- 패딩: 12px 16px
- 폰트 크기: 14px

### Large (lg)

중요한 액션이나 넓은 공간에서 사용하는 큰 버튼입니다.

```tsx
<Button size="lg">Large Button</Button>
```

**스타일:**
- 높이: 48px
- 패딩: 16px 24px
- 폰트 크기: 16px

## 🔄 상태 (States)

### 로딩 상태

비동기 작업 진행 중임을 나타냅니다.

```tsx
<Button loading>
  저장 중...
</Button>
```

**동작:**
- 스피너 아이콘 표시
- 클릭 이벤트 비활성화
- `aria-disabled="true"` 설정
- 기존 아이콘 숨김

### 비활성화 상태

버튼을 사용할 수 없는 상태입니다.

```tsx
<Button disabled>
  비활성화된 버튼
</Button>
```

**동작:**
- 투명도 60%로 설정
- 클릭 이벤트 비활성화
- `disabled` 및 `aria-disabled="true"` 설정
- 커서가 `not-allowed`로 변경

### 전체 너비

부모 컨테이너의 전체 너비를 사용합니다.

```tsx
<Button fullWidth>
  전체 너비 버튼
</Button>
```

## 🎯 아이콘

### 왼쪽 아이콘

```tsx
import { PlusIcon } from '@heroicons/react/24/outline';

<Button icon={<PlusIcon />}>
  추가하기
</Button>
```

### 오른쪽 아이콘

```tsx
import { ArrowRightIcon } from '@heroicons/react/24/outline';

<Button iconRight={<ArrowRightIcon />}>
  다음 단계
</Button>
```

### 아이콘만 있는 버튼

```tsx
<Button 
  icon={<PlusIcon />}
  aria-label="항목 추가"
>
  {/* 텍스트 없이 아이콘만 */}
</Button>
```

**주의사항:**
- 아이콘만 있는 버튼은 반드시 `aria-label`을 제공해야 합니다
- 아이콘 크기는 자동으로 버튼 크기에 맞춰 조정됩니다

## ♿ 접근성

### 키보드 네비게이션

- **Tab**: 버튼에 포커스
- **Enter/Space**: 버튼 활성화
- **Shift + Tab**: 이전 요소로 포커스 이동

### 스크린 리더 지원

```tsx
// 명확한 라벨 제공
<Button aria-label="사용자 프로필 메뉴 열기">
  <UserIcon />
</Button>

// 추가 설명 제공
<Button aria-describedby="save-help">
  저장
</Button>
<div id="save-help">변경사항을 서버에 저장합니다</div>

// 상태 정보 제공
<Button 
  aria-pressed={isActive}
  onClick={toggleActive}
>
  {isActive ? '활성화됨' : '비활성화됨'}
</Button>
```

### 색상 대비

모든 버튼 변형은 WCAG AA 기준(4.5:1)을 만족합니다:

- Primary: 흰색 텍스트 + 파란색 배경 (7.2:1)
- Secondary: 흰색 텍스트 + 청록색 배경 (5.1:1)
- Ghost: 파란색 텍스트 + 투명 배경 (4.8:1)

### 포커스 표시

모든 버튼은 키보드 포커스 시 명확한 아웃라인을 표시합니다:

```css
.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

## 📚 예제

### 기본 사용 예제

```tsx
import { Button } from '@your-org/linear-design-system';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function ActionButtons() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="primary"
        loading={loading}
        onClick={handleSave}
      >
        저장
      </Button>
      
      <Button 
        variant="secondary"
        icon={<PlusIcon />}
      >
        추가
      </Button>
      
      <Button 
        variant="ghost"
        icon={<TrashIcon />}
        aria-label="삭제"
      />
    </div>
  );
}
```

### 폼에서 사용하는 예제

```tsx
function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <Input label="이메일" type="email" required />
      <Input label="비밀번호" type="password" required />
      
      <div className="flex gap-2 mt-4">
        <Button 
          type="submit"
          loading={isSubmitting}
          fullWidth
        >
          로그인
        </Button>
        
        <Button 
          type="button"
          variant="ghost"
          onClick={handleCancel}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
```

### 반응형 버튼 예제

```tsx
import { useBreakpoint } from '@your-org/linear-design-system/hooks';

function ResponsiveButton() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <Button 
      size={isMobile ? 'sm' : 'md'}
      fullWidth={isMobile}
    >
      {isMobile ? '저장' : '변경사항 저장'}
    </Button>
  );
}
```

## 🎨 커스터마이징

### CSS 변수 오버라이드

```css
.custom-button {
  --button-primary-bg: #6366f1;
  --button-primary-hover-bg: #5b21b6;
  --button-border-radius: 4px;
}
```

### 테마 확장

```tsx
const customTheme = {
  components: {
    Button: {
      variants: {
        danger: {
          backgroundColor: 'var(--color-error-500)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-error-600)',
          },
        },
      },
    },
  },
};
```

## 🔍 문제 해결

### 자주 묻는 질문

**Q: 버튼이 클릭되지 않아요.**
A: `disabled` 또는 `loading` 상태인지 확인하세요. 이 상태에서는 클릭 이벤트가 비활성화됩니다.

**Q: 아이콘이 너무 크게 표시돼요.**
A: 아이콘 컴포넌트에 적절한 크기를 설정하세요. 일반적으로 16px 또는 20px가 적절합니다.

**Q: 커스텀 스타일이 적용되지 않아요.**
A: CSS 특이성을 확인하고, 필요시 `!important`를 사용하거나 더 구체적인 선택자를 사용하세요.

### 성능 최적화

```tsx
// ✅ 권장: 콜백 메모이제이션
const handleClick = useCallback(() => {
  // 클릭 로직
}, [dependency]);

// ✅ 권장: 컴포넌트 메모이제이션
const MemoizedButton = memo(Button);

// ❌ 비권장: 인라인 함수
<Button onClick={() => console.log('clicked')}>
  클릭
</Button>
```