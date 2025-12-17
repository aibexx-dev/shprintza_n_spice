import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuizPageLayoutProps {
  question?: string;
  imageUrl?: string;
  answers?: string[];
  currentPage?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onAudio?: () => void;
  onAnswerSelect?: (answerIndex: number) => void;
  selectedAnswer?: number | null;
}

const QuizPageLayout: React.FC<QuizPageLayoutProps> = ({
  question = "What color is the friendly dragon in our story?",
  imageUrl = "https://example.com/placeholder.jpg",
  answers = ["Red like a fire truck", "Blue like the ocean", "Green like grass", "Purple like grapes"],
  currentPage = 1,
  totalPages = 17,
  onPrevious = () => {},
  onNext = () => {},
  onAudio = () => {},
  onAnswerSelect = () => {},
  selectedAnswer = null
}) => {
  const progress = ((currentPage || 1) / (totalPages || 17)) * 100;
  const safeAnswers = answers || [];

  const handleAnswerClick = (index: number) => {
    if (onAnswerSelect) {
      onAnswerSelect(index);
    }
  };

  const answerColors = [
    'bg-red-400 hover:bg-red-500',
    'bg-yellow-400 hover:bg-yellow-500', 
    'bg-green-400 hover:bg-green-500',
    'bg-purple-400 hover:bg-purple-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-pink-100 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-400 to-pink-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          
          {/* Question at Top */}
          <Card className="bg-white shadow-lg border-4 border-yellow-300">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 leading-relaxed">
                {question}
              </h2>
            </CardContent>
          </Card>

          {/* Image in Middle */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={imageUrl}
                alt="Story illustration"
                className="w-80 h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Answer Options at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeAnswers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`
                  ${answerColors[index] || 'bg-gray-400 hover:bg-gray-500'}
                  ${selectedAnswer === index ? 'ring-4 ring-white ring-offset-2' : ''}
                  text-white font-bold py-6 px-8 rounded-xl text-lg shadow-lg
                  transform transition-all duration-200 hover:scale-105 active:scale-95
                `}
                variant="default"
              >
                <span className="mr-3 text-xl">{String.fromCharCode(65 + index)}.</span>
                {answer}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white shadow-lg border-t-4 border-yellow-300 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={onPrevious}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
            variant="default"
          >
            ← Previous
          </Button>

          <Button
            onClick={onAudio}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105"
            variant="default"
          >
            🔊 Listen
          </Button>

          <Button
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
            variant="default"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPageLayout;