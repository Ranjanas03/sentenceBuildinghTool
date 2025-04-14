import React from 'react';

interface FeedbackScreenProps {
  questions: {
    question: string;
    correctAnswer: string[];
    selectedAnswer: string[];
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  isReviewing: boolean;
  onRetry: () => void;
  onReview: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  questions,
  score,
  totalQuestions,
  onRetry,
  onReview,
}) => {
  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        🎉 Quiz Completed!
      </h2>
      <div className="text-center text-lg text-gray-700 mb-8">
        Your Score: <span className="font-semibold text-blue-600">{score}</span> / {totalQuestions}
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <p className="font-medium text-gray-800 mb-2">
              Q{index + 1}: {q.question}
            </p>
            <p className="text-sm">
              <span
                className={`font-semibold ${
                  q.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{q.selectedAnswer.join(', ')}</span>
            </p>
            <p className="text-sm text-gray-600">
              Correct: <span className="font-medium">{q.correctAnswer.join(', ')}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          🔁 Retry Quiz
        </button>
        <button
          onClick={onReview}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          📖 Review Answers
        </button>
      </div>
    </div>
  );
};

export default FeedbackScreen;
