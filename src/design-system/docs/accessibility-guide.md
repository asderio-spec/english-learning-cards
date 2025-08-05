# 접근성 가이드라인

Linear Design System은 WCAG 2.1 AA 기준을 준수하여 모든 사용자가 접근 가능한 웹 경험을 제공합니다.

## 📋 목차

- [접근성 원칙](#접근성-원칙)
- [키보드 네비게이션](#키보드-네비게이션)
- [스크린 리더 지원](#스크린-리더-지원)
- [색상 및 대비](#색상-및-대비)
- [포커스 관리](#포커스-관리)
- [ARIA 속성](#aria-속성)
- [테스팅 가이드](#테스팅-가이드)
- [체크리스트](#체크리스트)

## 🎯 접근성 원칙

### WCAG 2.1의 4가지 원칙

1. **인식 가능 (Perceivable)**: 정보와 UI 구성요소는 사용자가 인식할 수 있어야 합니다
2. **운용 가능 (Operable)**: UI 구성요소와 네비게이션은 운용 가능해야 합니다
3. **이해 가능 (Understandable)**: 정보와 UI 운용은 이해 가능해야 합니다
4. **견고함 (Robust)**: 콘텐츠는 다양한 사용자 에이전트에서 해석될 수 있을 만큼 견고해야 합니다

### 우리의 접근성 목표

- **WCAG 2.1 AA 준수**: 모든 컴포넌트가 AA 기준을 만족
- **키보드 완전 지원**: 마우스 없이도 모든 기능 사용 가능
- **스크린 리더 호환**: NVDA, JAWS, VoiceOver 등 주요 스크린 리더 지원
- **색상 독립성**: 색상에만 의존하지 않는 정보 전달

## ⌨️ 키보드 네비게이션

### 기본 키보드 단축키

| 키 | 동작 |
|---|---|
| `Tab` | 다음 포커스 가능한 요소로 이동 |
| `Shift + Tab` | 이전 포커스 가능한 요소로 이동 |
| `Enter` | 버튼, 링크 활성화 |
| `Space` | 버튼 활성화, 체크박스 토글 |
| `Escape` | 모달, 드롭다운 닫기 |
| `Arrow Keys` | 메뉴, 탭, 라디오 버튼 그룹 내 이동 |
| `Home` | 그룹의 첫 번째 요소로 이동 |
| `End` | 그룹의 마지막 요소로 이동 |

### 컴포넌트별 키보드 지원

#### Button

```tsx
// ✅ 올바른 구현
<Button 
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  클릭하세요
</Button>

// ✅ 자동으로 키보드 지원이 포함된 Button 컴포넌트
<Button onClick={handleClick}>
  클릭하세요
</Button>
```

#### Modal

```tsx
// ✅ 포커스 트랩과 ESC 키 지원
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  initialFocus="#modal-title"
>
  <h2 id="modal-title">모달 제목</h2>
  <p>모달 내용</p>
  <Button onClick={handleClose}>닫기</Button>
</Modal>
```

#### Dropdown

```tsx
// ✅ 화살표 키 네비게이션 지원
<Dropdown
  items={items}
  onSelect={handleSelect}
  onKeyDown={(e) => {
    switch (e.key) {
      case 'ArrowDown':
        // 다음 항목으로 이동
        break;
      case 'ArrowUp':
        // 이전 항목으로 이동
        break;
      case 'Enter':
        // 현재 항목 선택
        break;
      case 'Escape':
        // 드롭다운 닫기
        break;
    }
  }}
/>
```

### 키보드 네비게이션 구현

```tsx
import { useKeyboardNavigation } from '@your-org/linear-design-system/hooks';

function NavigableList({ items }) {
  const {
    containerRef,
    focusedIndex,
    setFocusedIndex
  } = useKeyboardNavigation({
    itemCount: items.length,
    loop: true, // 순환 네비게이션
    orientation: 'vertical'
  });

  return (
    <ul ref={containerRef} role="menu">
      {items.map((item, index) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={focusedIndex === index ? 0 : -1}
          onClick={() => handleSelect(item)}
          onFocus={() => setFocusedIndex(index)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

## 🔊 스크린 리더 지원

### ARIA 라이브 영역

동적 콘텐츠 변경을 스크린 리더에 알립니다.

```tsx
import { useAriaLive } from '@your-org/linear-design-system/hooks';

function StatusMessage() {
  const { announce } = useAriaLive();

  const handleSave = async () => {
    try {
      await saveData();
      announce('데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
      announce('저장 중 오류가 발생했습니다.', 'assertive');
    }
  };

  return <Button onClick={handleSave}>저장</Button>;
}
```

### 의미 있는 라벨링

```tsx
// ✅ 명확한 라벨 제공
<Button aria-label="사용자 메뉴 열기">
  <UserIcon />
</Button>

// ✅ 추가 설명 제공
<Input
  label="비밀번호"
  type="password"
  aria-describedby="password-help"
/>
<div id="password-help">
  8자 이상, 대소문자와 숫자를 포함해야 합니다.
</div>

// ✅ 상태 정보 제공
<Button 
  aria-pressed={isActive}
  onClick={toggleActive}
>
  {isActive ? '활성화됨' : '비활성화됨'}
</Button>
```

### 폼 접근성

```tsx
function AccessibleForm() {
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="이메일"
        type="email"
        required
        error={!!errors.email}
        errorMessage={errors.email}
        aria-describedby={errors.email ? 'email-error' : 'email-help'}
      />
      <div id="email-help">
        유효한 이메일 주소를 입력하세요.
      </div>
      {errors.email && (
        <div id="email-error" role="alert" aria-live="polite">
          {errors.email}
        </div>
      )}

      <Button type="submit">제출</Button>
    </form>
  );
}
```

## 🎨 색상 및 대비

### WCAG 색상 대비 기준

- **일반 텍스트**: 4.5:1 이상 (AA), 7:1 이상 (AAA)
- **큰 텍스트** (18pt 이상 또는 14pt bold): 3:1 이상 (AA), 4.5:1 이상 (AAA)
- **그래픽 요소**: 3:1 이상

### 색상 대비 검증

```tsx
import { 
  calculateContrastRatio, 
  isWCAGCompliant,
  validateColorAccessibility 
} from '@your-org/linear-design-system/utils';

// 색상 대비 계산
const ratio = calculateContrastRatio('#ffffff', '#5e6ad2');
console.log(`대비 비율: ${ratio.toFixed(2)}:1`); // 7.2:1

// WCAG 준수 확인
const isCompliant = isWCAGCompliant('#ffffff', '#5e6ad2', 'AA');
console.log(`AA 기준 준수: ${isCompliant}`); // true

// 상세 검증
const validation = validateColorAccessibility('#ffffff', '#5e6ad2', {
  usage: 'text',
  size: 'normal',
  importance: 'high'
});

console.log(validation);
// {
//   wcagAA: true,
//   wcagAAA: true,
//   contrastRatio: 7.2,
//   recommendations: []
// }
```

### 색상 독립적 정보 전달

```tsx
// ❌ 색상에만 의존
<div>
  <span style={{ color: 'red' }}>오류</span>
  <span style={{ color: 'green' }}>성공</span>
</div>

// ✅ 아이콘과 텍스트로 의미 전달
<div>
  <span className="text-error-500">
    <ErrorIcon /> 오류: 입력값이 올바르지 않습니다
  </span>
  <span className="text-success-500">
    <CheckIcon /> 성공: 저장이 완료되었습니다
  </span>
</div>
```

### 고대비 모드 지원

```tsx
import { useHighContrast } from '@your-org/linear-design-system/hooks';

function AdaptiveComponent() {
  const isHighContrast = useHighContrast();

  return (
    <div 
      className={`
        ${isHighContrast ? 'border-2 border-black' : 'border border-gray-300'}
      `}
    >
      콘텐츠
    </div>
  );
}
```

## 🎯 포커스 관리

### 포커스 표시

모든 포커스 가능한 요소는 명확한 포커스 표시를 제공해야 합니다.

```css
/* 기본 포커스 스타일 */
.focusable:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 고대비 모드 포커스 스타일 */
@media (prefers-contrast: high) {
  .focusable:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
```

### 포커스 트랩

모달이나 드롭다운에서 포커스가 벗어나지 않도록 합니다.

```tsx
import { useFocusTrap } from '@your-org/linear-design-system/hooks';

function Modal({ isOpen, onClose, children }) {
  const { trapRef } = useFocusTrap({
    enabled: isOpen,
    initialFocus: '[data-autofocus]',
    restoreFocus: true,
    escapeDeactivates: true,
    onDeactivate: onClose
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={trapRef} className="modal-content">
        <button data-autofocus onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    </div>
  );
}
```

### 포커스 순서

논리적인 포커스 순서를 유지합니다.

```tsx
// ✅ 올바른 포커스 순서
<form>
  <Input label="이름" tabIndex={1} />
  <Input label="이메일" tabIndex={2} />
  <Input label="전화번호" tabIndex={3} />
  <Button type="submit" tabIndex={4}>제출</Button>
  <Button type="button" tabIndex={5}>취소</Button>
</form>

// ❌ 잘못된 포커스 순서
<form>
  <Input label="이름" tabIndex={3} />
  <Button type="submit" tabIndex={1} />
  <Input label="이메일" tabIndex={5} />
  <Button type="button" tabIndex={2} />
  <Input label="전화번호" tabIndex={4} />
</form>
```

## 🏷️ ARIA 속성

### 필수 ARIA 속성

#### 역할 (Role)

```tsx
// 버튼 역할
<div role="button" tabIndex={0} onClick={handleClick}>
  커스텀 버튼
</div>

// 메뉴 역할
<ul role="menu">
  <li role="menuitem">메뉴 항목 1</li>
  <li role="menuitem">메뉴 항목 2</li>
</ul>

// 대화상자 역할
<div role="dialog" aria-modal="true">
  모달 내용
</div>
```

#### 속성 (Properties)

```tsx
// 라벨
<button aria-label="메뉴 열기">☰</button>

// 설명
<input aria-describedby="password-help" />
<div id="password-help">8자 이상 입력하세요</div>

// 필수 입력
<input aria-required="true" />

// 확장 상태
<button aria-expanded={isOpen}>
  드롭다운 {isOpen ? '닫기' : '열기'}
</button>
```

#### 상태 (States)

```tsx
// 선택 상태
<button aria-pressed={isPressed}>
  토글 버튼
</button>

// 비활성 상태
<button aria-disabled="true" disabled>
  비활성 버튼
</button>

// 숨김 상태
<div aria-hidden="true">
  장식용 요소
</div>

// 유효성 상태
<input aria-invalid={hasError} />
```

### ARIA 라이브 영역

```tsx
// 정중한 알림 (polite)
<div role="status" aria-live="polite">
  저장되었습니다.
</div>

// 긴급 알림 (assertive)
<div role="alert" aria-live="assertive">
  오류가 발생했습니다!
</div>

// 원자적 업데이트
<div aria-live="polite" aria-atomic="true">
  <span>진행률: </span>
  <span>{progress}%</span>
</div>
```

## 🧪 테스팅 가이드

### 자동화된 접근성 테스트

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button 컴포넌트 접근성', async () => {
  const { container } = render(
    <Button onClick={() => {}}>클릭하세요</Button>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 키보드 테스트

```tsx
import { fireEvent } from '@testing-library/react';

test('키보드로 버튼 활성화', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <Button onClick={handleClick}>클릭</Button>
  );
  
  const button = getByRole('button');
  
  // Tab으로 포커스
  button.focus();
  expect(button).toHaveFocus();
  
  // Enter로 활성화
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
  
  // Space로 활성화
  fireEvent.keyDown(button, { key: ' ' });
  expect(handleClick).toHaveBeenCalledTimes(2);
});
```

### 스크린 리더 테스트

```tsx
test('스크린 리더 호환성', () => {
  const { getByRole, getByLabelText } = render(
    <div>
      <button aria-label="메뉴 열기">☰</button>
      <input aria-label="검색" placeholder="검색어 입력" />
    </div>
  );
  
  // 라벨로 요소 찾기
  expect(getByLabelText('메뉴 열기')).toBeInTheDocument();
  expect(getByLabelText('검색')).toBeInTheDocument();
});
```

### 수동 테스트 도구

1. **키보드 전용 테스트**: 마우스 없이 모든 기능 사용
2. **스크린 리더 테스트**: NVDA, JAWS, VoiceOver로 테스트
3. **색상 대비 도구**: WebAIM Contrast Checker, Colour Contrast Analyser
4. **브라우저 확장**: axe DevTools, WAVE

## ✅ 체크리스트

### 개발 단계

- [ ] 모든 인터랙티브 요소가 키보드로 접근 가능한가?
- [ ] 포커스 표시가 명확하게 보이는가?
- [ ] 적절한 ARIA 속성이 설정되었는가?
- [ ] 색상 대비가 WCAG AA 기준을 만족하는가?
- [ ] 에러 메시지가 스크린 리더에 전달되는가?

### 테스트 단계

- [ ] 자동화된 접근성 테스트 통과
- [ ] 키보드 전용으로 모든 기능 사용 가능
- [ ] 스크린 리더로 모든 정보 접근 가능
- [ ] 고대비 모드에서 정상 작동
- [ ] 모션 감소 설정 존중

### 배포 전 확인

- [ ] 실제 스크린 리더 사용자 테스트 완료
- [ ] 다양한 브라우저에서 접근성 확인
- [ ] 모바일 접근성 확인
- [ ] 접근성 문서 업데이트

## 📚 추가 리소스

### 도구 및 라이브러리

- [axe-core](https://github.com/dequelabs/axe-core): 자동화된 접근성 테스트
- [jest-axe](https://github.com/nickcolley/jest-axe): Jest용 axe 통합
- [react-aria](https://react-spectrum.adobe.com/react-aria/): Adobe의 접근성 훅
- [focus-trap-react](https://github.com/focus-trap/focus-trap-react): 포커스 트랩

### 참고 문서

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/): 접근성 리소스
- [A11y Project](https://www.a11yproject.com/): 접근성 체크리스트

### 스크린 리더

- [NVDA](https://www.nvaccess.org/): 무료 Windows 스크린 리더
- [JAWS](https://www.freedomscientific.com/products/software/jaws/): 상용 Windows 스크린 리더
- [VoiceOver](https://www.apple.com/accessibility/vision/): macOS/iOS 내장 스크린 리더
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677): Android 내장 스크린 리더

## 🤝 접근성 피드백

접근성 관련 문제를 발견하셨나요? 

1. [GitHub Issues](https://github.com/your-org/linear-design-system/issues)에 접근성 라벨과 함께 이슈 등록
2. 사용하신 보조 기술 정보 포함 (스크린 리더, 브라우저 등)
3. 재현 단계와 예상 동작 설명
4. 가능하다면 해결 방안 제안

모든 사용자가 동등하게 접근할 수 있는 웹을 만들어 나가는 데 함께해 주세요! 🌟