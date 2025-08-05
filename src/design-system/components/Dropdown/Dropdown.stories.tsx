import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Dropdown, DropdownItem } from './Dropdown';

// Mock icons for stories
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const FlagIcon = ({ country }: { country: string }) => (
  <span className="text-lg" role="img" aria-label={`${country} 국기`}>
    {country === 'ko' ? '🇰🇷' : country === 'en' ? '🇺🇸' : country === 'ja' ? '🇯🇵' : '🇨🇳'}
  </span>
);

const meta: Meta<typeof Dropdown> = {
  title: 'Design System/Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
사용자가 여러 옵션 중 하나를 선택할 수 있는 드롭다운 컴포넌트입니다.

## 특징
- 키보드 네비게이션 완전 지원 (화살표 키, Enter, ESC)
- 아이콘 지원
- 비활성화된 옵션 지원
- 부드러운 애니메이션 (접근성 설정 고려)
- WCAG 2.1 AA 준수
- 외부 클릭으로 자동 닫기
        `
      }
    }
  },
  argTypes: {
    items: {
      description: '드롭다운 아이템 목록'
    },
    value: {
      description: '선택된 값'
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용'
    },
    onChange: {
      action: 'changed',
      description: '값 변경 콜백'
    }
  },
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 드롭다운 아이템들
const basicItems: DropdownItem[] = [
  { id: '1', label: '옵션 1', value: 'option1' },
  { id: '2', label: '옵션 2', value: 'option2' },
  { id: '3', label: '옵션 3', value: 'option3' },
  { id: '4', label: '옵션 4', value: 'option4' }
];

// 기본 스토리
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>();
    
    return (
      <Dropdown
        {...args}
        items={basicItems}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        placeholder="옵션을 선택하세요"
      />
    );
  }
};

// 아이콘이 있는 드롭다운
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    const itemsWithIcons: DropdownItem[] = [
      { id: '1', label: '프로필', value: 'profile', icon: <UserIcon /> },
      { id: '2', label: '설정', value: 'settings', icon: <SettingsIcon /> },
      { id: '3', label: '로그아웃', value: 'logout', icon: <LogoutIcon /> }
    ];
    
    return (
      <Dropdown
        items={itemsWithIcons}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        placeholder="메뉴를 선택하세요"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘이 포함된 드롭다운입니다. 각 옵션에 시각적 구분을 위한 아이콘을 추가할 수 있습니다.'
      }
    }
  }
};

// 비활성화된 옵션이 있는 드롭다운
export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    const itemsWithDisabled: DropdownItem[] = [
      { id: '1', label: '사용 가능한 옵션 1', value: 'available1' },
      { id: '2', label: '비활성화된 옵션', value: 'disabled', disabled: true },
      { id: '3', label: '사용 가능한 옵션 2', value: 'available2' },
      { id: '4', label: '또 다른 비활성화 옵션', value: 'disabled2', disabled: true },
      { id: '5', label: '사용 가능한 옵션 3', value: 'available3' }
    ];
    
    return (
      <Dropdown
        items={itemsWithDisabled}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        placeholder="옵션을 선택하세요"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '일부 옵션이 비활성화된 드롭다운입니다. 비활성화된 옵션은 선택할 수 없고 시각적으로 구분됩니다.'
      }
    }
  }
};

// 언어 선택 드롭다운
export const LanguageSelector: Story = {
  render: () => {
    const [language, setLanguage] = useState<string>('ko');
    
    const languages: DropdownItem[] = [
      { id: 'ko', label: '한국어', value: 'ko', icon: <FlagIcon country="ko" /> },
      { id: 'en', label: 'English', value: 'en', icon: <FlagIcon country="en" /> },
      { id: 'ja', label: '日本語', value: 'ja', icon: <FlagIcon country="ja" /> },
      { id: 'zh', label: '中文', value: 'zh', icon: <FlagIcon country="zh" /> }
    ];
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            언어 선택
          </label>
          <Dropdown
            items={languages}
            value={language}
            onChange={(newValue) => setLanguage(newValue)}
            aria-label="언어 선택"
          />
        </div>
        <div className="text-sm text-gray-600">
          선택된 언어: <strong>{languages.find(l => l.value === language)?.label}</strong>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '언어 선택을 위한 드롭다운입니다. 국기 이모지와 함께 각 언어를 표시합니다.'
      }
    }
  }
};

// 상태별 드롭다운
export const States: Story = {
  render: () => {
    const [normalValue, setNormalValue] = useState<string>();
    const [disabledValue, setDisabledValue] = useState<string>('option2');
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">일반 상태</h3>
          <Dropdown
            items={basicItems}
            value={normalValue}
            onChange={(newValue) => setNormalValue(newValue)}
            placeholder="옵션을 선택하세요"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">선택된 상태</h3>
          <Dropdown
            items={basicItems}
            value="option2"
            onChange={() => {}}
            placeholder="옵션을 선택하세요"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">비활성화 상태</h3>
          <Dropdown
            items={basicItems}
            value={disabledValue}
            onChange={(newValue) => setDisabledValue(newValue)}
            placeholder="옵션을 선택하세요"
            disabled
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '드롭다운의 다양한 상태를 보여줍니다. 일반, 선택된 상태, 비활성화 상태를 확인할 수 있습니다.'
      }
    }
  }
};

// 전체 너비 드롭다운
export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    return (
      <div className="w-96 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 선택
          </label>
          <Dropdown
            items={[
              { id: '1', label: '전자제품', value: 'electronics' },
              { id: '2', label: '의류', value: 'clothing' },
              { id: '3', label: '도서', value: 'books' },
              { id: '4', label: '스포츠 용품', value: 'sports' },
              { id: '5', label: '홈 & 가든', value: 'home' }
            ]}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            placeholder="카테고리를 선택하세요"
            fullWidth
          />
        </div>
        
        <div className="text-sm text-gray-600">
          선택된 카테고리: {value ? <strong>{value}</strong> : '없음'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '전체 너비를 사용하는 드롭다운입니다. 폼에서 다른 입력 필드들과 일관된 너비를 유지할 때 사용합니다.'
      }
    }
  }
};

// 긴 목록 드롭다운
export const LongList: Story = {
  render: () => {
    const [country, setCountry] = useState<string>();
    
    const countries: DropdownItem[] = [
      { id: 'kr', label: '대한민국', value: 'kr' },
      { id: 'us', label: '미국', value: 'us' },
      { id: 'jp', label: '일본', value: 'jp' },
      { id: 'cn', label: '중국', value: 'cn' },
      { id: 'de', label: '독일', value: 'de' },
      { id: 'fr', label: '프랑스', value: 'fr' },
      { id: 'gb', label: '영국', value: 'gb' },
      { id: 'it', label: '이탈리아', value: 'it' },
      { id: 'es', label: '스페인', value: 'es' },
      { id: 'ca', label: '캐나다', value: 'ca' },
      { id: 'au', label: '호주', value: 'au' },
      { id: 'br', label: '브라질', value: 'br' },
      { id: 'in', label: '인도', value: 'in' },
      { id: 'ru', label: '러시아', value: 'ru' },
      { id: 'mx', label: '멕시코', value: 'mx' }
    ];
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            국가 선택
          </label>
          <Dropdown
            items={countries}
            value={country}
            onChange={(newValue) => setCountry(newValue)}
            placeholder="국가를 선택하세요"
          />
        </div>
        <div className="text-sm text-gray-600">
          선택된 국가: {country ? <strong>{countries.find(c => c.value === country)?.label}</strong> : '없음'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '많은 옵션이 있는 드롭다운입니다. 최대 높이가 설정되어 스크롤이 가능합니다.'
      }
    }
  }
};

// 폼에서 사용하는 예제
export const InForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      category: '',
      priority: '',
      status: ''
    });
    
    const categories: DropdownItem[] = [
      { id: 'bug', label: '버그 리포트', value: 'bug' },
      { id: 'feature', label: '기능 요청', value: 'feature' },
      { id: 'improvement', label: '개선 사항', value: 'improvement' },
      { id: 'question', label: '질문', value: 'question' }
    ];
    
    const priorities: DropdownItem[] = [
      { id: 'low', label: '낮음', value: 'low' },
      { id: 'medium', label: '보통', value: 'medium' },
      { id: 'high', label: '높음', value: 'high' },
      { id: 'urgent', label: '긴급', value: 'urgent' }
    ];
    
    const statuses: DropdownItem[] = [
      { id: 'open', label: '열림', value: 'open' },
      { id: 'progress', label: '진행 중', value: 'progress' },
      { id: 'review', label: '검토 중', value: 'review' },
      { id: 'closed', label: '닫힘', value: 'closed', disabled: true }
    ];
    
    return (
      <form className="w-96 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 *
          </label>
          <Dropdown
            items={categories}
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            placeholder="카테고리를 선택하세요"
            fullWidth
            aria-label="이슈 카테고리 선택"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            우선순위
          </label>
          <Dropdown
            items={priorities}
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            placeholder="우선순위를 선택하세요"
            fullWidth
            aria-label="우선순위 선택"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태
          </label>
          <Dropdown
            items={statuses}
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            placeholder="상태를 선택하세요"
            fullWidth
            aria-label="상태 선택"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              alert(`폼 데이터: ${JSON.stringify(formData, null, 2)}`);
            }}
          >
            제출
          </button>
        </div>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 폼에서 사용되는 드롭다운들입니다. 라벨과 함께 사용하여 접근성을 향상시킵니다.'
      }
    }
  }
};

// 접근성 예제
export const Accessibility: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">키보드 네비게이션</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> - 드롭다운으로 포커스 이동</p>
            <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> 또는 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> - 드롭다운 열기/옵션 선택</p>
            <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↑</kbd> <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↓</kbd> - 옵션 간 이동</p>
            <p>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> - 드롭다운 닫기</p>
          </div>
          
          <Dropdown
            items={[
              { id: '1', label: '첫 번째 옵션', value: 'first' },
              { id: '2', label: '두 번째 옵션', value: 'second' },
              { id: '3', label: '세 번째 옵션 (비활성화)', value: 'third', disabled: true },
              { id: '4', label: '네 번째 옵션', value: 'fourth' }
            ]}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            placeholder="키보드로 조작해보세요"
            aria-label="접근성 테스트 드롭다운"
            aria-describedby="dropdown-help"
          />
          
          <div id="dropdown-help" className="text-sm text-gray-500 mt-2">
            키보드를 사용하여 드롭다운을 조작할 수 있습니다.
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">스크린 리더 지원</h3>
          <p className="text-sm text-gray-600 mb-4">
            이 드롭다운은 적절한 ARIA 속성을 사용하여 스크린 리더와 호환됩니다.
            role="listbox"와 aria-selected 속성이 적용되어 있습니다.
          </p>
          
          <Dropdown
            items={basicItems}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            placeholder="스크린 리더 테스트"
            aria-label="스크린 리더 호환 드롭다운"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '드롭다운의 접근성 기능을 보여주는 스토리입니다. 키보드 네비게이션과 스크린 리더 지원을 확인할 수 있습니다.'
      }
    }
  }
};

// 다크 테마
export const DarkTheme: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    return (
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">다크 테마 드롭다운</h3>
          
          <div style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
            <Dropdown
              items={[
                { id: '1', label: '다크 옵션 1', value: 'dark1', icon: <UserIcon /> },
                { id: '2', label: '다크 옵션 2', value: 'dark2', icon: <SettingsIcon /> },
                { id: '3', label: '다크 옵션 3', value: 'dark3', icon: <LogoutIcon /> }
              ]}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              placeholder="다크 테마에서 선택하세요"
            />
          </div>
          
          <p className="text-gray-300 text-sm">
            다크 테마에서는 색상이 자동으로 조정됩니다.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '다크 테마에서의 드롭다운 모습입니다. 배경색과 텍스트 색상이 자동으로 조정됩니다.'
      }
    }
  }
};