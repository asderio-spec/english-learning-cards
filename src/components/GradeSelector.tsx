import React from 'react';
import { useAppContext } from '../context/AppContext';
import { dataService } from '../services/dataService';
import type { Grade } from '../types';
import Button from '../design-system/components/Button/Button';
import Card from '../design-system/components/Card/Card';

const gradeDisplayMap: Record<Grade, string> = {
  middle1: '중1',
  middle2: '중2',
  middle3: '중3',
  high1: '고1',
  high2: '고2',
  high3: '고3',
};

const GradeSelector: React.FC = () => {
  const { actions } = useAppContext();

  const handleGradeSelect = async (grade: Grade) => {
    try {
      actions.setLoading({ 
        isLoading: true, 
        message: `${gradeDisplayMap[grade]} 문장을 불러오는 중...` 
      });

      const sentences = dataService.getSentencesByGrade(grade);
      
      actions.setGrade(grade);
      actions.setSentences(sentences);
      actions.setLoading({ isLoading: false });
      
    } catch (error) {
      console.error('Error loading sentences for grade:', grade, error);
      actions.setLoading({ isLoading: false });
      actions.showError(`${gradeDisplayMap[grade]} 문장 로딩에 실패했습니다`, 4000);
    }
  };

  const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '32px 16px'
        }}
      >
        {/* Header space for fixed header */}
        <div style={{ height: '80px' }}></div>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 
            style={{
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}
          >
            영어 카드 학습
          </h1>
          <p 
            style={{
              fontSize: '18px',
              lineHeight: '28px',
              color: 'var(--text-secondary)',
              fontWeight: 400
            }}
          >
            학년을 선택하여 학습을 시작하세요
          </p>
        </div>

        {/* Grade Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {grades.map((grade, index) => {
            const sentenceCount = dataService.getSentencesByGrade(grade).length;
            
            return (
              <Card
                key={grade}
                variant="elevated"
                padding="lg"
                interactive={true}
                onClick={() => handleGradeSelect(grade)}
                animate={true}
                animationDelay={index * 0.1}
                style={{
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div 
                  style={{
                    fontSize: '24px',
                    lineHeight: '32px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}
                >
                  {gradeDisplayMap[grade]}
                </div>
                <div 
                  style={{
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  {sentenceCount}개 문장
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p 
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              padding: '0 16px'
            }}
          >
            각 학년별로 핵심 영어 문장을 학습할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradeSelector;