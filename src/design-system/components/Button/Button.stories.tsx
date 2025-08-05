import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

// Mock icons for stories
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12,5 19,12 12,19"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Design System/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
사용자 액션을 트리거하는 버튼 컴포넌트입니다. 다양한 스타일과 상태를 지원하며, 완전한 접근성을 제공합니다.

## 특징
- 3가지 변형: Primary, Secondary, Ghost
- 3가지 크기: Small, Medium, Large  
- 로딩 상태 및 비활성화 상태 지원
- 아이콘 지원 (왼쪽, 오른쪽)
- 키보드 네비게이션 완전 지원
- WCAG 2.1 AA 준수
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: '버튼의 시각적 스타일'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기'
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용'
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러'
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
    children: '기본 버튼'
  }
};

// 변형별 스토리
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 3가지 변형을 보여줍니다. Primary는 주요 액션, Secondary는 보조 액션, Ghost는 최소한의 강조가 필요한 액션에 사용합니다.'
      }
    }
  }
};

// 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 3가지 크기를 보여줍니다. Small(32px), Medium(40px), Large(48px) 높이를 가집니다.'
      }
    }
  }
};

// 상태별 스토리
export const States: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 다양한 상태를 보여줍니다. 로딩 상태에서는 스피너가 표시되고, 비활성화 상태에서는 클릭이 불가능합니다.'
      }
    }
  }
};

// 아이콘 스토리
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button icon={<PlusIcon />}>
        추가하기
      </Button>
      <Button iconRight={<ArrowRightIcon />}>
        다음 단계
      </Button>
      <Button 
        icon={<PlusIcon />}
        iconRight={<ArrowRightIcon />}
      >
        양쪽 아이콘
      </Button>
      <Button 
        icon={<UserIcon />}
        aria-label="사용자 프로필"
        variant="ghost"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘과 함께 사용하는 버튼들입니다. 왼쪽, 오른쪽, 또는 양쪽에 아이콘을 배치할 수 있습니다. 아이콘만 있는 버튼은 반드시 aria-label을 제공해야 합니다.'
      }
    }
  }
};

// 전체 너비 스토리
export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <div className="space-y-3">
        <Button fullWidth variant="primary">
          전체 너비 Primary 버튼
        </Button>
        <Button fullWidth variant="secondary">
          전체 너비 Secondary 버튼
        </Button>
        <Button fullWidth variant="ghost">
          전체 너비 Ghost 버튼
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '부모 컨테이너의 전체 너비를 사용하는 버튼들입니다. 폼이나 카드에서 주로 사용됩니다.'
      }
    }
  }
};

// 로딩 상태 스토리
export const Loading: Story = {
  args: {
    loading: true,
    children: '저장 중...'
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 상태의 버튼입니다. 스피너가 표시되고 클릭이 비활성화됩니다.'
      }
    }
  }
};

// 비활성화 상태 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화된 버튼'
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 버튼입니다. 투명도가 60%로 설정되고 클릭이 불가능합니다.'
      }
    }
  }
};

// 다크 테마 스토리
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex gap-4 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다크 테마에서의 버튼 모습입니다. 자동으로 테마에 맞는 색상이 적용됩니다.'
      }
    }
  }
};

// 접근성 테스트 스토리
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">키보드 네비게이션</h3>
        <div className="flex gap-2">
          <Button>Tab으로 포커스</Button>
          <Button>Enter/Space로 활성화</Button>
          <Button disabled>비활성화는 건너뜀</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">스크린 리더 지원</h3>
        <div className="flex gap-2">
          <Button aria-label="사용자 메뉴 열기">
            <UserIcon />
          </Button>
          <Button aria-describedby="save-help">
            저장
          </Button>
          <Button loading aria-label="저장 중입니다">
            저장 중...
          </Button>
        </div>
        <div id="save-help" className="text-sm text-gray-600 mt-1">
          변경사항을 서버에 저장합니다
        </div>
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

// 실제 사용 예제
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      {/* 폼 예제 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">폼 액션</h3>
        <div className="flex gap-2">
          <Button variant="primary" type="submit">
            저장
          </Button>
          <Button variant="ghost" type="button">
            취소
          </Button>
        </div>
      </div>

      {/* 카드 액션 예제 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">카드 액션</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="primary">
            편집
          </Button>
          <Button size="sm" variant="secondary">
            복사
          </Button>
          <Button size="sm" variant="ghost">
            삭제
          </Button>
        </div>
      </div>

      {/* 네비게이션 예제 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">네비게이션</h3>
        <div className="flex gap-2">
          <Button variant="ghost" icon={<ArrowRightIcon />}>
            이전
          </Button>
          <Button variant="primary" iconRight={<ArrowRightIcon />}>
            다음
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 애플리케이션에서 사용되는 버튼 패턴들입니다. 폼, 카드, 네비게이션 등 다양한 컨텍스트에서의 사용법을 보여줍니다.'
      }
    }
  }
};

// 반응형 예제
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">모바일 (작은 화면)</h3>
        <Button fullWidth size="lg">
          모바일 버튼
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">태블릿 (중간 화면)</h3>
        <div className="flex gap-2">
          <Button size="md" className="flex-1">
            취소
          </Button>
          <Button size="md" variant="primary" className="flex-1">
            확인
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">데스크톱 (큰 화면)</h3>
        <div className="flex gap-2 justify-end">
          <Button size="md">취소</Button>
          <Button size="md" variant="primary">확인</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 화면 크기에서의 버튼 사용 패턴입니다. 모바일에서는 전체 너비, 데스크톱에서는 적절한 크기로 사용합니다.'
      }
    }
  }
};