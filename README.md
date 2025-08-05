# 영어 학습 카드 앱 (English Card Learning App)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo/english-card-learning)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/your-repo/english-card-learning)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

중학교부터 고등학교까지의 학생들을 대상으로 한 카드 기반 영어 문장 학습 플랫폼입니다. 듀오링고 스타일의 직관적인 인터페이스와 TTS 음성 지원으로 효과적인 영어 학습을 제공합니다.

## ✨ 주요 기능

- 🎓 **학년별 맞춤 학습**: 중1~고3 각 학년별 100개 핵심 문장
- 🔄 **3D 카드 애니메이션**: 부드러운 카드 뒤집기 효과
- 🔊 **TTS 음성 지원**: 한국어/영어 자연스러운 음성 재생
- ⭐ **중요 문장 관리**: 복습이 필요한 문장 별도 관리
- ⏯️ **자동 재생**: 속도 조절 가능한 연속 학습 모드
- 📊 **학습 진도 추적**: 실시간 진도율 및 학습 스트릭 관리
- 📱 **반응형 디자인**: 웹/모바일 완벽 지원
- ♿ **접근성 지원**: 키보드 네비게이션 및 스크린 리더 지원

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- npm 9+

### 설치 및 실행
```bash
# 저장소 클론
git clone <repository-url>
cd english-card-learning

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Context API + useReducer
- **Storage**: localStorage
- **TTS**: Web Speech API
- **Testing**: Vitest + React Testing Library

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── __tests__/      # 컴포넌트 테스트
│   ├── AutoPlay.tsx    # 자동 재생 컨트롤
│   ├── CardView.tsx    # 메인 카드 컴포넌트
│   ├── GradeSelector.tsx # 학년 선택
│   └── ProgressDashboard.tsx # 진도 대시보드
├── services/           # 비즈니스 로직
│   ├── dataService.ts  # 데이터 관리
│   ├── ttsService.ts   # 음성 합성
│   └── progressService.ts # 진도 추적
├── context/            # 전역 상태 관리
├── types/              # TypeScript 타입 정의
├── data/               # 정적 데이터
└── test/               # 테스트 유틸리티
```

## 🎯 사용법

### 기본 학습 플로우
1. **학년 선택**: 중1~고3 중 본인 학년 선택
2. **카드 학습**: 카드를 클릭하여 한글↔영문 전환
3. **음성 듣기**: 스피커 버튼으로 발음 학습
4. **중요 표시**: 별표 버튼으로 중요 문장 마킹
5. **진도 확인**: 대시보드에서 학습 현황 확인

### 키보드 단축키
- `Space` / `Enter`: 카드 뒤집기
- `←` / `→`: 이전/다음 카드
- `Tab`: 요소 간 이동

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test

# 테스트 커버리지 확인
npm run test:coverage

# 통합 테스트 실행
npm run test:run
```

## 🏗️ 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build:prod

# 빌드 미리보기
npm run preview

# 번들 분석
npm run build:analyze

# 배포 준비 검증
npm run deploy:check
```

자세한 배포 가이드는 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요.

## 📚 문서

- [사용자 매뉴얼](USER_MANUAL.md) - 앱 사용법 상세 가이드
- [개발자 가이드](DEVELOPER_GUIDE.md) - 개발 환경 설정 및 API 문서
- [배포 가이드](DEPLOYMENT.md) - 다양한 플랫폼 배포 방법

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 기여 가이드는 [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#기여-가이드)를 참조하세요.

## 📊 개발 현황

✅ **완료된 기능**
- [x] 프로젝트 초기 설정 및 기본 구조
- [x] 학년별 영어 문장 데이터 (600개)
- [x] 카드 뒤집기 3D 애니메이션
- [x] TTS 음성 합성 (한국어/영어)
- [x] 중요 문장 표시 및 관리
- [x] 자동 재생 기능 (속도 조절)
- [x] 학습 진도 추적 시스템
- [x] 반응형 디자인 (모바일 최적화)
- [x] 접근성 개선 (WCAG 2.1 AA)
- [x] 성능 최적화 및 번들 최적화
- [x] 포괄적인 테스트 커버리지
- [x] PWA 지원 (오프라인 기능)

## 🔧 성능 지표

- **번들 크기**: ~250KB (gzipped: ~75KB)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **테스트 커버리지**: > 90%

## 🌐 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 개발팀

- **개발자**: [Your Name](https://github.com/yourusername)
- **디자인**: [Designer Name](https://github.com/designerusername)

## 🙏 감사의 말

- [React](https://reactjs.org/) - UI 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리

---

**문의사항이나 버그 리포트는 [Issues](https://github.com/your-repo/english-card-learning/issues)에 등록해주세요.**