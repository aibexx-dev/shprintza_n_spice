import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StoryPageLayoutProps {
  currentPage?: number;
  totalPages?: number;
  textTop?: string;
  imageUrl?: string;
  textBottom?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onAudio?: () => void;
}

const StoryPageLayout: React.FC<StoryPageLayoutProps> = ({
  currentPage = 1,
  totalPages = 16,
  textTop = '',
  imageUrl = 'https://example.com/placeholder.jpg',
  textBottom = '',
  onPrevious = () => {},
  onNext = () => {},
  onAudio = () => {}
}) => {
  const progressPercentage = ((currentPage || 1) / (totalPages || 16)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage || 1} of {totalPages || 16}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-red-400 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* Top Text */}
            {textTop && (
              <div className="text-center mb-8">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                  {textTop}
                </p>
              </div>
            )}

            {/* Image */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={imageUrl || 'https://example.com/placeholder.jpg'}
                  alt="Story illustration"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-lg font-medium">Story Image</div>';
                    }
                  }}
                />
              </div>
            </div>

            {/* Bottom Text */}
            {textBottom && (
              <div className="text-center">
                <p className="text-xl md:text-2xl font-semibold text-gray-700 leading-relaxed">
                  {textBottom}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <Button
            onClick={onPrevious}
            variant="outline"
            size="lg"
            className="bg-white border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
            disabled={currentPage <= 1}
          >
            ← Previous
          </Button>

          {/* Audio Button */}
          <Button
            onClick={onAudio}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🔊 Listen
          </Button>

          {/* Next Button */}
          <Button
            onClick={onNext}
            size="lg"
            className="bg-red-400 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            disabled={currentPage >= totalPages}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryPageLayout;