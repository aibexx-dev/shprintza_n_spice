import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CoverPageLayoutProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  isBackCover?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onAudio?: () => void;
}

const CoverPageLayout: React.FC<CoverPageLayoutProps> = ({
  title = "My Amazing Adventure Book",
  subtitle = "A Fun Story for Young Readers",
  imageUrl = "https://example.com/placeholder.jpg",
  isBackCover = false,
  currentPage = 1,
  totalPages = 17,
  onPrevious,
  onNext,
  onAudio
}) => {
  const progressPercentage = ((currentPage || 1) / (totalPages || 17)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage || 1} of {totalPages || 17}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="p-8 text-center space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 leading-tight">
                {title || "My Amazing Adventure Book"}
              </h1>
              {!isBackCover && (
                <p className="text-xl md:text-2xl text-gray-700 font-medium">
                  {subtitle || "A Fun Story for Young Readers"}
                </p>
              )}
              {isBackCover && (
                <div className="space-y-3">
                  <p className="text-lg text-gray-700">
                    Thank you for reading our adventure!
                  </p>
                  <p className="text-base text-gray-600">
                    We hope you enjoyed the story and learned something new.
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Keep reading and keep learning!
                  </p>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={imageUrl || "https://example.com/placeholder.jpg"}
                alt={isBackCover ? "Back cover illustration" : "Cover illustration"}
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg border-4 border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://example.com/placeholder.jpg";
                }}
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-300" />
            </div>

            {/* Additional Cover Text */}
            {!isBackCover && (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-purple-600">
                  Interactive Reading Adventure
                </p>
                <p className="text-sm text-gray-600">
                  With fun quizzes and audio narration
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={onPrevious}
            disabled={!onPrevious}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <Button
            onClick={onAudio}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-1a3 3 0 00-6 0v1z" />
            </svg>
            Listen
          </Button>

          <Button
            onClick={onNext}
            disabled={!onNext}
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 disabled:opacity-50"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoverPageLayout;