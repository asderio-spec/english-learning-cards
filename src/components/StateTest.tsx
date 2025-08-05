import React from 'react';
import { useAppContext } from '../context/AppContext';
import { dataService } from '../services/dataService';

/**
 * StateTest component for debugging and testing the important functionality
 * This component shows the current state and allows manual testing
 */
const StateTest: React.FC = () => {
  const { state, actions } = useAppContext();

  const handleLoadMiddle1 = () => {
    const sentences = dataService.getSentencesByGrade('middle1');
    actions.setGrade('middle1');
    actions.setSentences(sentences);
  };

  const handleToggleImportant = () => {
    const currentSentence = state.sentences[state.currentSentenceIndex];
    if (currentSentence) {
      // Update dataService first
      dataService.toggleImportant(currentSentence.id);
      // Then update context
      actions.toggleImportant(currentSentence.id);
    }
  };

  const handleGetImportantSentences = () => {
    const importantSentences = dataService.getImportantSentences();
    console.log('Important sentences from dataService:', importantSentences);
    console.log('Important sentence IDs from context:', state.importantSentences);
  };

  const currentSentence = state.sentences[state.currentSentenceIndex];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">State Test Component</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Current State:</h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p><strong>Grade:</strong> {state.currentGrade || 'None'}</p>
            <p><strong>Sentences Count:</strong> {state.sentences.length}</p>
            <p><strong>Current Index:</strong> {state.currentSentenceIndex}</p>
            <p><strong>Important Sentences Count:</strong> {state.importantSentences.length}</p>
            <p><strong>Important Sentence IDs:</strong> {JSON.stringify(state.importantSentences)}</p>
          </div>
        </div>

        {currentSentence && (
          <div>
            <h3 className="text-lg font-semibold">Current Sentence:</h3>
            <div className="bg-blue-50 p-3 rounded">
              <p><strong>ID:</strong> {currentSentence.id}</p>
              <p><strong>Korean:</strong> {currentSentence.korean}</p>
              <p><strong>English:</strong> {currentSentence.english}</p>
              <p><strong>Is Important:</strong> {currentSentence.isImportant ? '⭐ Yes' : '❌ No'}</p>
              <p><strong>Study Count:</strong> {currentSentence.studyCount}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Actions:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLoadMiddle1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load Middle1 Sentences
            </button>
            
            <button
              onClick={handleToggleImportant}
              disabled={!currentSentence}
              className={`px-4 py-2 rounded ${
                currentSentence
                  ? currentSentence.isImportant
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentSentence?.isImportant ? 'Remove Important' : 'Mark Important'}
            </button>
            
            <button
              onClick={() => actions.setCurrentSentenceIndex(Math.max(0, state.currentSentenceIndex - 1))}
              disabled={state.currentSentenceIndex === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={() => actions.setCurrentSentenceIndex(Math.min(state.sentences.length - 1, state.currentSentenceIndex + 1))}
              disabled={state.currentSentenceIndex >= state.sentences.length - 1}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
            
            <button
              onClick={handleGetImportantSentences}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Log Important Sentences
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">DataService Stats:</h3>
          <div className="bg-green-50 p-3 rounded text-sm">
            {(() => {
              const stats = dataService.getStatistics();
              return (
                <>
                  <p><strong>Total Sentences:</strong> {stats.totalSentences}</p>
                  <p><strong>Important Sentences:</strong> {stats.importantSentences}</p>
                  <p><strong>Sentences by Grade:</strong></p>
                  <ul className="ml-4">
                    {Object.entries(stats.sentencesByGrade).map(([grade, count]) => (
                      <li key={grade}>{grade}: {count}</li>
                    ))}
                  </ul>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateTest;