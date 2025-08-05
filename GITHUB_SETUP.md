# GitHub Pages 배포 가이드

## 1단계: GitHub 저장소 연결

GitHub에서 저장소 생성 후 아래 명령어를 터미널에서 실행하세요:

```bash
# GitHub 저장소 연결 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/english-card-learning.git

# 메인 브랜치로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 2단계: GitHub Pages 활성화

1. GitHub 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭  
3. Source를 "GitHub Actions"로 선택
4. 자동으로 배포가 시작됩니다

## 3단계: 배포 완료 확인

- "Actions" 탭에서 배포 진행상황 확인
- 완료 후 `https://YOUR_USERNAME.github.io/english-card-learning/` 에서 접속 가능

---

## 🔧 이미 설정된 파일들

✅ `.github/workflows/deploy.yml` - GitHub Actions 워크플로우
✅ `vite.config.ts` - GitHub Pages용 설정
✅ `dist/` 폴더 - 빌드된 파일들

모든 설정이 완료되어 있으므로 GitHub에 푸시만 하면 자동으로 배포됩니다!