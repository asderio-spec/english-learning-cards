# Card 컴포넌트

콘텐츠를 그룹화하고 시각적으로 구분하는 카드 컴포넌트입니다. 다양한 스타일과 인터랙션을 지원합니다.

## 📋 목차

- [기본 사용법](#기본-사용법)
- [Props API](#props-api)
- [변형 (Variants)](#변형-variants)
- [패딩 옵션](#패딩-옵션)
- [인터랙티브 카드](#인터랙티브-카드)
- [접근성](#접근성)
- [예제](#예제)

## 🚀 기본 사용법

```tsx
import { Card } from '@your-org/linear-design-system';

function MyComponent() {
  return (
    <Card>
      <h3>카드 제목</h3>
      <p>카드 내용입니다.</p>
    </Card>
  );
}
```

## 📝 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | 카드의 시각적 스타일 |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | 카드 내부 패딩 크기 |
| `interactive` | `boolean` | `false` | 클릭 가능한 카드로 만들기 |
| `fullWidth` | `boolean` | `false` | 전체 너비 사용 |
| `onClick` | `(event: MouseEvent) => void` | - | 클릭 이벤트 핸들러 (interactive일 때만) |
| `role` | `string` | - | ARIA 역할 (interactive일 때 기본값: 'button') |
| `children` | `ReactNode` | - | 카드 내용 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `...rest` | `HTMLDivAttributes` | - | 기타 HTML div 속성 |

## 🎨 변형 (Variants)

### Default (기본)

기본적인 카드 스타일로 얇은 테두리를 가집니다.

```tsx
<Card variant="default">
  <h3>기본 카드</h3>
  <p>얇은 테두리가 있는 기본 카드입니다.</p>
</Card>
```

**스타일:**
- 배경색: `colors.white`
- 테두리: `1px solid colors.neutral[200]`
- 그림자: 없음
- 둥근 모서리: `12px`

### Elevated (그림자)

그림자 효과로 카드가 떠 있는 느낌을 줍니다.

```tsx
<Card variant="elevated">
  <h3>그림자 카드</h3>
  <p>그림자 효과가 있는 카드입니다.</p>
</Card>
```

**스타일:**
- 배경색: `colors.white`
- 테두리: 없음
- 그림자: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- 둥근 모서리: `12px`

### Outlined (강조 테두리)

두꺼운 테두리로 강조된 카드입니다.

```tsx
<Card variant="outlined">
  <h3>테두리 카드</h3>
  <p>두꺼운 테두리가 있는 카드입니다.</p>
</Card>
```

**스타일:**
- 배경색: `colors.white`
- 테두리: `2px solid colors.neutral[300]`
- 그림자: 없음
- 둥근 모서리: `12px`

## 📏 패딩 옵션

### Small (sm)

공간이 제한된 곳에서 사용하는 작은 패딩입니다.

```tsx
<Card padding="sm">
  <h4>작은 패딩</h4>
  <p>16px 패딩이 적용됩니다.</p>
</Card>
```

**스타일:**
- 패딩: `16px` (spacing.md)

### Medium (md) - 기본

일반적인 상황에서 사용하는 중간 패딩입니다.

```tsx
<Card padding="md">
  <h3>중간 패딩</h3>
  <p>24px 패딩이 적용됩니다.</p>
</Card>
```

**스타일:**
- 패딩: `24px` (spacing.lg)

### Large (lg)

넓은 공간에서 사용하는 큰 패딩입니다.

```tsx
<Card padding="lg">
  <h2>큰 패딩</h2>
  <p>32px 패딩이 적용됩니다.</p>
</Card>
```

**스타일:**
- 패딩: `32px` (spacing.xl)

## 🖱️ 인터랙티브 카드

### 클릭 가능한 카드

`interactive` prop을 사용하여 클릭 가능한 카드를 만들 수 있습니다.

```tsx
<Card 
  interactive
  onClick={() => console.log('카드 클릭됨!')}
>
  <h3>클릭 가능한 카드</h3>
  <p>이 카드를 클릭해보세요.</p>
</Card>
```

**동작:**
- `role="button"` 자동 설정
- `tabIndex="0"` 설정으로 키보드 포커스 가능
- 호버 시 그림자 효과 증가
- 클릭 시 스케일 애니메이션

### 커스텀 역할

```tsx
<Card 
  interactive
  role="link"
  onClick={() => navigate('/details')}
>
  <h3>상세 페이지로 이동</h3>
  <p>클릭하면 상세 페이지로 이동합니다.</p>
</Card>
```

### 키보드 지원

인터랙티브 카드는 자동으로 키보드 네비게이션을 지원합니다.

```tsx
<Card 
  interactive
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  키보드로도 활성화 가능
</Card>
```

## ♿ 접근성

### 시맨틱 HTML

```tsx
// ✅ 올바른 사용 - 적절한 시맨틱 구조
<Card>
  <article>
    <h3>기사 제목</h3>
    <p>기사 내용...</p>
    <footer>
      <time dateTime="2024-01-15">2024년 1월 15일</time>
    </footer>
  </article>
</Card>

// ✅ 인터랙티브 카드의 접근성
<Card 
  interactive
  role="button"
  aria-label="사용자 프로필 보기"
  onClick={viewProfile}
>
  <img src={user.avatar} alt={`${user.name}의 프로필 사진`} />
  <h3>{user.name}</h3>
  <p>{user.title}</p>
</Card>
```

### ARIA 속성

```tsx
// 확장 가능한 카드
<Card 
  interactive
  aria-expanded={isExpanded}
  aria-controls="card-content"
  onClick={toggleExpanded}
>
  <h3>확장 가능한 카드</h3>
  <div id="card-content" aria-hidden={!isExpanded}>
    {isExpanded && <p>추가 내용...</p>}
  </div>
</Card>

// 설명이 있는 카드
<Card aria-describedby="card-description">
  <h3>복잡한 카드</h3>
  <div id="card-description">
    이 카드는 복잡한 정보를 담고 있습니다.
  </div>
</Card>
```

### 색상 대비

모든 카드 변형은 WCAG AA 기준을 만족합니다:

- 텍스트와 배경: 최소 4.5:1 대비
- 테두리와 배경: 최소 3:1 대비

## 📚 예제

### 기본 콘텐츠 카드

```tsx
function ContentCard({ article }) {
  return (
    <Card variant="elevated" padding="lg">
      <article>
        <header>
          <h2>{article.title}</h2>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </header>
        
        <p>{article.excerpt}</p>
        
        <footer>
          <Button variant="ghost" size="sm">
            더 읽기
          </Button>
        </footer>
      </article>
    </Card>
  );
}
```

### 사용자 프로필 카드

```tsx
function UserProfileCard({ user, onViewProfile }) {
  return (
    <Card 
      interactive
      variant="outlined"
      onClick={() => onViewProfile(user.id)}
      aria-label={`${user.name}의 프로필 보기`}
    >
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-neutral-600">{user.title}</p>
        </div>
      </div>
    </Card>
  );
}
```

### 통계 카드

```tsx
function StatCard({ title, value, change, icon: Icon }) {
  const isPositive = change > 0;
  
  return (
    <Card variant="default" padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption-medium text-neutral-600">
            {title}
          </p>
          <p className="text-heading-large font-bold">
            {value}
          </p>
          <p className={`text-caption-small ${
            isPositive ? 'text-success-600' : 'text-error-600'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </p>
        </div>
        <div className="text-neutral-400">
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}
```

### 액션 카드

```tsx
function ActionCard({ title, description, actions }) {
  return (
    <Card variant="elevated" padding="lg" fullWidth>
      <div className="space-y-4">
        <div>
          <h3 className="text-heading-medium">{title}</h3>
          <p className="text-body-medium text-neutral-600">
            {description}
          </p>
        </div>
        
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={index === 0 ? 'primary' : 'secondary'}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

### 반응형 카드 그리드

```tsx
import { useBreakpoint } from '@your-org/linear-design-system/hooks';

function CardGrid({ items }) {
  const breakpoint = useBreakpoint();
  
  const getGridCols = () => {
    switch (breakpoint) {
      case 'mobile': return 1;
      case 'tablet': return 2;
      case 'desktop': return 3;
      default: return 1;
    }
  };

  return (
    <div 
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${getGridCols()}, 1fr)` }}
    >
      {items.map((item) => (
        <Card key={item.id} variant="elevated">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
```

## 🎨 커스터마이징

### CSS 변수 오버라이드

```css
.custom-card {
  --card-border-radius: 8px;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --card-border-color: #e2e8f0;
  --card-background: #ffffff;
}

.custom-card:hover {
  --card-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

### 테마 확장

```tsx
const customTheme = {
  components: {
    Card: {
      variants: {
        gradient: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
        },
        glass: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
};
```

## 🔍 문제 해결

### 자주 묻는 질문

**Q: 카드가 클릭되지 않아요.**
A: `interactive` prop이 설정되어 있는지 확인하고, `onClick` 핸들러가 제대로 전달되었는지 확인하세요.

**Q: 카드 내부의 버튼이 카드 클릭과 함께 실행돼요.**
A: 버튼의 클릭 이벤트에서 `event.stopPropagation()`을 호출하여 이벤트 버블링을 방지하세요.

```tsx
<Card interactive onClick={handleCardClick}>
  <h3>카드 제목</h3>
  <Button 
    onClick={(e) => {
      e.stopPropagation();
      handleButtonClick();
    }}
  >
    버튼
  </Button>
</Card>
```

**Q: 카드 그림자가 잘려 보여요.**
A: 부모 컨테이너에 `overflow: visible`을 설정하거나 충분한 패딩을 추가하세요.

### 성능 최적화

```tsx
// ✅ 권장: 카드 리스트 메모이제이션
const CardList = memo(({ items }) => (
  <div>
    {items.map(item => (
      <Card key={item.id} variant="elevated">
        {item.content}
      </Card>
    ))}
  </div>
));

// ✅ 권장: 클릭 핸들러 메모이제이션
const handleCardClick = useCallback((id) => {
  // 클릭 로직
}, []);
```