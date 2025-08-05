import React from 'react';
import { useAppContext } from '../context/AppContext';
import { dataService } from '../services/dataService';
import type { Grade } from '../types';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            영어 카드 학습
          </h1>
          <p className="text-xl text-gray-600">
            학년을 선택하여 학습을 시작하세요
          </p>
        </div>

        {/* Grade Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {grades.map((grade) => {
            const sentenceCount = dataService.getSentencesByGrade(grade).length;
            
            return (
              <button
                key={grade}
                onClick={() => handleGradeSelect(grade)}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {gradeDisplayMap[grade]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sentenceCount}개 문장
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            각 학년별로 100개의 핵심 영어 문장을 학습할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradeSelector;