/**
 * Linear 디자인 시스템 - 향상된 테마 시스템 데모
 * Task 4.1 구현 결과 시연
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { debugTheme, validateThemeAccessibility, generateColorPalette } from '../themes';

const ThemeDemo: React.FC = () => {
  const { config, theme, setTheme, isDarkMode, isSystemTheme } = useTheme();
  
  // 테마 디버깅 정보 출력
  const handleDebugTheme = () => {
    debugTheme(theme);
  };

  // 접근성 검증 및 색상 팔레트 생성
  const accessibility = validateThemeAccessibility(theme);
  const colorPalette = generateColorPalette(theme);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          향상된 테마 시스템 데모
        </h2>
        <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
          Task 4.1 구현 결과: 라이트/다크 테마 정의 및 CSS 변수 동적 적용 시스템
        </p>
      </div>

      {/* 테마 컨트롤 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          테마 컨트롤
        </h3>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            variant={config.currentTheme === 'light' ? 'primary' : 'secondary'}
            onClick={() => setTheme('light')}
          >
            라이트 모드
          </Button>
          <Button
            variant={config.currentTheme === 'dark' ? 'primary' : 'secondary'}
            onClick={() => setTheme('dark')}
          >
            다크 모드
          </Button>
          <Button
            variant={config.currentTheme === 'system' ? 'primary' : 'secondary'}
            onClick={() => setTheme('system')}
          >
            시스템 설정
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--text-secondary)' }}>빠른 전환:</span>
          <ThemeToggle showLabel />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDebugTheme}
          >
            디버그 정보
          </Button>
        </div>
      </Card>

      {/* 현재 테마 정보 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          현재 테마 정보
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>설정된 테마:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              {config.currentTheme}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>실제 적용된 테마:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              {config.resolvedTheme}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>시스템 테마:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              {config.systemTheme}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>다크 모드 여부:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              {isDarkMode ? '예' : '아니오'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>의미적 색상:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              5개 카테고리
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>인터랙션 상태:</span>
            <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
              4개 상태
            </span>
          </div>
        </div>
      </Card>

      {/* 색상 팔레트 미리보기 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          현재 테마 색상 팔레트
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 배경 색상 */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              배경 색상
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.background.primary,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Primary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Secondary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.background.elevated,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Elevated
                </span>
              </div>
            </div>
          </div>

          {/* 텍스트 색상 */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              텍스트 색상
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-primary)',
                    color: theme.colors.text.primary
                  }}
                >
                  Aa
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Primary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-primary)',
                    color: theme.colors.text.secondary
                  }}
                >
                  Aa
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Secondary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-primary)',
                    color: theme.colors.text.disabled
                  }}
                >
                  Aa
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Disabled
                </span>
              </div>
            </div>
          </div>

          {/* 표면 색상 */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              표면 색상
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.surface.primary,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Primary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.surface.secondary,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Secondary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ 
                    backgroundColor: theme.colors.surface.tertiary,
                    borderColor: 'var(--border-primary)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tertiary
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 의미적 색상 시스템 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          의미적 색상 시스템 (새로 추가됨)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(colorPalette.semantic).map(([name, colors]) => (
            <div key={name}>
              <h4 className="font-medium mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>
                {name}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ 
                      backgroundColor: colors.background,
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Background
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ 
                      backgroundColor: colors.border,
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Border
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ 
                      backgroundColor: colors.text,
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Text
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ 
                      backgroundColor: colors.textStrong,
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Strong
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 인터랙션 상태 색상 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          인터랙션 상태 색상 (새로 추가됨)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(colorPalette.interactive).map(([name, color]) => (
            <div key={name} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg border mx-auto mb-2"
                style={{ 
                  backgroundColor: color,
                  borderColor: 'var(--border-primary)'
                }}
              />
              <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 접근성 검증 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          접근성 검증 (새로 추가됨)
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full ${accessibility.isValid ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              전체 검증: {accessibility.isValid ? '통과' : '실패'}
            </span>
          </div>
          
          {accessibility.issues.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                발견된 문제:
              </p>
              <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                {accessibility.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* 컴포넌트 미리보기 */}
      <Card padding="lg">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          컴포넌트 미리보기
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="default" padding="md">
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Default Card
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                기본 카드 스타일입니다.
              </p>
            </Card>
            
            <Card variant="elevated" padding="md">
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Elevated Card
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                그림자가 있는 카드 스타일입니다.
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThemeDemo;