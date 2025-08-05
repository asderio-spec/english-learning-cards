import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Modal } from './Modal';

// Mock Button component for stories
const Button = ({ children, variant = 'primary', onClick, ...props }: any) => (
  <button 
    className={`px-4 py-2 rounded font-medium ${
      variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 
      variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
      'bg-transparent text-blue-500 hover:bg-blue-50'
    } transition-colors`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const meta: Meta<typeof Modal> = {
  title: 'Design System/Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
사용자의 주의를 끌고 중요한 정보를 표시하거나 액션을 요구하는 모달 컴포넌트입니다.

## 특징
- 4가지 크기: Small, Medium, Large, Extra Large
- 포커스 트랩 및 키보드 네비게이션 완전 지원
- ESC 키 및 배경 클릭으로 닫기 지원
- 부드러운 애니메이션 (접근성 설정 고려)
- WCAG 2.1 AA 준수
- 이전 포커스 위치 복원
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 표시 여부'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '모달 크기'
    },
    title: {
      control: 'text',
      description: '모달 제목'
    },
    disableBackdropClose: {
      control: 'boolean',
      description: '배경 클릭으로 닫기 비활성화'
    },
    disableEscapeClose: {
      control: 'boolean',
      description: 'ESC 키로 닫기 비활성화'
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 콜백'
    }
  },
  args: {
    onClose: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          모달 열기
        </Button>
        
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="기본 모달"
        >
          <p className="mb-4">
            이것은 기본 모달 컴포넌트입니다. ESC 키를 누르거나 배경을 클릭하여 닫을 수 있습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              확인
            </Button>
          </div>
        </Modal>
      </>
    );
  }
};

// 크기별 스토리
export const Sizes: Story = {
  render: () => {
    const [openModal, setOpenModal] = useState<string | null>(null);
    
    const sizes = [
      { key: 'sm', label: 'Small', description: '작은 알림이나 간단한 확인 대화상자에 적합합니다.' },
      { key: 'md', label: 'Medium', description: '일반적인 폼이나 콘텐츠 표시에 적합합니다.' },
      { key: 'lg', label: 'Large', description: '복잡한 폼이나 많은 콘텐츠가 있을 때 사용합니다.' },
      { key: 'xl', label: 'Extra Large', description: '이미지 갤러리나 상세한 정보를 표시할 때 사용합니다.' }
    ];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sizes.map(({ key, label }) => (
            <Button key={key} onClick={() => setOpenModal(key)}>
              {label} 모달
            </Button>
          ))}
        </div>
        
        {sizes.map(({ key, label, description }) => (
          <Modal
            key={key}
            isOpen={openModal === key}
            onClose={() => setOpenModal(null)}
            size={key as any}
            title={`${label} 모달`}
          >
            <p className="mb-4">{description}</p>
            <p className="text-sm text-gray-600 mb-4">
              현재 모달 크기: <strong>{key}</strong>
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setOpenModal(null)}>
                취소
              </Button>
              <Button onClick={() => setOpenModal(null)}>
                확인
              </Button>
            </div>
          </Modal>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모달의 4가지 크기를 보여줍니다. 콘텐츠의 양과 용도에 따라 적절한 크기를 선택하세요.'
      }
    }
  }
};

// 제목 없는 모달
export const WithoutTitle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          제목 없는 모달
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          aria-label="사용자 프로필 편집"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">프로필 업데이트</h2>
            <p className="text-gray-600 mb-6">
              프로필 정보가 성공적으로 업데이트되었습니다.
            </p>
            <Button onClick={() => setIsOpen(false)}>
              확인
            </Button>
          </div>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '제목이 없는 모달입니다. 커스텀 헤더나 아이콘 중심의 디자인에 사용할 수 있습니다. aria-label을 반드시 제공해야 합니다.'
      }
    }
  }
};

// 폼 모달
export const FormModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
    });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('폼이 제출되었습니다!');
      setIsOpen(false);
      setFormData({ name: '', email: '', message: '' });
    };
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          문의하기
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="문의하기"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                메시지 *
              </label>
              <textarea
                id="message"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                전송
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '폼이 포함된 모달입니다. 입력 필드들이 자동으로 포커스 트랩에 포함되어 키보드 네비게이션이 가능합니다.'
      }
    }
  }
};

// 확인 대화상자
export const ConfirmDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleDelete = () => {
      alert('항목이 삭제되었습니다!');
      setIsOpen(false);
    };
    
    return (
      <>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          항목 삭제
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="삭제 확인"
          size="sm"
          disableBackdropClose
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            <p className="text-gray-700 mb-6">
              정말로 이 항목을 삭제하시겠습니까? 
              <br />
              <strong>이 작업은 되돌릴 수 없습니다.</strong>
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                삭제
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '확인 대화상자 모달입니다. 중요한 액션에 대한 확인을 받을 때 사용합니다. 배경 클릭으로 닫기가 비활성화되어 있습니다.'
      }
    }
  }
};

// 이미지 갤러리 모달
export const ImageGallery: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    
    const images = [
      { src: 'https://picsum.photos/800/600?random=1', alt: '이미지 1' },
      { src: 'https://picsum.photos/800/600?random=2', alt: '이미지 2' },
      { src: 'https://picsum.photos/800/600?random=3', alt: '이미지 3' }
    ];
    
    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    };
    
    const prevImage = () => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          이미지 갤러리 보기
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`이미지 ${currentImage + 1} / ${images.length}`}
          size="xl"
        >
          <div className="text-center">
            <div className="relative mb-4">
              <img 
                src={images[currentImage].src} 
                alt={images[currentImage].alt}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    aria-label="이전 이미지"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    aria-label="다음 이미지"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            <div className="flex justify-center gap-2 mb-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImage ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
            
            <Button onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </div>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '이미지 갤러리 모달입니다. 큰 크기(xl)를 사용하여 이미지를 효과적으로 표시합니다.'
      }
    }
  }
};

// 중첩 모달
export const NestedModals: Story = {
  render: () => {
    const [firstModal, setFirstModal] = useState(false);
    const [secondModal, setSecondModal] = useState(false);
    
    return (
      <>
        <Button onClick={() => setFirstModal(true)}>
          첫 번째 모달 열기
        </Button>
        
        <Modal
          isOpen={firstModal}
          onClose={() => setFirstModal(false)}
          title="첫 번째 모달"
          size="md"
        >
          <p className="mb-4">
            이것은 첫 번째 모달입니다. 여기서 두 번째 모달을 열 수 있습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setFirstModal(false)}>
              닫기
            </Button>
            <Button onClick={() => setSecondModal(true)}>
              두 번째 모달 열기
            </Button>
          </div>
        </Modal>
        
        <Modal
          isOpen={secondModal}
          onClose={() => setSecondModal(false)}
          title="두 번째 모달"
          size="sm"
        >
          <p className="mb-4">
            이것은 두 번째 모달입니다. 첫 번째 모달 위에 표시됩니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setSecondModal(false)}>
              닫기
            </Button>
          </div>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '중첩된 모달들입니다. 각 모달은 독립적으로 관리되며, z-index를 통해 올바른 순서로 표시됩니다.'
      }
    }
  }
};

// 접근성 예제
export const Accessibility: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">접근성 기능</h3>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• Tab 키로 모달 내 요소들 간 이동</li>
            <li>• Shift+Tab으로 역방향 이동</li>
            <li>• ESC 키로 모달 닫기</li>
            <li>• 포커스 트랩 (모달 외부로 포커스 이동 방지)</li>
            <li>• 모달 닫힐 때 이전 포커스 위치 복원</li>
            <li>• 스크린 리더를 위한 ARIA 속성</li>
          </ul>
          
          <Button onClick={() => setIsOpen(true)}>
            접근성 테스트 모달
          </Button>
        </div>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="접근성 테스트"
          aria-describedby="accessibility-description"
        >
          <div id="accessibility-description">
            <p className="mb-4">
              이 모달은 완전한 키보드 접근성을 제공합니다. 
              Tab 키를 사용하여 아래 요소들을 순환할 수 있습니다.
            </p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="test-input" className="block text-sm font-medium mb-1">
                  테스트 입력 필드
                </label>
                <input
                  type="text"
                  id="test-input"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="여기에 입력하세요"
                />
              </div>
              
              <div>
                <label htmlFor="test-select" className="block text-sm font-medium mb-1">
                  선택 필드
                </label>
                <select
                  id="test-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>옵션 1</option>
                  <option>옵션 2</option>
                  <option>옵션 3</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="test-checkbox"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="test-checkbox" className="text-sm">
                  체크박스 테스트
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                확인
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모달의 접근성 기능을 테스트할 수 있는 스토리입니다. 키보드 네비게이션과 포커스 관리를 확인해보세요.'
      }
    }
  }
};

// 설정 옵션들
export const ConfigurationOptions: Story = {
  render: () => {
    const [modals, setModals] = useState({
      normal: false,
      noBackdrop: false,
      noEscape: false,
      both: false
    });
    
    const openModal = (type: keyof typeof modals) => {
      setModals(prev => ({ ...prev, [type]: true }));
    };
    
    const closeModal = (type: keyof typeof modals) => {
      setModals(prev => ({ ...prev, [type]: false }));
    };
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => openModal('normal')}>
            일반 모달
          </Button>
          <Button onClick={() => openModal('noBackdrop')}>
            배경 클릭 비활성화
          </Button>
          <Button onClick={() => openModal('noEscape')}>
            ESC 키 비활성화
          </Button>
          <Button onClick={() => openModal('both')}>
            둘 다 비활성화
          </Button>
        </div>
        
        {/* 일반 모달 */}
        <Modal
          isOpen={modals.normal}
          onClose={() => closeModal('normal')}
          title="일반 모달"
        >
          <p className="mb-4">
            ESC 키를 누르거나 배경을 클릭하여 닫을 수 있습니다.
          </p>
          <Button onClick={() => closeModal('normal')}>닫기</Button>
        </Modal>
        
        {/* 배경 클릭 비활성화 */}
        <Modal
          isOpen={modals.noBackdrop}
          onClose={() => closeModal('noBackdrop')}
          title="배경 클릭 비활성화"
          disableBackdropClose
        >
          <p className="mb-4">
            배경을 클릭해도 닫히지 않습니다. ESC 키나 버튼으로만 닫을 수 있습니다.
          </p>
          <Button onClick={() => closeModal('noBackdrop')}>닫기</Button>
        </Modal>
        
        {/* ESC 키 비활성화 */}
        <Modal
          isOpen={modals.noEscape}
          onClose={() => closeModal('noEscape')}
          title="ESC 키 비활성화"
          disableEscapeClose
        >
          <p className="mb-4">
            ESC 키로 닫을 수 없습니다. 배경 클릭이나 버튼으로만 닫을 수 있습니다.
          </p>
          <Button onClick={() => closeModal('noEscape')}>닫기</Button>
        </Modal>
        
        {/* 둘 다 비활성화 */}
        <Modal
          isOpen={modals.both}
          onClose={() => closeModal('both')}
          title="모든 닫기 옵션 비활성화"
          disableBackdropClose
          disableEscapeClose
        >
          <p className="mb-4">
            ESC 키와 배경 클릭이 모두 비활성화되었습니다. 
            오직 버튼으로만 닫을 수 있습니다.
          </p>
          <Button onClick={() => closeModal('both')}>닫기</Button>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모달의 다양한 설정 옵션들을 보여줍니다. 배경 클릭과 ESC 키로 닫기를 개별적으로 비활성화할 수 있습니다.'
      }
    }
  }
};