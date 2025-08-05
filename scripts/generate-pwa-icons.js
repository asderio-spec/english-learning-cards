/**
 * PWA 아이콘 생성 스크립트
 * 기본 SVG 아이콘을 다양한 크기의 PNG로 변환합니다.
 */

import fs from 'fs';
import path from 'path';

// 기본 SVG 아이콘 (간단한 책 아이콘)
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 배경 원 -->
  <circle cx="256" cy="256" r="240" fill="url(#grad1)" />
  
  <!-- 책 아이콘 -->
  <g transform="translate(256,256)">
    <!-- 책 표지 -->
    <rect x="-80" y="-100" width="160" height="200" rx="8" fill="white" opacity="0.95"/>
    
    <!-- 책 페이지 -->
    <rect x="-75" y="-95" width="150" height="190" rx="4" fill="#f8fafc"/>
    
    <!-- 텍스트 라인들 -->
    <rect x="-60" y="-70" width="120" height="4" rx="2" fill="#6366f1" opacity="0.8"/>
    <rect x="-60" y="-55" width="100" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    <rect x="-60" y="-42" width="110" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    <rect x="-60" y="-29" width="90" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    
    <!-- 영어 단어 예시 -->
    <text x="0" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#6366f1">ABC</text>
    <text x="0" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#8b5cf6">English</text>
    
    <!-- 북마크 -->
    <rect x="60" y="-100" width="12" height="40" fill="#ef4444"/>
    <polygon points="66,-60 60,-70 72,-70" fill="#ef4444"/>
  </g>
</svg>
`;

// 아이콘 크기 정의
const iconSizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

// Favicon ICO 생성을 위한 간단한 SVG
const faviconSVG = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="15" fill="#6366f1"/>
  <rect x="8" y="6" width="16" height="20" rx="1" fill="white"/>
  <rect x="9" y="7" width="14" height="18" rx="1" fill="#f8fafc"/>
  <rect x="10" y="9" width="12" height="1" fill="#6366f1"/>
  <rect x="10" y="12" width="10" height="1" fill="#8b5cf6"/>
  <rect x="10" y="15" width="11" height="1" fill="#8b5cf6"/>
  <text x="16" y="22" text-anchor="middle" font-family="Arial" font-size="6" font-weight="bold" fill="#6366f1">A</text>
</svg>
`;

// 마스크 가능한 아이콘을 위한 SVG (안전 영역 고려)
const maskableIconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 전체 배경 (마스크 안전 영역) -->
  <rect width="512" height="512" fill="url(#grad1)"/>
  
  <!-- 중앙 아이콘 (안전 영역 내) -->
  <g transform="translate(256,256) scale(0.6)">
    <!-- 책 표지 -->
    <rect x="-80" y="-100" width="160" height="200" rx="8" fill="white" opacity="0.95"/>
    
    <!-- 책 페이지 -->
    <rect x="-75" y="-95" width="150" height="190" rx="4" fill="#f8fafc"/>
    
    <!-- 텍스트 라인들 -->
    <rect x="-60" y="-70" width="120" height="4" rx="2" fill="#6366f1" opacity="0.8"/>
    <rect x="-60" y="-55" width="100" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    <rect x="-60" y="-42" width="110" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    <rect x="-60" y="-29" width="90" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"/>
    
    <!-- 영어 단어 예시 -->
    <text x="0" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#6366f1">ABC</text>
    <text x="0" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#8b5cf6">English</text>
    
    <!-- 북마크 -->
    <rect x="60" y="-100" width="12" height="40" fill="#ef4444"/>
    <polygon points="66,-60 60,-70 72,-70" fill="#ef4444"/>
  </g>
</svg>
`;

/**
 * SVG를 Canvas를 사용해 PNG로 변환하는 함수
 * (실제 환경에서는 sharp, canvas 등의 라이브러리 사용 권장)
 */
function generateIconFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  
  // SVG 파일들 생성
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSVG);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);
  fs.writeFileSync(path.join(publicDir, 'maskable-icon.svg'), maskableIconSVG);
  
  // 간단한 HTML 파일로 PNG 생성 가이드 제공
  const generateHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>PWA 아이콘 생성기</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon-preview { margin: 20px 0; }
        .icon-preview img { border: 1px solid #ddd; margin: 10px; }
        .instructions { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>PWA 아이콘 생성</h1>
    
    <div class="instructions">
        <h3>아이콘 생성 방법:</h3>
        <ol>
            <li>아래 SVG 이미지들을 우클릭하여 저장</li>
            <li>온라인 SVG to PNG 변환기 사용 (예: convertio.co, cloudconvert.com)</li>
            <li>각각 필요한 크기로 변환:
                <ul>
                    <li>pwa-192x192.png (192x192)</li>
                    <li>pwa-512x512.png (512x512)</li>
                    <li>apple-touch-icon.png (180x180)</li>
                    <li>favicon-32x32.png (32x32)</li>
                    <li>favicon-16x16.png (16x16)</li>
                </ul>
            </li>
            <li>생성된 PNG 파일들을 public 폴더에 저장</li>
        </ol>
    </div>
    
    <div class="icon-preview">
        <h3>메인 아이콘 (512x512, 192x192용)</h3>
        <img src="data:image/svg+xml;base64,${Buffer.from(iconSVG).toString('base64')}" width="128" height="128" alt="Main Icon">
    </div>
    
    <div class="icon-preview">
        <h3>Favicon (32x32, 16x16용)</h3>
        <img src="data:image/svg+xml;base64,${Buffer.from(faviconSVG).toString('base64')}" width="64" height="64" alt="Favicon">
    </div>
    
    <div class="icon-preview">
        <h3>마스크 가능한 아이콘 (512x512 maskable용)</h3>
        <img src="data:image/svg+xml;base64,${Buffer.from(maskableIconSVG).toString('base64')}" width="128" height="128" alt="Maskable Icon">
    </div>
    
    <div class="instructions">
        <h3>자동 생성 (Node.js 환경):</h3>
        <p>더 정확한 PNG 생성을 위해 다음 패키지 설치 후 사용:</p>
        <pre>npm install sharp</pre>
        <p>그 후 이 스크립트를 수정하여 sharp를 사용한 자동 변환 구현</p>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(publicDir, 'generate-icons.html'), generateHTML);
  
  console.log('✅ PWA 아이콘 SVG 파일들이 생성되었습니다!');
  console.log('📁 public/generate-icons.html을 브라우저에서 열어 PNG 변환 가이드를 확인하세요.');
  console.log('');
  console.log('생성된 파일들:');
  console.log('- public/icon.svg');
  console.log('- public/favicon.svg');
  console.log('- public/maskable-icon.svg');
  console.log('- public/generate-icons.html');
}

// 스크립트 실행
generateIconFiles();