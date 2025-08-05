import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animations, animationPatterns, motionVariants } from './animations';
import { 
  useReducedMotion,
  getAnimationDuration,
  createTransition,
  createHoverAnimation,
  createPressAnimation,
  springConfig,
  modalVariants,
  dropdownVariants,
  toastVariants,
  spinnerVariants,
  pulseVariants
} from './animationUtils';

const meta: Meta = {
  title: 'Design System/Tokens/Animations',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Linear Design System의 애니메이션 토큰입니다. 부드럽고 의미있는 애니메이션을 위한 체계적인 시스템을 제공합니다.

## 애니메이션 원칙
- **의미있는 애니메이션**: 사용자의 이해를 돕는 애니메이션
- **성능 최적화**: 60fps를 유지하는 부드러운 애니메이션
- **접근성 고려**: prefers-reduced-motion 설정 존중
- **일관성**: 전체 시스템에서 일관된 타이밍과 이징

모든 애니메이션은 Linear의 미니멀한 디자인 철학을 반영합니다.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 애니메이션 데모 컴포넌트
const AnimationDemo = ({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
}) => (
  <div className="border border-gray-200 rounded-lg p-6 mb-6">
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="bg-gray-50 rounded-lg p-4 min-h-24 flex items-center justify-center">
      {children}
    </div>
  </div>
);

// 기본 애니메이션 토큰
export const BasicTokens: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Animation Tokens</h2>
      <p className="text-gray-600 mb-8">
        애니메이션의 기본 구성 요소인 지속시간, 이징, 변환 값들입니다.
      </p>
      
      <div className="space-y-8">
        {/* 지속시간 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Duration (지속시간)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(animations.duration).map(([name, value]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm">{name}</span>
                  <span className="font-mono text-sm text-gray-500">{value}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ 
                      duration: parseFloat(value) / 1000,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 이징 함수 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Easing (이징 함수)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(animations.easing).map(([name, value]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm">{name}</span>
                  <span className="font-mono text-xs text-gray-500">{value}</span>
                </div>
                <div className="relative h-16 bg-gray-100 rounded overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full"
                    initial={{ x: 0, y: 24 }}
                    animate={{ x: 200, y: 24 }}
                    transition={{
                      duration: 2,
                      ease: value as any,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 스케일 값 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Scale Values (스케일 값)</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(animations.scale).map(([name, value]) => (
              <div key={name} className="text-center">
                <motion.div
                  className="w-16 h-16 bg-purple-500 rounded-lg mb-2 cursor-pointer"
                  whileHover={{ scale: parseFloat(value) }}
                  transition={{ duration: 0.2 }}
                />
                <div className="text-sm font-mono">{name}</div>
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 기본 애니메이션 패턴
export const AnimationPatterns: Story = {
  render: () => {
    const [trigger, setTrigger] = useState(0);
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Animation Patterns</h2>
        <p className="text-gray-600 mb-8">
          자주 사용되는 애니메이션 패턴들입니다. 버튼을 클릭하여 애니메이션을 확인하세요.
        </p>
        
        <div className="mb-6">
          <button 
            onClick={() => setTrigger(prev => prev + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            애니메이션 재생
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimationDemo
            title="Fade In"
            description="요소가 서서히 나타나는 애니메이션"
          >
            <motion.div
              key={`fade-${trigger}`}
              className="w-16 h-16 bg-blue-500 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </AnimationDemo>
          
          <AnimationDemo
            title="Slide Up"
            description="아래에서 위로 슬라이드하며 나타나는 애니메이션"
          >
            <motion.div
              key={`slide-up-${trigger}`}
              className="w-16 h-16 bg-green-500 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimationDemo>
          
          <AnimationDemo
            title="Scale In"
            description="작은 크기에서 원래 크기로 확대되는 애니메이션"
          >
            <motion.div
              key={`scale-${trigger}`}
              className="w-16 h-16 bg-purple-500 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
            />
          </AnimationDemo>
          
          <AnimationDemo
            title="Slide Left"
            description="오른쪽에서 왼쪽으로 슬라이드하며 나타나는 애니메이션"
          >
            <motion.div
              key={`slide-left-${trigger}`}
              className="w-16 h-16 bg-orange-500 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimationDemo>
        </div>
      </div>
    );
  }
};

// 인터랙티브 애니메이션
export const InteractiveAnimations: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Interactive Animations</h2>
      <p className="text-gray-600 mb-8">
        사용자 인터랙션에 반응하는 애니메이션들입니다. 호버, 클릭, 포커스 등의 상호작용을 확인하세요.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimationDemo
          title="Hover Scale"
          description="마우스 호버 시 크기가 커지는 효과"
        >
          <motion.div
            className="w-16 h-16 bg-blue-500 rounded-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Press Effect"
          description="클릭 시 눌리는 효과"
        >
          <motion.button
            className="w-16 h-16 bg-green-500 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Focus Ring"
          description="포커스 시 링이 나타나는 효과"
        >
          <motion.button
            className="w-16 h-16 bg-purple-500 rounded-lg focus:outline-none"
            whileFocus={{ 
              boxShadow: '0 0 0 3px rgba(147, 51, 234, 0.3)' 
            }}
            transition={{ duration: 0.2 }}
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Bounce"
          description="탄성 있는 스프링 애니메이션"
        >
          <motion.div
            className="w-16 h-16 bg-red-500 rounded-lg cursor-pointer"
            whileHover={{ 
              scale: 1.2,
              transition: { type: 'spring', stiffness: 300, damping: 10 }
            }}
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Rotate"
          description="호버 시 회전하는 효과"
        >
          <motion.div
            className="w-16 h-16 bg-yellow-500 rounded-lg cursor-pointer"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Shake"
          description="에러 상태를 나타내는 흔들림 효과"
        >
          <motion.div
            className="w-16 h-16 bg-red-500 rounded-lg cursor-pointer"
            whileHover={{
              x: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
          />
        </AnimationDemo>
      </div>
    </div>
  )
};

// 컴포넌트 애니메이션
export const ComponentAnimations: Story = {
  render: () => {
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Component Animations</h2>
        <p className="text-gray-600 mb-8">
          실제 컴포넌트에서 사용되는 애니메이션들입니다.
        </p>
        
        <div className="space-y-8">
          {/* 모달 애니메이션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Modal Animation</h3>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              모달 열기
            </button>
            
            <AnimatePresence>
              {showModal && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    variants={modalVariants.backdrop}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={() => setShowModal(false)}
                  >
                    <motion.div
                      className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                      variants={modalVariants.modal}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h4 className="text-lg font-semibold mb-4">모달 제목</h4>
                      <p className="text-gray-600 mb-4">
                        이것은 애니메이션이 적용된 모달입니다. 
                        배경을 클릭하거나 닫기 버튼을 눌러 닫을 수 있습니다.
                      </p>
                      <button 
                        onClick={() => setShowModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        닫기
                      </button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* 드롭다운 애니메이션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dropdown Animation</h3>
            <div className="relative inline-block">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                드롭다운 {showDropdown ? '닫기' : '열기'}
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">옵션 1</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">옵션 2</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">옵션 3</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* 토스트 애니메이션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Toast Animation</h3>
            <button 
              onClick={() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              토스트 표시
            </button>
            
            <AnimatePresence>
              {showToast && (
                <motion.div
                  className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
                  variants={toastVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  성공적으로 저장되었습니다!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
};

// 로딩 애니메이션
export const LoadingAnimations: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Loading Animations</h2>
      <p className="text-gray-600 mb-8">
        로딩 상태를 나타내는 다양한 애니메이션들입니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimationDemo
          title="Spinner"
          description="회전하는 로딩 스피너"
        >
          <motion.div
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            variants={spinnerVariants}
            animate="animate"
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Pulse"
          description="맥박처럼 깜빡이는 효과"
        >
          <motion.div
            className="w-16 h-16 bg-green-500 rounded-lg"
            variants={pulseVariants}
            animate="animate"
          />
        </AnimationDemo>
        
        <AnimationDemo
          title="Dots"
          description="점들이 순차적으로 움직이는 효과"
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-purple-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2
                  }
                }}
              />
            ))}
          </div>
        </AnimationDemo>
        
        <AnimationDemo
          title="Progress Bar"
          description="진행률을 나타내는 바"
        >
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              animate={{
                width: ['0%', '100%'],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            />
          </div>
        </AnimationDemo>
        
        <AnimationDemo
          title="Skeleton"
          description="콘텐츠 로딩을 위한 스켈레톤"
        >
          <div className="space-y-2">
            <motion.div
              className="h-4 bg-gray-300 rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            />
            <motion.div
              className="h-4 bg-gray-300 rounded w-3/4"
              animate={{
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2
                }
              }}
            />
          </div>
        </AnimationDemo>
        
        <AnimationDemo
          title="Bounce"
          description="공이 튀는 듯한 효과"
        >
          <motion.div
            className="w-8 h-8 bg-red-500 rounded-full"
            animate={{
              y: [0, -20, 0],
              transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeOut'
              }
            }}
          />
        </AnimationDemo>
      </div>
    </div>
  )
};

// 스태거 애니메이션
export const StaggerAnimations: Story = {
  render: () => {
    const [trigger, setTrigger] = useState(0);
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Stagger Animations</h2>
        <p className="text-gray-600 mb-8">
          여러 요소가 순차적으로 애니메이션되는 스태거 효과입니다.
        </p>
        
        <div className="mb-6">
          <button 
            onClick={() => setTrigger(prev => prev + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            스태거 애니메이션 재생
          </button>
        </div>
        
        <div className="space-y-8">
          <AnimationDemo
            title="List Items"
            description="리스트 아이템들이 순차적으로 나타나는 효과"
          >
            <motion.div
              key={`list-${trigger}`}
              className="space-y-2"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="bg-blue-100 p-3 rounded-lg"
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 }
                  }}
                >
                  리스트 아이템 {i + 1}
                </motion.div>
              ))}
            </motion.div>
          </AnimationDemo>
          
          <AnimationDemo
            title="Card Grid"
            description="카드들이 순차적으로 나타나는 그리드"
          >
            <motion.div
              key={`grid-${trigger}`}
              className="grid grid-cols-3 gap-2"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 bg-green-500 rounded-lg"
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 }
                  }}
                />
              ))}
            </motion.div>
          </AnimationDemo>
        </div>
      </div>
    );
  }
};

// 접근성 고려사항
export const Accessibility: Story = {
  render: () => {
    const reducedMotion = useReducedMotion();
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Animation Accessibility</h2>
        <p className="text-gray-600 mb-8">
          접근성을 고려한 애니메이션 시스템입니다. 사용자의 prefers-reduced-motion 설정을 존중합니다.
        </p>
        
        <div className="space-y-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">현재 설정</h4>
            <p className="text-blue-700">
              Reduced Motion: <strong>{reducedMotion ? 'ON' : 'OFF'}</strong>
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {reducedMotion 
                ? '애니메이션이 최소화됩니다 (0.01ms 지속시간)' 
                : '일반적인 애니메이션이 재생됩니다'
              }
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">접근성 가이드라인</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">1. 필수적이지 않은 애니메이션 최소화</h4>
                <p className="text-gray-600 text-sm">
                  장식적인 애니메이션은 reduced-motion 설정 시 비활성화됩니다.
                </p>
                <div className="mt-3 flex gap-4">
                  <motion.div
                    className="w-12 h-12 bg-green-500 rounded-lg"
                    animate={reducedMotion ? {} : {
                      scale: [1, 1.1, 1],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                  />
                  <span className="text-sm text-gray-600 self-center">
                    {reducedMotion ? '애니메이션 비활성화' : '장식적 애니메이션'}
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">2. 의미있는 애니메이션 유지</h4>
                <p className="text-gray-600 text-sm">
                  사용자 이해에 도움이 되는 애니메이션은 유지하되 지속시간을 단축합니다.
                </p>
                <div className="mt-3">
                  <motion.button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    whileHover={{ scale: reducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: reducedMotion ? 1 : 0.95 }}
                    transition={{ duration: reducedMotion ? 0.001 : 0.2 }}
                  >
                    인터랙티브 버튼
                  </motion.button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">3. 대안적 피드백 제공</h4>
                <p className="text-gray-600 text-sm">
                  애니메이션 대신 색상 변화나 텍스트로 상태를 표현합니다.
                </p>
                <div className="mt-3">
                  <motion.div
                    className="p-3 rounded-lg border-2"
                    animate={reducedMotion ? 
                      { borderColor: '#10B981' } : 
                      { 
                        borderColor: '#10B981',
                        scale: [1, 1.02, 1],
                        transition: { duration: 0.5 }
                      }
                    }
                  >
                    성공 상태 표시
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">테스트 방법</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• macOS: 시스템 환경설정 → 접근성 → 디스플레이 → 동작 줄이기</p>
              <p>• Windows: 설정 → 접근성 → 시각적 효과 → 애니메이션 표시</p>
              <p>• 브라우저 개발자 도구에서 prefers-reduced-motion 에뮬레이션</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};