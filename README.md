# 📚 영어 학습 카드 앱 v1.0.0

> 중고등학생을 위한 인터랙티브 영어 문장 학습 플랫폼

[![Deploy to GitHub Pages](https://github.com/asderio-spec/english-learning-cards/actions/workflows/deploy.yml/badge.svg)](https://github.com/asderio-spec/english-learning-cards/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/asderio-spec/english-learning-cards)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌐 라이브 데모

**🚀 [지금 사용해보기](https://asderio-spec.github.io/english-learning-cards/)**

## ✨ 주요 기능

### 📖 학습 콘텐츠
- **600개 영어 문장**: 중1~고3 각 학년별 100개씩 체계적 구성
- **학년별 난이도**: 교육과정에 맞춘 점진적 학습
- **중요 문장 표시**: ⭐ 개인화된 학습 관리

### 🔊 음성 기능
- **TTS (Text-to-Speech)**: 한국어/영어 음성 지원
- **모바일 호환성**: 모바일 브라우저 음성 정책 준수
- **자동재생**: 3단계 속도 조절 (느림/보통/빠름)

### 📱 사용자 경험
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **키보드 단축키**: 스페이스바(뒤집기), 화살표(이동), Enter(음성)
- **PWA 지원**: 홈 화면 추가 및 오프라인 사용 가능

### 📊 학습 관리
- **실시간 진도 추적**: 학습 완료율 및 현황 표시
- **진도 대시보드**: 시각적 학습 통계
- **로컬 저장**: 학습 기록 자동 저장

## 🚀 빠른 시작

### 온라인 사용
1. [https://asderio-spec.github.io/english-learning-cards/](https://asderio-spec.github.io/english-learning-cards/) 접속
2. 학년 선택
3. 학습 시작!

### 로컬 개발
```bash
# 저장소 클론
git clone https://github.com/asderio-spec/english-learning-cards.git
cd english-learning-cards

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

## 🎮 사용 방법

### 기본 조작
- **카드 뒤집기**: 카드 클릭 또는 스페이스바
- **문장 이동**: 화살표 키 또는 네비게이션 버튼
- **음성 재생**: 스피커 버튼 또는 Enter 키
- **중요 표시**: ⭐ 버튼 클릭

### 자동재생 기능
1. 자동재생 버튼 클릭
2. 속도 선택 (느림/보통/빠름)
3. 자동으로 카드가 뒤집히고 다음 문장으로 이동

### 진도 확인
- 상단 "📊 진도 보기" 버튼 클릭
- 학년별 완료율 및 중요 문장 목록 확인

## 🏗️ 기술 스택

### Frontend
- **React 19.1.0** - 최신 React 기능 활용
- **TypeScript** - 타입 안전성 보장
- **Vite 7.0.4** - 빠른 개발 환경
- **Tailwind CSS 4.1.11** - 유틸리티 CSS 프레임워크
- **Framer Motion** - 부드러운 애니메이션

### 디자인 시스템
- **Linear Design System** - 일관된 UI/UX
- **CSS Variables** - 테마 시스템
- **Responsive Design** - 모든 디바이스 지원

### 배포 및 도구
- **GitHub Pages** - 정적 사이트 호스팅
- **GitHub Actions** - 자동 배포 파이프라인
- **PWA** - 프로그레시브 웹 앱 기능

## 📱 지원 환경

### 브라우저
- ✅ Chrome (최신)
- ✅ Safari (iOS/macOS)
- ✅ Firefox (최신)
- ✅ Edge (최신)
- ✅ 모바일 브라우저

### 디바이스
- ✅ 데스크톱 (1200px+)
- ✅ 태블릿 (768px-1199px)
- ✅ 모바일 (320px-767px)

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 테스트 실행
npm run test

# 린트 검사
npm run lint

# 번들 분석
npm run build:analyze
```

## 📊 프로젝트 통계

- **총 파일 수**: 300+ 파일
- **코드 라인 수**: 15,000+ 라인
- **컴포넌트 수**: 50+ 컴포넌트
- **테스트 파일**: 30+ 테스트 파일
- **번들 크기**: 239KB (gzipped: 71KB)

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📚 문서

- [개발 히스토리](log_history.md) - 전체 개발 과정 기록
- [버전 1.0 정보](VERSION_1.0_FINAL.md) - 릴리즈 상세 정보
- [배포 가이드](FINAL_DEPLOYMENT_GUIDE.md) - 배포 방법 안내
- [개발자 가이드](DEVELOPER_GUIDE.md) - 개발 환경 설정

## 🔮 로드맵

### v1.1 (계획)
- [ ] 음성 인식 기능
- [ ] 학습 통계 상세화
- [ ] 다크 모드 지원
- [ ] 오프라인 TTS

### v1.2 (계획)
- [ ] 소셜 기능
- [ ] 커스텀 문장 추가
- [ ] 학습 게임화
- [ ] 다국어 지원

## 📞 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/asderio-spec/english-learning-cards/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/asderio-spec/english-learning-cards/discussions)

---

<div align="center">

**🎉 영어 학습의 새로운 경험을 시작하세요!**

[🚀 지금 사용해보기](https://asderio-spec.github.io/english-learning-cards/) | [⭐ 스타 주기](https://github.com/asderio-spec/english-learning-cards)

</div>