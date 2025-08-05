# 배포 가이드 🚀

## 📋 배포 옵션

### 1. GitHub Pages (추천) 🌟

**장점**: 무료, 자동 배포, 커스텀 도메인 지원

#### 설정 방법:

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - English Learning Card App v1.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/english-card-learning.git
   git push -u origin main
   ```

2. **GitHub Pages 활성화**
   - GitHub 저장소 → Settings → Pages
   - Source: "GitHub Actions" 선택
   - 자동으로 `.github/workflows/deploy.yml` 워크플로우 실행

3. **배포 URL 확인**
   - `https://YOUR_USERNAME.github.io/english-card-learning/`

#### 자동 배포:
- `main` 브랜치에 push할 때마다 자동 배포
- 빌드 상태는 Actions 탭에서 확인 가능

---

### 2. Vercel 배포 ⚡

**장점**: 빠른 배포, 프리뷰 URL, 자동 최적화

#### 설정 방법:

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **배포 실행**
   ```bash
   vercel --prod
   ```

3. **자동 배포 설정**
   - Vercel 대시보드에서 GitHub 연동
   - 자동으로 배포 URL 생성

---

### 3. Netlify 배포 🌐

**장점**: 드래그 앤 드롭 배포, 폼 처리, 서버리스 함수

#### 설정 방법:

1. **빌드**
   ```bash
   npm run build
   ```

2. **Netlify에 배포**
   - [netlify.com](https://netlify.com) 접속
   - "Sites" → "Add new site" → "Deploy manually"
   - `dist` 폴더를 드래그 앤 드롭

---

### 4. 로컬 테스트 🧪

#### 개발 서버 실행:
```bash
npm run dev
```
- 접속: http://localhost:3000

#### 프로덕션 빌드 테스트:
```bash
npm run build
npm run preview
```
- 접속: http://localhost:4173

---

## 🔧 빌드 설정

### vite.config.ts 주요 설정:
```typescript
export default defineConfig({
  base: '/english-card-learning/',  // GitHub Pages용 base path
  build: {
    outDir: 'dist',                 // 빌드 출력 디렉토리
    sourcemap: false,               // 소스맵 비활성화 (용량 절약)
    minify: 'terser',              // 코드 압축
  }
})
```

### 환경별 base path 설정:
- **GitHub Pages**: `/english-card-learning/`
- **Vercel/Netlify**: `/` (루트)
- **커스텀 도메인**: `/` (루트)

---

## 📊 배포 전 체크리스트

### ✅ 필수 확인 사항:

1. **빌드 성공 확인**
   ```bash
   npm run build
   ```

2. **로컬 프리뷰 테스트**
   ```bash
   npm run preview
   ```

3. **주요 기능 테스트**
   - [ ] 학년 선택 화면
   - [ ] 카드 학습 기능
   - [ ] 진도 추적 시스템
   - [ ] TTS 음성 재생
   - [ ] 키보드 단축키
   - [ ] 반응형 디자인

4. **성능 최적화 확인**
   ```bash
   npm run build:analyze
   ```

---

## 🌍 배포 후 확인사항

### 1. 기능 테스트
- 모든 학년 선택 가능
- 카드 뒤집기 동작
- 음성 재생 기능
- 진도 추적 정상 동작

### 2. 성능 확인
- 페이지 로딩 속도
- 이미지 최적화
- 번들 크기 확인

### 3. 접근성 테스트
- 키보드 네비게이션
- 스크린 리더 호환성
- 색상 대비 확인

---

## 🔄 업데이트 배포

### GitHub Pages:
```bash
git add .
git commit -m "Update: [변경사항 설명]"
git push origin main
```
→ 자동으로 배포됨

### 수동 배포:
```bash
npm run build
# 빌드된 dist 폴더를 호스팅 서비스에 업로드
```

---

## 🚨 트러블슈팅

### 1. 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. 경로 문제
- `vite.config.ts`의 `base` 설정 확인
- 절대 경로 대신 상대 경로 사용

### 3. 음성 재생 안됨
- HTTPS 환경에서만 TTS 동작
- 로컬에서는 localhost 사용

---

## 📈 성능 최적화 팁

1. **이미지 최적화**: WebP 형식 사용
2. **코드 분할**: 동적 import 활용
3. **캐싱**: 적절한 캐시 헤더 설정
4. **압축**: Gzip/Brotli 압축 활성화

---

**배포 완료 후 URL**: 
- GitHub Pages: `https://YOUR_USERNAME.github.io/english-card-learning/`
- Vercel: `https://english-card-learning.vercel.app/`
- Netlify: `https://english-card-learning.netlify.app/`

🎉 **배포 성공!** 이제 전 세계 어디서나 영어 학습 카드 앱을 사용할 수 있습니다!