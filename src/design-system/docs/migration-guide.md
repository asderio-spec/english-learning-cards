# 마이그레이션 가이드

기존 UI 라이브러리에서 Linear Design System으로 마이그레이션하는 방법을 안내합니다.

## 📋 목차

- [마이그레이션 개요](#마이그레이션-개요)
- [단계별 마이그레이션](#단계별-마이그레이션)
- [컴포넌트 매핑](#컴포넌트-매핑)
- [스타일 마이그레이션](#스타일-마이그레이션)
- [테마 마이그레이션](#테마-마이그레이션)
- [자동화 도구](#자동화-도구)
- [문제 해결](#문제-해결)

## 🎯 마이그레이션 개요

### 지원하는 마이그레이션 경로

- **Material-UI (MUI)** → Linear Design System
- **Ant Design** → Linear Design System
- **Chakra UI** → Linear Design System
- **Bootstrap** → Linear Design System
- **커스텀 CSS** → Linear Design System

### 마이그레이션 전략

1. **점진적 마이그레이션**: 페이지별, 컴포넌트별로 단계적 전환
2. **병렬 운영**: 기존 시스템과 새 시스템을 동시에 사용
3. **테마 우선**: 디자인 토큰부터 적용하여 일관성 확보

## 📈 단계별 마이그레이션

### 1단계: 준비 및 설치

```bash
# Linear Design System 설치
npm install @your-org/linear-design-system

# 기존 UI 라이브러리와 병렬 설치 (점진적 마이그레이션용)
# npm install @mui/material @your-org/linear-design-system
```

```tsx
// App.tsx - 테마 프로바이더 설정
import { ThemeProvider } from '@your-org/linear-design-system';
import '@your-org/linear-design-system/dist/styles.css';

function App() {
  return (
    <ThemeProvider>
      {/* 기존 앱 컨텐츠 */}
    </ThemeProvider>
  );
}
```

### 2단계: 디자인 토큰 적용

```tsx
// 기존 색상 변수를 Linear 토큰으로 교체
// Before
const theme = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff'
  }
};

// After
import { colors } from '@your-org/linear-design-system/tokens';

const theme = {
  colors: {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    background: colors.white
  }
};
```

### 3단계: 컴포넌트 점진적 교체

```tsx
// 페이지별로 컴포넌트 교체
// Before - MUI 사용
import { Button as MuiButton, Card as MuiCard } from '@mui/material';

function UserProfile() {
  return (
    <MuiCard>
      <h2>사용자 프로필</h2>
      <MuiButton variant="contained">편집</MuiButton>
    </MuiCard>
  );
}

// After - Linear Design System 사용
import { Button, Card } from '@your-org/linear-design-system';

function UserProfile() {
  return (
    <Card>
      <h2>사용자 프로필</h2>
      <Button variant="primary">편집</Button>
    </Card>
  );
}
```

### 4단계: 스타일 정리 및 최적화

```tsx
// 불필요한 CSS 제거 및 토큰 활용
// Before
const customStyles = {
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px'
  }
};

// After - 토큰 사용
import { spacing, colors } from '@your-org/linear-design-system/tokens';

const customStyles = {
  button: {
    backgroundColor: colors.primary[500],
    color: colors.white,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '8px'
  }
};
```

## 🔄 컴포넌트 매핑

### Material-UI → Linear Design System

| MUI 컴포넌트 | Linear 컴포넌트 | 주요 변경사항 |
|-------------|----------------|--------------|
| `Button` | `Button` | `variant="contained"` → `variant="primary"` |
| `Card` | `Card` | `elevation` prop 제거, `variant="elevated"` 사용 |
| `TextField` | `Input` | `variant="outlined"` 기본값, `label` prop 동일 |
| `Typography` | CSS 클래스 | `variant="h1"` → `className="text-heading-large"` |
| `Box` | `div` + CSS | `sx` prop 대신 Tailwind 클래스 사용 |
| `Grid` | `Grid` | API 유사, `spacing` prop 값 조정 필요 |
| `Modal` | `Modal` | `open` → `isOpen`, 나머지 API 유사 |

#### Button 마이그레이션

```tsx
// Before - MUI
<Button 
  variant="contained" 
  color="primary"
  size="large"
  startIcon={<AddIcon />}
>
  추가하기
</Button>

// After - Linear
<Button 
  variant="primary"
  size="lg"
  icon={<AddIcon />}
>
  추가하기
</Button>
```

#### Card 마이그레이션

```tsx
// Before - MUI
<Card elevation={3}>
  <CardContent>
    <Typography variant="h5">제목</Typography>
    <Typography variant="body2">내용</Typography>
  </CardContent>
</Card>

// After - Linear
<Card variant="elevated">
  <h3 className="text-heading-medium">제목</h3>
  <p className="text-body-small">내용</p>
</Card>
```

### Ant Design → Linear Design System

| Ant Design | Linear 컴포넌트 | 주요 변경사항 |
|------------|----------------|--------------|
| `Button` | `Button` | `type="primary"` → `variant="primary"` |
| `Card` | `Card` | `bordered={false}` → `variant="elevated"` |
| `Input` | `Input` | API 거의 동일 |
| `Typography.Title` | CSS 클래스 | `level={1}` → `className="text-display-large"` |
| `Space` | CSS 클래스 | `size="large"` → `className="space-x-lg"` |
| `Modal` | `Modal` | `visible` → `isOpen` |

#### Button 마이그레이션

```tsx
// Before - Ant Design
<Button type="primary" size="large" icon={<PlusOutlined />}>
  추가하기
</Button>

// After - Linear
<Button variant="primary" size="lg" icon={<PlusIcon />}>
  추가하기
</Button>
```

### Chakra UI → Linear Design System

| Chakra UI | Linear 컴포넌트 | 주요 변경사항 |
|-----------|----------------|--------------|
| `Button` | `Button` | `colorScheme="blue"` → `variant="primary"` |
| `Box` | `div` + CSS | `bg="white"` → `className="bg-white"` |
| `Text` | CSS 클래스 | `fontSize="lg"` → `className="text-body-large"` |
| `Input` | `Input` | API 유사 |
| `Modal` | `Modal` | `isOpen` prop 동일 |

## 🎨 스타일 마이그레이션

### CSS-in-JS에서 Tailwind로

```tsx
// Before - styled-components
const StyledCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// After - Tailwind + Linear tokens
<Card 
  variant="elevated" 
  padding="lg"
  className="hover:shadow-lg transition-shadow"
>
  {/* 내용 */}
</Card>
```

### 커스텀 CSS에서 토큰으로

```css
/* Before - 커스텀 CSS */
.custom-button {
  background-color: #1976d2;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.custom-button:hover {
  background-color: #1565c0;
}
```

```tsx
// After - Linear 토큰 사용
import { colors, spacing, typography } from '@your-org/linear-design-system/tokens';

const customButtonStyle = {
  backgroundColor: colors.primary[500],
  color: colors.white,
  padding: `${spacing.sm} ${spacing.lg}`,
  borderRadius: '6px',
  fontSize: typography.body.medium.fontSize,
  fontWeight: typography.fontWeight.medium,
  
  '&:hover': {
    backgroundColor: colors.primary[600]
  }
};
```

## 🌙 테마 마이그레이션

### MUI 테마 → Linear 테마

```tsx
// Before - MUI 테마
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
});

// After - Linear 테마
const linearTheme = {
  colors: {
    primary: {
      500: '#1976d2',
      600: '#1565c0',
    },
    secondary: {
      500: '#dc004e',
      600: '#c51162',
    },
  },
  typography: {
    heading: {
      large: {
        fontSize: '2rem',
        fontWeight: 600,
      },
    },
  },
};
```

### 다크 모드 마이그레이션

```tsx
// Before - MUI 다크 모드
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// After - Linear 다크 모드
const darkTheme = {
  colors: {
    background: '#0D1117',
    surface: '#161B22',
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
    },
  },
};
```

## 🤖 자동화 도구

### Codemod 스크립트

```bash
# MUI에서 Linear로 자동 변환
npx @your-org/linear-codemod mui-to-linear src/

# Ant Design에서 Linear로 자동 변환
npx @your-org/linear-codemod antd-to-linear src/
```

### ESLint 규칙

```json
// .eslintrc.json
{
  "rules": {
    "@your-org/linear-design-system/no-deprecated-components": "error",
    "@your-org/linear-design-system/use-design-tokens": "warn"
  }
}
```

### VS Code 확장

```json
// settings.json
{
  "linear-design-system.autoImport": true,
  "linear-design-system.tokenSuggestions": true
}
```

## 🔧 마이그레이션 도구

### 컴포넌트 매핑 도구

```tsx
// migration-helper.tsx
import { ComponentType } from 'react';

// 기존 컴포넌트를 Linear 컴포넌트로 매핑
export const createMigrationWrapper = <T extends ComponentType<any>>(
  LegacyComponent: T,
  LinearComponent: ComponentType<any>,
  propMapper: (props: any) => any
) => {
  return (props: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`${LegacyComponent.name}은 deprecated되었습니다. ${LinearComponent.name}을 사용하세요.`);
    }
    
    const mappedProps = propMapper(props);
    return <LinearComponent {...mappedProps} />;
  };
};

// 사용 예시
export const MuiButton = createMigrationWrapper(
  Button, // MUI Button
  LinearButton, // Linear Button
  (props) => ({
    ...props,
    variant: props.variant === 'contained' ? 'primary' : props.variant
  })
);
```

### 스타일 변환 도구

```javascript
// style-converter.js
const fs = require('fs');
const path = require('path');

const colorMap = {
  '#1976d2': 'var(--color-primary-500)',
  '#dc004e': 'var(--color-secondary-500)',
  '#ffffff': 'var(--color-white)',
};

function convertStyles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  Object.entries(colorMap).forEach(([oldColor, newToken]) => {
    content = content.replace(new RegExp(oldColor, 'g'), newToken);
  });
  
  fs.writeFileSync(filePath, content);
}
```

## 📊 마이그레이션 체크리스트

### 준비 단계
- [ ] 현재 사용 중인 컴포넌트 목록 작성
- [ ] 커스텀 스타일 및 테마 분석
- [ ] 마이그레이션 우선순위 결정
- [ ] 테스트 계획 수립

### 구현 단계
- [ ] Linear Design System 설치 및 설정
- [ ] 디자인 토큰 적용
- [ ] 핵심 컴포넌트부터 순차적 교체
- [ ] 스타일 정리 및 최적화
- [ ] 테스트 실행 및 버그 수정

### 완료 단계
- [ ] 기존 UI 라이브러리 제거
- [ ] 불필요한 CSS 정리
- [ ] 성능 최적화
- [ ] 문서 업데이트
- [ ] 팀 교육 실시

## 🚨 문제 해결

### 자주 발생하는 문제

#### 1. 스타일 충돌

```tsx
// 문제: 기존 CSS와 Linear 스타일이 충돌
// 해결: CSS 특이성 조정 또는 CSS 모듈 사용

// Before
.button {
  background: red !important; // 기존 스타일
}

// After
.linear-button {
  background: var(--color-primary-500);
}
```

#### 2. 타입 에러

```tsx
// 문제: Props 타입 불일치
// Before - MUI
interface MuiButtonProps {
  variant: 'text' | 'outlined' | 'contained';
}

// After - Linear
interface LinearButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
}

// 해결: 타입 매핑 함수 사용
const mapVariant = (muiVariant: string) => {
  switch (muiVariant) {
    case 'contained': return 'primary';
    case 'outlined': return 'secondary';
    case 'text': return 'ghost';
    default: return 'primary';
  }
};
```

#### 3. 번들 크기 증가

```tsx
// 문제: 두 라이브러리를 동시에 사용하여 번들 크기 증가
// 해결: Tree shaking 및 점진적 제거

// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};
```

### 성능 최적화

```tsx
// 지연 로딩으로 마이그레이션 영향 최소화
const LinearButton = lazy(() => 
  import('@your-org/linear-design-system').then(module => ({
    default: module.Button
  }))
);

// 조건부 로딩
const Button = useMemo(() => {
  return isLinearMigrated ? LinearButton : MuiButton;
}, [isLinearMigrated]);
```

## 📚 추가 리소스

### 마이그레이션 도구
- [Linear Codemod](https://github.com/your-org/linear-codemod)
- [Component Mapper](https://github.com/your-org/component-mapper)
- [Style Converter](https://github.com/your-org/style-converter)

### 참고 문서
- [컴포넌트 API 문서](./components/)
- [디자인 토큰 가이드](./design-tokens-guide.md)
- [접근성 가이드](./accessibility-guide.md)

### 커뮤니티 지원
- [Discord 채널](https://discord.gg/linear-design-system)
- [GitHub Discussions](https://github.com/your-org/linear-design-system/discussions)
- [마이그레이션 FAQ](https://github.com/your-org/linear-design-system/wiki/Migration-FAQ)

## 🤝 도움이 필요하신가요?

마이그레이션 과정에서 문제가 발생하면 언제든 도움을 요청하세요:

1. [GitHub Issues](https://github.com/your-org/linear-design-system/issues)에 마이그레이션 라벨과 함께 이슈 등록
2. 현재 사용 중인 UI 라이브러리와 버전 정보 포함
3. 마이그레이션하려는 컴포넌트와 예상 동작 설명
4. 가능하다면 최소 재현 예제 제공

함께 성공적인 마이그레이션을 완료해 보세요! 🚀