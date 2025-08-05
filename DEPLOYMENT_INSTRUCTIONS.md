# 🚀 배포 가이드

## GitHub Pages 배포 (추천)

### 1단계: GitHub 저장소 연결
```bash
# GitHub에서 저장소 생성 후 아래 명령어 실행 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/english-card-learning.git
git branch -M main
git push -u origin main
```

### 2단계: GitHub Pages 활성화
1. GitHub 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. Source를 "GitHub Actions"로 선택
4. 자동으로 배포가 시작됩니다

### 3단계: 배포 완료 확인
- Actions 탭에서 배포 진행상황 확인
- 완료 후 `https://YOUR_USERNAME.github.io/english-card-learning/` 에서 접속 가능

---

## 대안 배포 방법

### Vercel (빠른 배포)
```bash
npm install -g vercel
vercel --prod
```

### Netlify (드래그 앤 드롭)
1. [netlify.com](https://netlify.com) 접속
2. "Sites" → "Add new site" → "Deploy manually"
3. `dist` 폴더를 드래그 앤 드롭

### Surge.sh (간단한 정적 호스팅)
```bash
npm install -g surge
cd dist
surge
```

---

## 🎯 배포된 기능들
- ✅ 학년별 600개 영어 문장 학습
- ✅ 실시간 진도 추적
- ✅ TTS 음성 재생
- ✅ 자동재생 기능
- ✅ 키보드 단축키
- ✅ 반응형 디자인
- ✅ PWA 지원

## 📞 문제 해결
배포 중 문제가 발생하면:
1. GitHub Actions 로그 확인
2. `npm run build` 로컬 빌드 테스트
3. `npm run preview` 로컬 프리뷰 테스트