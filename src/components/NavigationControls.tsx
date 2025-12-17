import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface NavigationControlsProps {
  currentPage?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onAudio?: () => void;
  isPlaying?: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentPage = 0,
  totalPages = 17,
  onPrevious = () => {},
  onNext = () => {},
  onAudio = () => {},
  isPlaying = false
}) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === (totalPages - 1);
  const progressPercentage = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  return (
    <div className="w-full bg-white border-t border-gray-200 p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={isFirstPage}
          className={`
            flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl
            ${isFirstPage 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100'
            }
            transition-all duration-200
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        {/* Audio Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onAudio}
          className={`
            flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl
            ${isPlaying
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
              : 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300'
            }
            transition-all duration-200
          `}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying ? 'Playing' : 'Listen'}
        </Button>

        {/* Next Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onNext}
          disabled={isLastPage}
          className={`
            flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl
            ${isLastPage 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100'
            }
            transition-all duration-200
          `}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Page Type Indicator */}
      <div className="mt-3 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          {currentPage === 0 && 'Cover Page'}
          {currentPage === 1 && 'Dedication'}
          {currentPage >= 2 && currentPage <= 8 && 'Story'}
          {currentPage >= 9 && currentPage <= 12 && 'Quiz Time'}
          {currentPage >= 13 && currentPage <= 16 && 'Story'}
          {currentPage === (totalPages - 1) && 'The End'}
        </span>
      </div>
    </div>
  );
};

export default NavigationControls;