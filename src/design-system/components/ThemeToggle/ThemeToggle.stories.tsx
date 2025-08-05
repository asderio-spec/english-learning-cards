import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Design System/Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
라이트/다크 모드를 전환하는 테마 토글 컴포넌트입니다.

## 특징
- 라이트/다크/시스템 테마 지원
- 3가지 버튼 변형: Primary, Secondary, Ghost
- 3가지 크기: Small, Medium, Large
- 라벨 표시 옵션
- 시각적 아이콘으로 현재 테마 상태 표시
- 완전한 접근성 지원 (ARIA 라벨, 키보드 네비게이션)
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    )
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: '버튼 변형'
    },
    showLabel: {
      control: 'boolean',
      description: '라벨 표시 여부'
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {}
};

// 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <ThemeToggle size="sm" />
        <p className="text-sm text-gray-600 mt-2">Small</p>
      </div>
      <div className="text-center">
        <ThemeToggle size="md" />
        <p className="text-sm text-gray-600 mt-2">Medium</p>
      </div>
      <div className="text-center">
        <ThemeToggle size="lg" />
        <p className="text-sm text-gray-600 mt-2">Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '테마 토글의 3가지 크기를 보여줍니다. Small, Medium, Large 크기를 지원합니다.'
      }
    }
  }
};

// 변형별 스토리
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <ThemeToggle variant="primary" />
        <p className="text-sm text-gray-600 mt-2">Primary</p>
      </div>
      <div className="text-center">
        <ThemeToggle variant="secondary" />
        <p className="text-sm text-gray-600 mt-2">Secondary</p>
      </div>
      <div className="text-center">
        <ThemeToggle variant="ghost" />
        <p className="text-sm text-gray-600 mt-2">Ghost</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '테마 토글의 3가지 변형을 보여줍니다. Primary, Secondary, Ghost 스타일을 지원합니다.'
      }
    }
  }
};

// 라벨이 있는 스토리
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ThemeToggle showLabel />
        <span className="text-sm text-gray-600">기본 크기 + 라벨</span>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle showLabel size="lg" variant="primary" />
        <span className="text-sm text-gray-600">큰 크기 + Primary + 라벨</span>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle showLabel size="sm" variant="secondary" />
        <span className="text-sm text-gray-600">작은 크기 + Secondary + 라벨</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '라벨이 표시되는 테마 토글입니다. 현재 테마 상태를 텍스트로도 확인할 수 있습니다.'
      }
    }
  }
};

// 네비게이션 바에서 사용하는 예제
export const InNavigation: Story = {
  render: () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-full max-w-2xl">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-gray-900">로고</div>
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-gray-700 hover:text-gray-900">홈</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">제품</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">회사소개</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">연락처</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm">
            로그인
          </button>
          <ThemeToggle variant="ghost" />
        </div>
      </nav>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '네비게이션 바에서 사용되는 테마 토글입니다. 다른 네비게이션 요소들과 조화롭게 배치됩니다.'
      }
    }
  }
};

// 사이드바에서 사용하는 예제
export const InSidebar: Story = {
  render: () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-64">
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div>
            <div className="font-medium text-gray-900">사용자</div>
            <div className="text-sm text-gray-500">user@example.com</div>
          </div>
        </div>
        
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <span>대시보드</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <span>프로젝트</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <span>설정</span>
          </a>
        </nav>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-700">테마</span>
            <ThemeToggle variant="ghost" size="sm" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '사이드바에서 사용되는 테마 토글입니다. 설정 영역에 배치되어 사용자가 쉽게 테마를 변경할 수 있습니다.'
      }
    }
  }
};

// 설정 페이지에서 사용하는 예제
export const InSettings: Story = {
  render: () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">환경 설정</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <div className="font-medium text-gray-900">알림</div>
            <div className="text-sm text-gray-500">이메일 알림을 받습니다</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <div className="font-medium text-gray-900">언어</div>
            <div className="text-sm text-gray-500">한국어</div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            변경
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">테마</div>
            <div className="text-sm text-gray-500">라이트/다크 모드를 선택합니다</div>
          </div>
          <ThemeToggle showLabel variant="secondary" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '설정 페이지에서 사용되는 테마 토글입니다. 라벨과 함께 표시되어 사용자가 현재 상태를 쉽게 확인할 수 있습니다.'
      }
    }
  }
};

// 툴바에서 사용하는 예제
export const InToolbar: Story = {
  render: () => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 w-full max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18m-9-9l9 9-9 9"/>
            </svg>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <ThemeToggle variant="ghost" size="sm" />
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '툴바에서 사용되는 테마 토글입니다. 다른 도구 버튼들과 함께 배치되어 일관된 인터페이스를 제공합니다.'
      }
    }
  }
};

// 접근성 예제
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">접근성 기능</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> - 버튼으로 포커스 이동</p>
          <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> 또는 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> - 테마 전환</p>
          <p>• 스크린 리더를 위한 적절한 ARIA 라벨 제공</p>
          <p>• 현재 테마 상태를 시각적 아이콘으로 표시</p>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm text-gray-600">키보드로 조작해보세요</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">시각적 피드백</h3>
        <p className="text-sm text-gray-600 mb-4">
          아이콘이 현재 테마 상태를 명확하게 표시합니다:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="3" fill="currentColor" />
              <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.95 3.05l-1.41 1.41M4.46 11.54l-1.41 1.41M12.95 12.95l-1.41-1.41M4.46 4.46L3.05 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>라이트 모드 (태양 아이콘)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1a7 7 0 1 0 0 14 5.5 5.5 0 0 1 0-11 7.006 7.006 0 0 0 0-3Z" fill="currentColor" />
            </svg>
            <span>다크 모드 (달 아이콘)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2.5a5.5 5.5 0 0 0-5.5 5.5c0 1.61.69 3.06 1.79 4.06L8 8.35l3.71 3.71A5.48 5.48 0 0 0 13.5 8 5.5 5.5 0 0 0 8 2.5Z" fill="currentColor" />
              <path d="M8 13.5a5.48 5.48 0 0 1-3.71-1.44L8 8.35l3.71 3.71A5.48 5.48 0 0 1 8 13.5Z" fill="currentColor" opacity="0.5" />
            </svg>
            <span>시스템 테마 (반반 아이콘)</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '테마 토글의 접근성 기능을 보여주는 스토리입니다. 키보드 네비게이션과 시각적 피드백을 확인할 수 있습니다.'
      }
    }
  }
};

// 반응형 예제
export const Responsive: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">모바일 (작은 화면)</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">테마</span>
            <ThemeToggle size="sm" variant="ghost" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">태블릿 (중간 화면)</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-w-md">
          <div className="flex items-center justify-between">
            <span className="font-medium">테마 설정</span>
            <ThemeToggle showLabel variant="secondary" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">데스크톱 (큰 화면)</h3>
        <div className="bg-gray-50 p-6 rounded-lg max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">테마 설정</div>
              <div className="text-sm text-gray-600">라이트 또는 다크 모드를 선택하세요</div>
            </div>
            <ThemeToggle showLabel size="lg" variant="primary" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 화면 크기에서의 테마 토글 사용 패턴입니다. 화면 크기에 따라 적절한 크기와 라벨 표시를 조정할 수 있습니다.'
      }
    }
  }
};