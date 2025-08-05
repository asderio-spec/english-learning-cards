/**
 * 앱 선택기 - 영어 학습 앱과 디자인 시스템 데모 중 선택
 */

import React, { useState } from 'react';

// Lazy load the apps to avoid initial loading issues
const EnglishLearningApp = React.lazy(() => import('./App_simple'));
const LinearEnglishApp = React.lazy(() => import('./App_linear_fixed'));
const DesignSystemDemo = React.lazy(() => import('./App_design_demo'));

type AppType = 'selector' | 'learning' | 'linear' | 'design';

const AppSelector: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppType>('selector');

  if (selectedApp === 'learning') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">영어 학습 앱을 로딩 중...</p>
          </div>
        </div>
      }>
        <EnglishLearningApp />
      </React.Suspense>
    );
  }

  if (selectedApp === 'linear') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Linear 스타일 앱을 로딩 중...</p>
          </div>
        </div>
      }>
        <LinearEnglishApp />
      </React.Suspense>
    );
  }

  if (selectedApp === 'design') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">디자인 시스템 데모를 로딩 중...</p>
          </div>
        </div>
      }>
        <DesignSystemDemo />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            English Card Learning Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            영어 학습 앱과 Linear 디자인 시스템 데모를 확인해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 기존 영어 학습 앱 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">기존 영어 학습 앱</h2>
              <p className="text-gray-600 mb-6">
                기존 디자인 시스템을 사용한 영어 학습 앱입니다.
              </p>
              <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
                <li>• 학년별 영어 문장 학습</li>
                <li>• 카드 뒤집기 인터랙션</li>
                <li>• 자동 재생 기능</li>
                <li>• 중요 문장 북마크</li>
                <li>• 진도 추적 시스템</li>
                <li>• TTS (음성 합성) 지원</li>
              </ul>
              <button
                onClick={() => setSelectedApp('learning')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                기존 앱 보기
              </button>
            </div>
          </div>

          {/* Linear 스타일 영어 학습 앱 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border-2 border-purple-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Linear 스타일 앱 ✨</h2>
              <p className="text-gray-600 mb-6">
                Linear의 모던하고 세련된 디자인 시스템을 적용한 새로운 영어 학습 앱입니다.
              </p>
              <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
                <li>• ✨ Linear 스타일 모던 디자인</li>
                <li>• 🎨 깔끔한 색상 시스템</li>
                <li>• 🔄 부드러운 호버 애니메이션</li>
                <li>• 📱 완벽한 반응형 레이아웃</li>
                <li>• ⭐ 개선된 사용자 경험</li>
                <li>• 🎯 모든 기존 기능 유지</li>
              </ul>
              <button
                onClick={() => setSelectedApp('linear')}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                Linear 스타일 앱 체험하기
              </button>
            </div>
          </div>

          {/* 디자인 시스템 데모 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Linear 디자인 시스템</h2>
              <p className="text-gray-600 mb-6">
                완성된 Linear 디자인 시스템의 모든 컴포넌트와 토큰을 확인할 수 있습니다.
              </p>
              <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
                <li>• 완전한 색상 시스템 (라이트/다크 모드)</li>
                <li>• 타이포그래피 및 간격 토큰</li>
                <li>• UI 컴포넌트 라이브러리</li>
                <li>• 테마 시스템 데모</li>
                <li>• 반응형 레이아웃 시스템</li>
                <li>• 애니메이션 시스템</li>
              </ul>
              <button
                onClick={() => setSelectedApp('design')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                디자인 시스템 데모 보기
              </button>
            </div>
          </div>
        </div>

        {/* 뒤로 가기 버튼 (다른 앱에서 돌아올 때 표시) */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            💡 각 앱에서 브라우저의 뒤로 가기 버튼을 눌러 이 화면으로 돌아올 수 있습니다.
          </p>
        </div>

        {/* 프로젝트 정보 */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎉 Linear 디자인 시스템 적용 완료!</h3>
            <p className="text-gray-600 mb-4">
              기존 영어 학습 앱에 Linear의 모던한 디자인 시스템이 성공적으로 적용되었습니다.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
              <span>✅ Linear 색상 시스템</span>
              <span>✅ 모던 카드 디자인</span>
              <span>✅ 부드러운 애니메이션</span>
              <span>✅ 모든 기능 유지</span>
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                💡 <strong>비교해보세요:</strong> 기존 앱과 Linear 스타일 앱을 번갈아 사용해보며 디자인 개선사항을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelector;