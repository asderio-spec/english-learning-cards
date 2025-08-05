import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Card } from './Card';

// Mock components for stories
const Button = ({ children, variant = 'primary', size = 'sm', ...props }: any) => (
  <button 
    className={`px-3 py-1.5 rounded text-sm font-medium ${
      variant === 'primary' ? 'bg-blue-500 text-white' : 
      variant === 'secondary' ? 'bg-gray-200 text-gray-800' :
      'bg-transparent text-blue-500'
    }`}
    {...props}
  >
    {children}
  </button>
);

const UserIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const meta: Meta<typeof Card> = {
  title: 'Design System/Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
콘텐츠를 그룹화하고 시각적으로 구분하는 카드 컴포넌트입니다. 다양한 스타일과 인터랙션을 지원합니다.

## 특징
- 3가지 변형: Default, Elevated, Outlined
- 3가지 패딩 크기: Small, Medium, Large
- 인터랙티브 카드 지원 (클릭 가능)
- 키보드 네비게이션 지원
- WCAG 2.1 AA 준수
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: '카드의 시각적 스타일'
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '카드 내부 패딩 크기'
    },
    interactive: {
      control: 'boolean',
      description: '클릭 가능한 카드로 만들기'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용'
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러 (interactive일 때만)'
    }
  },
  args: {
    onClick: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: (
      <>
        <h3 className="text-lg font-semibold mb-2">기본 카드</h3>
        <p className="text-gray-600">이것은 기본 카드 컴포넌트입니다.</p>
      </>
    )
  }
};

// 변형별 스토리
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card variant="default">
        <h3 className="text-lg font-semibold mb-2">Default</h3>
        <p className="text-gray-600">얇은 테두리가 있는 기본 카드입니다.</p>
      </Card>
      
      <Card variant="elevated">
        <h3 className="text-lg font-semibold mb-2">Elevated</h3>
        <p className="text-gray-600">그림자 효과가 있는 카드입니다.</p>
      </Card>
      
      <Card variant="outlined">
        <h3 className="text-lg font-semibold mb-2">Outlined</h3>
        <p className="text-gray-600">두꺼운 테두리가 있는 카드입니다.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '카드의 3가지 변형을 보여줍니다. Default는 기본 스타일, Elevated는 그림자 효과, Outlined는 강조된 테두리를 가집니다.'
      }
    }
  }
};

// 패딩 크기별 스토리
export const PaddingSizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card padding="sm" variant="outlined">
        <h4 className="font-semibold mb-1">Small Padding</h4>
        <p className="text-sm text-gray-600">16px 패딩이 적용됩니다.</p>
      </Card>
      
      <Card padding="md" variant="outlined">
        <h3 className="font-semibold mb-2">Medium Padding</h3>
        <p className="text-gray-600">24px 패딩이 적용됩니다.</p>
      </Card>
      
      <Card padding="lg" variant="outlined">
        <h2 className="text-lg font-semibold mb-3">Large Padding</h2>
        <p className="text-gray-600">32px 패딩이 적용됩니다.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '카드의 3가지 패딩 크기를 보여줍니다. Small(16px), Medium(24px), Large(32px) 패딩을 가집니다.'
      }
    }
  }
};

// 인터랙티브 카드 스토리
export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      <Card 
        interactive
        onClick={() => alert('카드가 클릭되었습니다!')}
        className="cursor-pointer"
      >
        <h3 className="text-lg font-semibold mb-2">클릭 가능한 카드</h3>
        <p className="text-gray-600">이 카드를 클릭해보세요.</p>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold mb-2">일반 카드</h3>
        <p className="text-gray-600">클릭할 수 없는 일반 카드입니다.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '인터랙티브 카드와 일반 카드의 차이를 보여줍니다. 인터랙티브 카드는 호버 효과와 클릭 이벤트를 지원합니다.'
      }
    }
  }
};

// 콘텐츠 카드 예제
export const ContentCard: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-md">
      <article>
        <header className="mb-3">
          <h2 className="text-xl font-bold mb-1">블로그 포스트 제목</h2>
          <time className="text-sm text-gray-500" dateTime="2024-01-15">
            2024년 1월 15일
          </time>
        </header>
        
        <p className="text-gray-700 mb-4">
          이것은 블로그 포스트의 요약 내용입니다. 사용자가 전체 내용을 읽기 전에 
          미리 볼 수 있는 간단한 설명을 제공합니다.
        </p>
        
        <footer className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HeartIcon />
            <span className="text-sm text-gray-600">24</span>
          </div>
          <Button variant="ghost" size="sm">
            더 읽기
          </Button>
        </footer>
      </article>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '블로그 포스트나 기사 등의 콘텐츠를 표시하는 카드 예제입니다. 시맨틱 HTML을 사용하여 접근성을 향상시켰습니다.'
      }
    }
  }
};

// 사용자 프로필 카드
export const UserProfileCard: Story = {
  render: () => (
    <Card 
      interactive
      variant="outlined"
      onClick={() => alert('프로필 보기')}
      aria-label="김철수의 프로필 보기"
      className="max-w-sm cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <UserIcon />
        <div>
          <h3 className="font-semibold text-lg">김철수</h3>
          <p className="text-gray-600">프론트엔드 개발자</p>
          <p className="text-sm text-gray-500">서울, 대한민국</p>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '사용자 프로필을 표시하는 인터랙티브 카드입니다. 클릭하면 상세 프로필로 이동할 수 있습니다.'
      }
    }
  }
};

// 통계 카드
export const StatCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
      <Card variant="default" padding="md">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">1,234</div>
          <div className="text-sm text-gray-600">총 사용자</div>
          <div className="text-xs text-green-600 mt-1">+12% 증가</div>
        </div>
      </Card>
      
      <Card variant="default" padding="md">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">567</div>
          <div className="text-sm text-gray-600">활성 사용자</div>
          <div className="text-xs text-green-600 mt-1">+8% 증가</div>
        </div>
      </Card>
      
      <Card variant="default" padding="md">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">89</div>
          <div className="text-sm text-gray-600">신규 가입</div>
          <div className="text-xs text-red-600 mt-1">-3% 감소</div>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '대시보드에서 사용되는 통계 카드들입니다. 숫자와 변화량을 시각적으로 표현합니다.'
      }
    }
  }
};

// 액션 카드
export const ActionCard: Story = {
  render: () => (
    <Card variant="elevated" padding="lg" className="max-w-md">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">프로젝트 생성</h3>
        <p className="text-gray-600 mb-6">
          새로운 프로젝트를 시작하여 팀과 함께 협업하세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary">
            프로젝트 생성
          </Button>
          <Button variant="ghost">
            템플릿 보기
          </Button>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '사용자 액션을 유도하는 카드입니다. 명확한 제목, 설명, 그리고 액션 버튼을 포함합니다.'
      }
    }
  }
};

// 전체 너비 카드
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card fullWidth variant="outlined" padding="lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">전체 너비 카드</h2>
            <p className="text-gray-600 mb-4">
              이 카드는 부모 컨테이너의 전체 너비를 사용합니다. 
              대시보드나 메인 콘텐츠 영역에서 주로 사용됩니다.
            </p>
          </div>
          <Button variant="primary">
            액션
          </Button>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '전체 너비를 사용하는 카드입니다. 대시보드나 메인 콘텐츠 영역에서 사용됩니다.'
      }
    }
  }
};

// 중첩된 카드
export const NestedCards: Story = {
  render: () => (
    <Card variant="elevated" padding="lg" className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">메인 카드</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="outlined" padding="sm">
          <h4 className="font-semibold mb-2">중첩 카드 1</h4>
          <p className="text-sm text-gray-600">
            카드 안에 다른 카드를 중첩할 수 있습니다.
          </p>
        </Card>
        
        <Card variant="outlined" padding="sm">
          <h4 className="font-semibold mb-2">중첩 카드 2</h4>
          <p className="text-sm text-gray-600">
            계층적 정보 구조를 표현할 때 유용합니다.
          </p>
        </Card>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '카드 안에 다른 카드를 중첩하여 계층적 정보 구조를 표현하는 예제입니다.'
      }
    }
  }
};

// 접근성 예제
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2">키보드 네비게이션</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            interactive
            onClick={() => alert('첫 번째 카드')}
            className="cursor-pointer"
          >
            <h4 className="font-semibold mb-1">Tab으로 포커스</h4>
            <p className="text-sm text-gray-600">키보드로 포커스할 수 있습니다.</p>
          </Card>
          
          <Card 
            interactive
            onClick={() => alert('두 번째 카드')}
            className="cursor-pointer"
          >
            <h4 className="font-semibold mb-1">Enter로 활성화</h4>
            <p className="text-sm text-gray-600">Enter나 Space로 활성화됩니다.</p>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">스크린 리더 지원</h3>
        <Card 
          interactive
          role="button"
          aria-label="사용자 설정 페이지로 이동"
          onClick={() => alert('설정 페이지로 이동')}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <UserIcon />
            <div>
              <h4 className="font-semibold">사용자 설정</h4>
              <p className="text-sm text-gray-600">프로필 및 계정 설정을 관리합니다.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '접근성 기능을 보여주는 스토리입니다. 키보드 네비게이션과 스크린 리더 지원을 확인할 수 있습니다.'
      }
    }
  }
};

// 다크 테마
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" className="bg-gray-800 border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-white">Default</h3>
          <p className="text-gray-300">다크 테마의 기본 카드입니다.</p>
        </Card>
        
        <Card variant="elevated" className="bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-white">Elevated</h3>
          <p className="text-gray-300">다크 테마의 그림자 카드입니다.</p>
        </Card>
        
        <Card variant="outlined" className="bg-gray-800 border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-white">Outlined</h3>
          <p className="text-gray-300">다크 테마의 테두리 카드입니다.</p>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다크 테마에서의 카드 모습입니다. 배경색과 텍스트 색상이 자동으로 조정됩니다.'
      }
    }
  }
};