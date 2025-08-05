# 개발자 가이드 (Developer Guide)

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [개발 환경 설정](#개발-환경-설정)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처](#아키텍처)
5. [API 문서](#api-문서)
6. [컴포넌트 가이드](#컴포넌트-가이드)
7. [서비스 가이드](#서비스-가이드)
8. [상태 관리](#상태-관리)
9. [테스팅](#테스팅)
10. [성능 최적화](#성능-최적화)
11. [기여 가이드](#기여-가이드)

## 프로젝트 개요

### 기술 스택
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Context API + useReducer
- **Storage**: localStorage
- **TTS**: Web Speech API
- **Testing**: Vitest + React Testing Library

### 주요 특징
- 완전한 TypeScript 지원
- 반응형 디자인 (모바일 우선)
- PWA 지원 (오프라인 기능)
- 접근성 준수 (WCAG 2.1 AA)
- 성능 최적화 (코드 분할, 지연 로딩)

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 9+
- 모던 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 및 실행
```bash
# 저장소 클론
git clone <repository-url>
cd english-card-learning

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test

# 프로덕션 빌드
npm run build
```

### 개발 도구 설정

#### VS Code 확장 프로그램 (권장)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- ESLint
- Prettier

#### 환경 변수
`.env.local` 파일 생성:
```
VITE_APP_TITLE=영어 학습 카드 앱 (개발)
VITE_APP_VERSION=dev
VITE_DEBUG=true
```

## 프로젝트 구조

```
english-card-learning/
├── public/                 # 정적 자산
│   ├── icon.svg           # 앱 아이콘
│   ├── manifest.json      # PWA 매니페스트
│   └── sw.js             # 서비스 워커
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── __tests__/    # 컴포넌트 테스트
│   │   ├── AutoPlay.tsx
│   │   ├── CardView.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FeedbackToast.tsx
│   │   ├── GradeSelector.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ProgressDashboard.tsx
│   ├── context/          # React Context
│   │   ├── __tests__/
│   │   ├── AppContext.tsx
│   │   └── actions.ts
│   ├── data/             # 정적 데이터
│   │   └── sentences.ts
│   ├── services/         # 비즈니스 로직
│   │   ├── __tests__/
│   │   ├── dataService.ts
│   │   ├── errorService.ts
│   │   ├── preferencesService.ts
│   │   ├── progressService.ts
│   │   ├── storageService.ts
│   │   └── ttsService.ts
│   ├── test/             # 테스트 유틸리티
│   │   ├── integration.test.tsx
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   ├── types/            # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── main.tsx          # 앱 진입점
│   └── index.css         # 글로벌 스타일
├── dist/                 # 빌드 출력 (생성됨)
├── node_modules/         # 의존성 (생성됨)
├── .env.local           # 환경 변수 (생성 필요)
├── package.json         # 프로젝트 설정
├── tsconfig.json        # TypeScript 설정
├── vite.config.ts       # Vite 설정
├── tailwind.config.js   # Tailwind 설정
└── vitest.config.ts     # 테스트 설정
```

## 아키텍처

### 전체 아키텍처
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Components  │  │   Hooks     │  │    Context          │  │
│  │             │  │             │  │                     │  │
│  │ - CardView  │  │ - useApp    │  │ - AppContext        │  │
│  │ - Grade     │  │ - useTTS    │  │ - AppProvider       │  │
│  │   Selector  │  │ - useAudio  │  │                     │  │
│  │ - Progress  │  │             │  │                     │  │
│  │   Dashboard │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Data        │  │ Progress    │  │ TTS Service         │  │
│  │ Service     │  │ Service     │  │                     │  │
│  │             │  │             │  │ - Speech Synthesis  │  │
│  │ - Sentences │  │ - Tracking  │  │ - Voice Selection   │  │
│  │ - Important │  │ - Streaks   │  │ - Error Handling    │  │
│  │   Marking   │  │ - Stats     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ localStorage│  │ Static Data │  │ Browser APIs        │  │
│  │             │  │             │  │                     │  │
│  │ - Progress  │  │ - Sentences │  │ - Web Speech API    │  │
│  │ - Important │  │ - Grades    │  │ - Local Storage     │  │
│  │ - Prefs     │  │             │  │ - Touch Events      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 데이터 플로우
```
User Action → Component → Context → Service → Storage/API
                ↓
User Interface ← Component ← Context ← Service ← Storage/API
```

## API 문서

### 타입 정의

#### 기본 타입
```typescript
// 학년 타입
type Grade = 'middle1' | 'middle2' | 'middle3' | 'high1' | 'high2' | 'high3';

// 재생 속도 타입
type PlaybackSpeed = 'slow' | 'normal' | 'fast';

// 언어 타입
type Language = 'ko' | 'en';
```

#### 데이터 모델
```typescript
// 문장 인터페이스
interface Sentence {
  id: string;
  korean: string;
  english: string;
  grade: Grade;
  isImportant: boolean;
  studyCount: number;
  lastStudied?: Date;
}

// 학습 진도 인터페이스
interface LearningProgress {
  grade: Grade;
  totalSentences: number;
  studiedSentences: number;
  completionRate: number;
  streak: number;
  lastStudyDate?: Date;
}

// 앱 상태 인터페이스
interface AppState {
  currentGrade?: Grade;
  currentSentenceIndex: number;
  sentences: Sentence[];
  isCardFlipped: boolean;
  autoPlay: {
    isActive: boolean;
    speed: PlaybackSpeed;
  };
  progress: Record<Grade, LearningProgress>;
  importantSentences: string[];
}
```

### 서비스 API

#### DataService
```typescript
class DataService {
  // 학년별 문장 조회
  getSentencesByGrade(grade: Grade): Sentence[]
  
  // 중요 문장 토글
  toggleImportant(sentenceId: string): void
  
  // 중요 문장 목록 조회
  getImportantSentences(): Sentence[]
  
  // 문장 학습 기록
  markAsStudied(sentenceId: string): void
}
```

#### TTSService
```typescript
class TTSService {
  // 텍스트 음성 재생
  speak(text: string, language: Language): Promise<void>
  
  // 음성 재생 중단
  stop(): void
  
  // TTS 지원 여부 확인
  isSupported(): boolean
  
  // 사용 가능한 음성 목록
  getVoices(): SpeechSynthesisVoice[]
  
  // 음성 설정
  setVoice(voiceIndex: number): void
  setRate(rate: number): void
  setPitch(pitch: number): void
}
```

#### ProgressService
```typescript
class ProgressService {
  // 진도 저장
  saveProgress(grade: Grade, sentenceId: string): void
  
  // 진도 조회
  getProgress(grade: Grade): LearningProgress
  
  // 스트릭 업데이트
  updateStreak(): void
  
  // 스트릭 조회
  getStreak(): number
  
  // 통계 조회
  getStats(): {
    totalStudied: number;
    totalTime: number;
    averageScore: number;
  }
}
```

#### StorageService
```typescript
class StorageService {
  // 데이터 저장
  save<T>(key: string, data: T): void
  
  // 데이터 로드
  load<T>(key: string, defaultValue?: T): T | null
  
  // 데이터 삭제
  remove(key: string): void
  
  // 전체 데이터 삭제
  clear(): void
  
  // 저장소 사용량 확인
  getUsage(): { used: number; total: number }
}
```

## 컴포넌트 가이드

### 컴포넌트 작성 규칙

#### 1. 파일 구조
```typescript
// ComponentName.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentNameProps {
  // props 정의
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  // props 구조분해
}) => {
  // 컴포넌트 로직
  
  return (
    // JSX
  );
};

export default ComponentName;
```

#### 2. Props 인터페이스
```typescript
interface ComponentProps {
  // 필수 props
  required: string;
  
  // 선택적 props
  optional?: number;
  
  // 함수 props
  onAction: (value: string) => void;
  
  // 자식 컴포넌트
  children?: React.ReactNode;
}
```

#### 3. 스타일링 가이드
```typescript
// Tailwind CSS 클래스 사용
const baseClasses = "flex items-center justify-center";
const variantClasses = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-500 text-white",
};

// 조건부 클래스
const className = `${baseClasses} ${variantClasses[variant]} ${
  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
}`;
```

### 주요 컴포넌트

#### CardView
카드 학습의 핵심 컴포넌트
```typescript
interface CardViewProps {
  sentence: Sentence;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleImportant: () => void;
  onPlayAudio: () => void;
}
```

**주요 기능:**
- 3D 카드 뒤집기 애니메이션
- 터치/마우스 제스처 지원
- 키보드 네비게이션
- 접근성 지원

#### GradeSelector
학년 선택 컴포넌트
```typescript
interface GradeSelectorProps {
  selectedGrade?: Grade;
  onGradeSelect: (grade: Grade) => void;
}
```

**주요 기능:**
- 반응형 그리드 레이아웃
- 선택 상태 시각화
- 키보드 네비게이션

#### ProgressDashboard
학습 진도 표시 컴포넌트
```typescript
interface ProgressDashboardProps {
  progress: Record<Grade, LearningProgress>;
  importantSentences: Sentence[];
  onGradeSelect: (grade: Grade) => void;
}
```

**주요 기능:**
- 진도율 시각화
- 중요 문장 관리
- 학습 통계 표시

## 서비스 가이드

### 서비스 작성 규칙

#### 1. 클래스 기반 서비스
```typescript
class ServiceName {
  private static instance: ServiceName;
  
  private constructor() {
    // 초기화 로직
  }
  
  public static getInstance(): ServiceName {
    if (!ServiceName.instance) {
      ServiceName.instance = new ServiceName();
    }
    return ServiceName.instance;
  }
  
  public method(): ReturnType {
    // 메서드 구현
  }
}
```

#### 2. 에러 처리
```typescript
class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// 사용 예시
try {
  const result = await service.method();
} catch (error) {
  if (error instanceof ServiceError) {
    console.error(`Service error [${error.code}]: ${error.message}`);
  }
}
```

#### 3. 비동기 처리
```typescript
// Promise 기반
async method(): Promise<Result> {
  try {
    const result = await asyncOperation();
    return result;
  } catch (error) {
    throw new ServiceError('Operation failed', 'ASYNC_ERROR', error);
  }
}

// 콜백 기반 (TTS 등)
method(callback: (result: Result) => void): void {
  // 비동기 작업
  setTimeout(() => {
    callback(result);
  }, 1000);
}
```

## 상태 관리

### Context API 사용

#### 1. Context 정의
```typescript
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);
```

#### 2. Provider 구현
```typescript
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### 3. Hook 사용
```typescript
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

### 액션 정의
```typescript
type AppAction =
  | { type: 'SET_GRADE'; payload: Grade }
  | { type: 'SET_SENTENCE_INDEX'; payload: number }
  | { type: 'FLIP_CARD' }
  | { type: 'TOGGLE_IMPORTANT'; payload: string }
  | { type: 'UPDATE_PROGRESS'; payload: LearningProgress };
```

### 리듀서 구현
```typescript
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_GRADE':
      return {
        ...state,
        currentGrade: action.payload,
        currentSentenceIndex: 0,
        isCardFlipped: false,
      };
    
    case 'FLIP_CARD':
      return {
        ...state,
        isCardFlipped: !state.isCardFlipped,
      };
    
    default:
      return state;
  }
};
```

## 테스팅

### 테스트 구조
```
src/
├── components/
│   ├── __tests__/
│   │   ├── ComponentName.test.tsx
│   │   └── Integration.test.tsx
├── services/
│   ├── __tests__/
│   │   └── serviceName.test.ts
└── test/
    ├── setup.ts
    ├── test-utils.tsx
    └── integration.test.tsx
```

### 컴포넌트 테스트
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const mockHandler = vi.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledWith('expected-value');
  });
});
```

### 서비스 테스트
```typescript
import { ServiceName } from '../serviceName';

describe('ServiceName', () => {
  let service: ServiceName;
  
  beforeEach(() => {
    service = ServiceName.getInstance();
  });
  
  it('performs operation correctly', async () => {
    const result = await service.method();
    expect(result).toEqual(expectedResult);
  });
});
```

### 통합 테스트
```typescript
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { App } from '../App';

describe('App Integration', () => {
  it('completes user flow', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    
    // 사용자 플로우 테스트
    fireEvent.click(screen.getByText('중1'));
    expect(screen.getByText('첫 번째 문장')).toBeInTheDocument();
  });
});
```

## 성능 최적화

### 1. React 최적화
```typescript
// React.memo 사용
export const ComponentName = React.memo<ComponentProps>(({ prop }) => {
  return <div>{prop}</div>;
});

// useMemo 사용
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// useCallback 사용
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### 2. 코드 분할
```typescript
// 동적 import
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Suspense 사용
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### 3. 번들 최적화
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
});
```

## 기여 가이드

### 개발 워크플로우

#### 1. 브랜치 전략
```bash
# 기능 개발
git checkout -b feature/feature-name

# 버그 수정
git checkout -b fix/bug-description

# 핫픽스
git checkout -b hotfix/critical-fix
```

#### 2. 커밋 메시지 규칙
```
type(scope): description

feat(card): add flip animation
fix(tts): resolve voice selection issue
docs(readme): update installation guide
test(service): add unit tests for DataService
```

#### 3. Pull Request 체크리스트
- [ ] 코드 린트 통과 (`npm run lint`)
- [ ] 테스트 통과 (`npm run test:run`)
- [ ] 타입 체크 통과 (`tsc --noEmit`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 문서 업데이트 (필요시)

### 코드 리뷰 가이드

#### 체크 포인트
1. **기능성**: 요구사항을 올바르게 구현했는가?
2. **성능**: 불필요한 렌더링이나 메모리 누수는 없는가?
3. **접근성**: 키보드 네비게이션과 스크린 리더 지원이 되는가?
4. **테스트**: 적절한 테스트 커버리지를 가지고 있는가?
5. **문서**: 복잡한 로직에 대한 주석이 있는가?

### 릴리스 프로세스

#### 1. 버전 관리
```bash
# 패치 버전 (버그 수정)
npm version patch

# 마이너 버전 (새 기능)
npm version minor

# 메이저 버전 (호환성 변경)
npm version major
```

#### 2. 배포 준비
```bash
# 배포 전 체크
npm run deploy:check

# 프로덕션 빌드
npm run build:prod

# 배포
npm run deploy
```

---

**이 문서는 지속적으로 업데이트됩니다. 질문이나 제안사항이 있으면 언제든지 문의해주세요.**

**마지막 업데이트**: 2025년 1월 30일