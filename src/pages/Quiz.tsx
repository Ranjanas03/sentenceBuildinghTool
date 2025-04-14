import { useEffect, useState } from 'react';
import useTimer from '../hooks/useTimer';
import { Card } from '@/components/ui/card';
import FeedbackScreen from '../components/FeedbackScreen';

interface Question {
    questionId: string;
    question: string;
    options: string[];
    correctAnswer: string[];
}

const Quiz = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[][]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [isReviewing, setIsReviewing] = useState(false);

    const { timeLeft, startTimer, resetTimer } = useTimer(30);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/questions.json');
                const json = await response.json();
                console.log('Fetched data:', json);  // Log the fetched data

                // Ensure the structure is as expected
                if (json.status === 'SUCCESS' && json.data && json.data.questions && Array.isArray(json.data.questions)) {
                    setQuestions(json.data.questions);
                    setUserAnswers(json.data.questions.map(() => [])); // Initialize answers
                } else {
                    console.error('Invalid data structure:', json);
                }
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleSelectWord = (word: string) => {
        setUserAnswers((prev) => {
            const updated = [...prev];
            const current = updated[currentQuestionIndex] || [];
            const numBlanks = questions[currentQuestionIndex].correctAnswer.length;

            if (current.includes(word)) {
                updated[currentQuestionIndex] = current.filter(w => w !== word);
            } else if (current.length < numBlanks) {
                updated[currentQuestionIndex] = [...current, word];
            }

            return updated;
        });
    };

    const handleRemoveFromBlank = (word: string) => {
        setUserAnswers((prev) => {
            const updated = [...prev];
            updated[currentQuestionIndex] = updated[currentQuestionIndex].filter(w => w !== word);
            return updated;
        });
    };

    const arraysEqual = (a: string[], b: string[]) =>
        a.length === b.length && a.every((val, i) => val === b[i]);

    const calculateScore = () => {
        let total = 0;
        questions.forEach((q, index) => {
            const userAnswer = userAnswers[index] || [];
            if (arraysEqual(userAnswer, q.correctAnswer)) {
                total++;
            }
        });
        setScore(total);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetTimer();
            startTimer();
        } else {
            calculateScore();
            setShowFeedback(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            resetTimer();
            startTimer();
        }
    };

    const handleReview = () => {
        setIsReviewing(true);
    };

    useEffect(() => {
        if (timeLeft === 0) handleNext();
    }, [timeLeft]);

    if (questions.length === 0) {
        return <div className="text-center mt-10">Loading questions...</div>;
    }

    if (showFeedback) {
        // Prepare data for FeedbackScreen
        const feedbackData = questions.map((q, index) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
            selectedAnswer: userAnswers[index] || [],
            isCorrect: arraysEqual(userAnswers[index] || [], q.correctAnswer), // Add this logic
        }));
        

        return (
            <FeedbackScreen
            questions={feedbackData}
            score={score}
            totalQuestions={questions.length}
            onRetry={() => {
                setUserAnswers(questions.map(() => []));
                setCurrentQuestionIndex(0);
                setShowFeedback(false);
                setIsReviewing(false);
                setScore(0);
                startTimer();
            }}
            onReview={handleReview}
            isReviewing={isReviewing} 
        />
        );
    }

    const current = questions[currentQuestionIndex];
    const selectedWords = userAnswers[currentQuestionIndex] || [];
    const blanksRemaining = current.correctAnswer.length - selectedWords.length;

    return (
        <Card className="p-6 max-w-3xl mx-auto shadow-lg mt-12 rounded-lg bg-white">
            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                <div
                    className="bg-blue-500 h-2 transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>


            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}:
            </h2>
            <p className="mb-6 text-gray-700">{current.question}</p>

            {/* Selected words as blanks */}
            <div className="flex flex-wrap gap-2 mb-6">
                {selectedWords.map((word, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleRemoveFromBlank(word)}
                        className="px-4 py-2 bg-green-200 border border-green-600 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {word}
                    </div>
                ))}
                {Array.from({ length: blanksRemaining }).map((_, idx) => (
                    <div
                        key={idx}
                        className="px-4 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-400 animate-pulse"
                    >
                        Blank
                    </div>
                ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {current.options.map((word, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelectWord(word)}
                        className={`px-4 transition-all duration-300 transform py-2 border rounded transition ${selectedWords.includes(word)
                            ? 'bg-green-300 border-green-600'
                            : 'bg-white border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {word}
                    </button>
                ))}
            </div>

            <div className="text-right font-medium text-red-600 mb-4">
                ⏳ Time Left: {timeLeft}s
            </div>


            <div className="flex justify-between mt-3">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 ${currentQuestionIndex === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600'} shadow-md`}
                >
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={selectedWords.length !== current.correctAnswer.length}
                    className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 ${selectedWords.length !== current.correctAnswer.length
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'} shadow-md`}
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </Card>
    );
};

export default Quiz;
