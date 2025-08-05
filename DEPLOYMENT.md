# 배포 가이드 (Deployment Guide)

## 개요

영어 학습 카드 앱은 정적 웹 애플리케이션으로 다양한 호스팅 플랫폼에 배포할 수 있습니다.

## 배포 전 체크리스트

### 1. 코드 품질 검증
```bash
# 린트 검사
npm run lint

# 테스트 실행
npm run test:run

# 전체 배포 준비 검증
npm run deploy:check
```

### 2. 프로덕션 빌드 생성
```bash
# 프로덕션 빌드
npm run build:prod

# 빌드 결과 미리보기
npm run preview

# 번들 분석 (선택사항)
npm run build:analyze
```

## 배포 플랫폼별 가이드

### 1. Vercel 배포

#### 자동 배포 (권장)
1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "New Project" → GitHub 저장소 선택
4. 빌드 설정:
   - Framework Preset: `Vite`
   - Build Command: `npm run build:prod`
   - Output Directory: `dist`
5. Deploy 클릭

#### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 배포
vercel --prod
```

### 2. Netlify 배포

#### 자동 배포
1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" → GitHub 저장소 선택
3. 빌드 설정:
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
4. Deploy site 클릭

#### 수동 배포
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 빌드 후 배포
npm run build:prod
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages 배포

#### GitHub Actions 사용 (권장)
`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Build
      run: npm run build:prod
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. Firebase Hosting 배포

```bash
# Firebase CLI 설치
npm i -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init hosting

# 빌드 후 배포
npm run build:prod
firebase deploy
```

### 5. AWS S3 + CloudFront 배포

```bash
# AWS CLI 설치 및 설정
aws configure

# S3 버킷에 업로드
npm run build:prod
aws s3 sync dist/ s3://your-bucket-name --delete

# CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 환경 변수 설정

### 개발 환경
`.env.local` 파일 생성:
```
VITE_APP_TITLE=영어 학습 카드 앱 (개발)
VITE_APP_VERSION=dev
```

### 프로덕션 환경
배포 플랫폼에서 환경 변수 설정:
```
VITE_APP_TITLE=영어 학습 카드 앱
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

## 성능 최적화

### 1. 빌드 최적화
- 자동 코드 분할 (Code Splitting)
- Tree Shaking으로 불필요한 코드 제거
- Terser를 통한 JavaScript 압축
- CSS 압축 및 최적화

### 2. 캐싱 전략
- 정적 자산에 대한 장기 캐싱 (1년)
- HTML 파일은 짧은 캐싱 (1시간)
- 버전 해시를 통한 캐시 무효화

### 3. CDN 활용
- 정적 자산을 CDN을 통해 제공
- 지역별 캐시 서버 활용으로 로딩 속도 개선

## 모니터링 및 분석

### 1. 성능 모니터링
- Google PageSpeed Insights
- Lighthouse 성능 점수 확인
- Web Vitals 지표 모니터링

### 2. 에러 추적
- 브라우저 콘솔 에러 모니터링
- 사용자 피드백 수집

### 3. 사용량 분석
- Google Analytics 연동 (선택사항)
- 사용자 행동 패턴 분석

## 롤백 전략

### 1. 자동 롤백
- 배포 실패 시 이전 버전으로 자동 복원
- Health Check 실패 시 롤백

### 2. 수동 롤백
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# GitHub Pages
git revert HEAD
git push origin main
```

## 보안 고려사항

### 1. HTTPS 강제
- 모든 배포 플랫폼에서 HTTPS 활성화
- HTTP에서 HTTPS로 자동 리다이렉트

### 2. 보안 헤더
- Content Security Policy (CSP) 설정
- X-Frame-Options 헤더 설정

### 3. 민감 정보 보호
- API 키나 비밀 정보는 환경 변수로 관리
- 클라이언트 코드에 민감 정보 노출 금지

## 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm run clean
```

#### 2. 라우팅 문제 (SPA)
- 서버에서 모든 경로를 `index.html`로 리다이렉트 설정
- `_redirects` 파일 (Netlify) 또는 `vercel.json` 파일 (Vercel) 설정

#### 3. 환경 변수 인식 안됨
- 환경 변수명이 `VITE_`로 시작하는지 확인
- 배포 플랫폼에서 환경 변수 올바르게 설정되었는지 확인

## 지원 및 문의

배포 관련 문제가 발생하면:
1. 이 문서의 문제 해결 섹션 확인
2. 각 플랫폼의 공식 문서 참조
3. 개발팀에 문의

---

**마지막 업데이트**: 2025년 1월 30일