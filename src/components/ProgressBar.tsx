import React from 'react';

interface ProgressBarProps {
  currentPage?: number;
  totalPages?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentPage = 1, 
  totalPages = 17 
}) => {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-inner">
      <div 
        className="bg-gradient-to-r from-red-400 to-red-500 h-4 rounded-full transition-all duration-300 ease-out shadow-sm"
        style={{ width: `${safeProgress}%` }}
      >
        <div className="h-full bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-gray-600">
          Page {currentPage || 1} of {totalPages || 17}
        </span>
        <span className="text-sm font-bold text-red-500">
          {Math.round(safeProgress)}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;