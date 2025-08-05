import React, { useState } from 'react';

type AppType = 'selector' | 'linear';

const AppSelector: React.FC = () => {
    const [selectedApp, setSelectedApp] = useState<AppType>('selector');

    if (selectedApp === 'linear') {
        // 직접 import하여 순환 참조 방지
        const LinearApp = React.lazy(() => import('./App_minimal_linear'));
        return (
            <React.Suspense fallback={
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f4f6',
                            borderTop: '4px solid #8b5cf6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }} />
                        <p style={{ color: '#6b7280' }}>Linear 스타일 앱을 로딩 중...</p>
                        <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
                    </div>
                </div>
            }>
                <LinearApp />
            </React.Suspense>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '16px',
                        textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        영어 카드 학습
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '32px'
                    }}>
                        Linear 디자인 시스템이 적용된 모던한 영어 학습 앱
                    </p>
                </div>

                <div style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    padding: '48px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px'
                    }}>
                        <svg width="40" height="40" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '16px'
                    }}>
                        Linear 스타일 영어 학습 앱
                    </h2>

                    <p style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        marginBottom: '32px',
                        lineHeight: '1.6'
                    }}>
                        Linear의 모던하고 세련된 디자인 시스템을 적용한 새로운 영어 학습 경험을 만나보세요.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '32px',
                        fontSize: '14px',
                        color: '#6b7280'
                    }}>
                        <div>✨ Linear 스타일 디자인</div>
                        <div>🎨 깔끔한 색상 시스템</div>
                        <div>🔄 부드러운 애니메이션</div>
                        <div>📱 완벽한 반응형</div>
                    </div>

                    <button
                        onClick={() => setSelectedApp('linear')}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 32px',
                            fontSize: '18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        앱 시작하기 →
                    </button>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px'
                }}>
                    🎉 Linear 디자인 시스템 적용 완료!
                </div>
            </div>
        </div>
    );
};

export default AppSelector;