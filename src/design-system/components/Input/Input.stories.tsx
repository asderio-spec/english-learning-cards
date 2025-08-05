import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';
import { useState } from 'react';

// Mock icons for stories
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Design System/Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
사용자 입력을 받는 입력 필드 컴포넌트입니다. 다양한 타입과 상태를 지원하며, 완전한 접근성을 제공합니다.

## 특징
- 다양한 입력 타입 지원 (text, email, password, search 등)
- 3가지 크기: Small, Medium, Large
- 에러 상태 및 도움말 텍스트 지원
- 아이콘 지원 (왼쪽, 오른쪽)
- 비밀번호 표시/숨김 토글
- 키보드 네비게이션 완전 지원
- WCAG 2.1 AA 준수
        `
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
      description: '입력 필드 타입'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력 필드 크기'
    },
    error: {
      control: 'boolean',
      description: '에러 상태'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    required: {
      control: 'boolean',
      description: '필수 입력 여부'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용'
    },
    label: {
      control: 'text',
      description: '라벨 텍스트'
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트'
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트'
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지'
    },
    onChange: {
      action: 'changed',
      description: '값 변경 이벤트 핸들러'
    }
  },
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    label: '이름',
    placeholder: '이름을 입력하세요'
  }
};

// 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        size="sm"
        label="Small Input"
        placeholder="작은 크기 입력 필드"
      />
      <Input 
        size="md"
        label="Medium Input"
        placeholder="중간 크기 입력 필드"
      />
      <Input 
        size="lg"
        label="Large Input"
        placeholder="큰 크기 입력 필드"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '입력 필드의 3가지 크기를 보여줍니다. Small(32px), Medium(40px), Large(48px) 높이를 가집니다.'
      }
    }
  }
};

// 타입별 스토리
export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        type="text"
        label="텍스트"
        placeholder="일반 텍스트 입력"
      />
      <Input 
        type="email"
        label="이메일"
        placeholder="example@email.com"
      />
      <Input 
        type="password"
        label="비밀번호"
        placeholder="비밀번호 입력"
      />
      <Input 
        type="search"
        label="검색"
        placeholder="검색어 입력"
      />
      <Input 
        type="tel"
        label="전화번호"
        placeholder="010-1234-5678"
      />
      <Input 
        type="url"
        label="웹사이트"
        placeholder="https://example.com"
      />
      <Input 
        type="number"
        label="숫자"
        placeholder="숫자만 입력"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 입력 타입을 보여줍니다. 각 타입에 따라 브라우저에서 적절한 키보드와 검증을 제공합니다.'
      }
    }
  }
};

// 상태별 스토리
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="일반 상태"
        placeholder="일반 입력 필드"
      />
      <Input 
        label="포커스 상태"
        placeholder="포커스된 입력 필드"
        autoFocus
      />
      <Input 
        label="에러 상태"
        placeholder="에러가 있는 입력 필드"
        error
        errorMessage="이 필드는 필수입니다"
      />
      <Input 
        label="비활성화 상태"
        placeholder="비활성화된 입력 필드"
        disabled
        value="비활성화된 값"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '입력 필드의 다양한 상태를 보여줍니다. 각 상태에 따라 시각적 피드백이 제공됩니다.'
      }
    }
  }
};

// 아이콘이 있는 입력 필드
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="검색"
        placeholder="검색어 입력"
        leftIcon={<SearchIcon />}
      />
      <Input 
        label="사용자명"
        placeholder="사용자명 입력"
        leftIcon={<UserIcon />}
      />
      <Input 
        label="이메일"
        placeholder="이메일 주소"
        leftIcon={<MailIcon />}
        rightIcon={<ClearIcon />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘이 포함된 입력 필드들입니다. 왼쪽, 오른쪽, 또는 양쪽에 아이콘을 배치할 수 있습니다.'
      }
    }
  }
};

// 비밀번호 입력 필드
export const PasswordInput: Story = {
  render: () => {
    const [password, setPassword] = useState('');
    
    return (
      <div className="space-y-4 w-80">
        <Input 
          type="password"
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="8자 이상, 대소문자와 숫자를 포함해야 합니다"
        />
        <Input 
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호 다시 입력"
          error={password !== '' && password.length < 8}
          errorMessage="비밀번호가 일치하지 않습니다"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '비밀번호 입력 필드입니다. 자동으로 표시/숨김 토글 버튼이 제공됩니다.'
      }
    }
  }
};

// 도움말 텍스트가 있는 입력 필드
export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="사용자명"
        placeholder="사용자명 입력"
        helperText="3-20자의 영문, 숫자만 사용 가능합니다"
      />
      <Input 
        label="이메일"
        type="email"
        placeholder="이메일 주소"
        helperText="유효한 이메일 주소를 입력하세요"
      />
      <Input 
        label="전화번호"
        type="tel"
        placeholder="010-1234-5678"
        helperText="하이픈(-)을 포함하여 입력하세요"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '도움말 텍스트가 포함된 입력 필드들입니다. 사용자에게 입력 형식이나 요구사항을 안내합니다.'
      }
    }
  }
};

// 필수 입력 필드
export const RequiredFields: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="이름"
        placeholder="이름 입력"
        required
      />
      <Input 
        label="이메일"
        type="email"
        placeholder="이메일 주소"
        required
        helperText="필수 입력 항목입니다"
      />
      <Input 
        label="전화번호 (선택)"
        type="tel"
        placeholder="전화번호 입력"
        helperText="선택 사항입니다"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '필수 입력 필드와 선택 입력 필드를 구분하여 표시합니다. 필수 필드는 라벨에 * 표시가 추가됩니다.'
      }
    }
  }
};

// 전체 너비 입력 필드
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Input 
        fullWidth
        label="제목"
        placeholder="제목을 입력하세요"
      />
      <Input 
        fullWidth
        label="설명"
        placeholder="상세 설명을 입력하세요"
        helperText="최대 500자까지 입력 가능합니다"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '부모 컨테이너의 전체 너비를 사용하는 입력 필드들입니다.'
      }
    }
  }
};

// 폼 예제
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
    
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name) newErrors.name = '이름은 필수입니다';
      if (!formData.email) newErrors.email = '이메일은 필수입니다';
      if (!formData.password) newErrors.password = '비밀번호는 필수입니다';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    return (
      <form className="w-80 space-y-4" onSubmit={(e) => {
        e.preventDefault();
        if (validateForm()) {
          alert('폼이 성공적으로 제출되었습니다!');
        }
      }}>
        <Input 
          label="이름"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          errorMessage={errors.name}
          required
        />
        
        <Input 
          type="email"
          label="이메일"
          placeholder="이메일 주소"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          errorMessage={errors.email}
          leftIcon={<MailIcon />}
          required
        />
        
        <Input 
          type="password"
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange('password')}
          error={!!errors.password}
          errorMessage={errors.password}
          helperText="8자 이상, 대소문자와 숫자를 포함"
          required
        />
        
        <Input 
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호 다시 입력"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          required
        />
        
        <Input 
          type="tel"
          label="전화번호 (선택)"
          placeholder="010-1234-5678"
          value={formData.phone}
          onChange={handleChange('phone')}
          helperText="하이픈을 포함하여 입력하세요"
        />
        
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          가입하기
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 회원가입 폼에서 사용되는 입력 필드들의 예제입니다. 실시간 검증과 에러 처리를 포함합니다.'
      }
    }
  }
};

// 검색 입력 필드
export const SearchInput: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    return (
      <div className="w-96">
        <Input 
          type="search"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<SearchIcon />}
          rightIcon={searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600"
              aria-label="검색어 지우기"
            >
              <ClearIcon />
            </button>
          )}
          fullWidth
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '검색 기능을 위한 입력 필드입니다. 검색 아이콘과 지우기 버튼이 포함되어 있습니다.'
      }
    }
  }
};

// 접근성 예제
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-3">키보드 네비게이션</h3>
        <div className="space-y-3">
          <Input 
            label="첫 번째 필드"
            placeholder="Tab으로 포커스"
          />
          <Input 
            label="두 번째 필드"
            placeholder="Shift+Tab으로 이전 필드"
          />
          <Input 
            label="세 번째 필드"
            placeholder="Enter로 폼 제출"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">스크린 리더 지원</h3>
        <div className="space-y-3">
          <Input 
            label="사용자명"
            placeholder="사용자명 입력"
            aria-describedby="username-help"
            helperText="3-20자의 영문, 숫자만 사용 가능"
          />
          
          <Input 
            label="비밀번호"
            type="password"
            placeholder="비밀번호 입력"
            error
            errorMessage="비밀번호는 8자 이상이어야 합니다"
            aria-invalid="true"
          />
          
          <Input 
            label="이메일"
            type="email"
            placeholder="이메일 주소"
            required
            aria-required="true"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '접근성 기능을 보여주는 스토리입니다. 키보드 네비게이션, 스크린 리더 지원, ARIA 속성을 확인할 수 있습니다.'
      }
    }
  }
};

// 다크 테마
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="space-y-4 w-80">
        <Input 
          label="이름"
          placeholder="이름을 입력하세요"
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input 
          type="email"
          label="이메일"
          placeholder="이메일 주소"
          leftIcon={<MailIcon />}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input 
          type="password"
          label="비밀번호"
          placeholder="비밀번호 입력"
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input 
          label="에러 상태"
          placeholder="에러가 있는 필드"
          error
          errorMessage="이 필드는 필수입니다"
          className="bg-gray-800 border-red-500 text-white"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다크 테마에서의 입력 필드 모습입니다. 배경색과 텍스트 색상이 자동으로 조정됩니다.'
      }
    }
  }
};