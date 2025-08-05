/**
 * Linear 디자인 시스템 데모 메인 페이지
 * 모든 데모 컴포넌트를 한 곳에서 확인할 수 있는 페이지
 */

import React, { useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { ThemeToggle } from '../components/ThemeToggle';

// Lazy-loaded 데모 컴포넌트들 import
import { lazyDemoComponents } from './LazyDemoComponents';

type DemoType = 
  | 'overview'
  | 'colors' 
  | 'typography' 
  | 'buttons' 
  | 'cards' 
  | 'inputs' 
  | 'layout' 
  | 'theme' 
  | 'spacing'
  | 'responsive';

const demos = [
  { id: 'overview', name: '개요', component: null },
  { id: 'colors', name: '색상 시스템', component: lazyDemoComponents.colors },
  { id: 'typography', name: '타이포그래피', component: lazyDemoComponents.typography },
  { id: 'buttons', name: '버튼', component: lazyDemoComponents.buttons },
  { id: 'cards', name: '카드', component: lazyDemoComponents.cards },
  { id: 'inputs', name: '입력 필드', component: lazyDemoComponents.inputs },
  { id: 'layout', name: '레이아웃', component: lazyDemoComponents.layout },
  { id: 'theme', name: '테마 시스템', component: lazyDemoComponents.theme },
  { id: 'spacing', name: '간격 시스템', component: lazyDemoComponents.spacing },
  { id: 'responsive', name: '반응형 시스템', component: lazyDemoComponents.responsive },
] as const;

const OverviewDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Linear 디자인 시스템
        </h1>
        <p className="text-body-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          영어 학습 앱을 위한 완전한 디자인 시스템
        </p>
        <div className="flex justify-center">
          <ThemeToggle showLabel />
        </div>
      </div>

      {/* 주요 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            🎨 완전한 색상 시스템
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            라이트/다크 모드 지원, 의미적 색상, 접근성 검증이 포함된 색상 시스템
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• Primary, Secondary, Neutral 색상 팔레트</li>
            <li>• Success, Warning, Error 의미적 색상</li>
            <li>• WCAG 2.1 AA 준수 대비율</li>
            <li>• CSS 변수 기반 테마 전환</li>
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            📝 타이포그래피 시스템
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            읽기 쉽고 계층적인 타이포그래피 시스템
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• Display, Heading, Body, Caption 스타일</li>
            <li>• 반응형 타이포그래피</li>
            <li>• Inter 폰트 기반</li>
            <li>• 접근성 고려 행간 및 자간</li>
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            🧩 UI 컴포넌트
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            재사용 가능한 UI 컴포넌트 라이브러리
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• Button, Card, Input 컴포넌트</li>
            <li>• Modal, Dropdown 오버레이</li>
            <li>• Container, Grid, Flex 레이아웃</li>
            <li>• 완전한 접근성 지원</li>
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            📐 간격 시스템
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            4px 기준의 일관된 간격 시스템
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• 4px 기준 간격 토큰</li>
            <li>• 의미적 간격 별칭</li>
            <li>• 컴포넌트별 간격 정의</li>
            <li>• 반응형 간격 유틸리티</li>
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            🎭 테마 시스템
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            라이트/다크 모드 및 시스템 테마 지원
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• 라이트/다크/시스템 모드</li>
            <li>• 실시간 테마 전환</li>
            <li>• 로컬 스토리지 저장</li>
            <li>• 시스템 설정 감지</li>
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-h3 font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            ✨ 애니메이션
          </h3>
          <p className="text-body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            부드럽고 의미있는 애니메이션 시스템
          </p>
          <ul className="text-caption-md space-y-1" style={{ color: 'var(--text-tertiary)' }}>
            <li>• Framer Motion 기반</li>
            <li>• 접근성 고려 (prefers-reduced-motion)</li>
            <li>• 컴포넌트별 애니메이션</li>
            <li>• 일관된 이징 및 지속시간</li>
          </ul>
        </Card>
      </div>

      {/* 구현 상태 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          📊 구현 상태
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              ✅ 완료된 기능
            </h4>
            <ul className="text-body-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• 디자인 토큰 시스템 (색상, 타이포그래피, 간격, 애니메이션)</li>
              <li>• 핵심 UI 컴포넌트 (Button, Card, Input, Layout)</li>
              <li>• 고급 컴포넌트 (Modal, Dropdown, ThemeToggle)</li>
              <li>• 테마 시스템 (라이트/다크 모드)</li>
              <li>• 애니메이션 시스템 (Framer Motion)</li>
              <li>• 포괄적인 테스트 스위트</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              🔄 진행 중인 작업
            </h4>
            <ul className="text-body-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• 반응형 훅 (useBreakpoint, useMediaQuery)</li>
              <li>• 접근성 유틸리티 (포커스 트랩, 키보드 네비게이션)</li>
              <li>• 성능 최적화 (코드 분할, 메모이제이션)</li>
              <li>• PWA 기능 (Service Worker, Web App Manifest)</li>
              <li>• 문서화 및 Storybook</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 사용법 예시 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          🚀 빠른 시작
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-h4 font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              1. 컴포넌트 사용
            </h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <code className="text-caption-md font-mono">
                {`import { Button, Card, Input } from './design-system/components';
import { ThemeProvider } from './design-system/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Card padding="lg">
        <Input label="이름" placeholder="이름을 입력하세요" />
        <Button variant="primary">제출</Button>
      </Card>
    </ThemeProvider>
  );
}`}
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              2. 디자인 토큰 사용
            </h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <code className="text-caption-md font-mono">
                {`import { colors, spacing, typography } from './design-system/tokens';

const customStyle = {
  color: colors.primary[500],
  padding: spacing.lg,
  fontSize: typography.body.medium.fontSize,
};`}
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DesignSystemDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('overview');

  const renderDemo = () => {
    const demo = demos.find(d => d.id === currentDemo);
    if (!demo) return null;

    if (currentDemo === 'overview') {
      return <OverviewDemo />;
    }

    const Component = demo.component;
    return Component ? <Component /> : null;
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* 네비게이션 */}
        <nav className="border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-h3 font-bold" style={{ color: 'var(--text-primary)' }}>
                  Linear Design System
                </h1>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* 사이드바 */}
          <aside className="w-64 min-h-screen border-r" style={{ 
            borderColor: 'var(--border-primary)', 
            backgroundColor: 'var(--surface-secondary)' 
          }}>
            <div className="p-4">
              <nav className="space-y-1">
                {demos.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setCurrentDemo(demo.id as DemoType)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentDemo === demo.id
                        ? 'text-white'
                        : ''
                    }`}
                    style={{
                      backgroundColor: currentDemo === demo.id ? 'var(--primary-500)' : 'transparent',
                      color: currentDemo === demo.id ? 'white' : 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentDemo !== demo.id) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentDemo !== demo.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {demo.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {renderDemo()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DesignSystemDemo;