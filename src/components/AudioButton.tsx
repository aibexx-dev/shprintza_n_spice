import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AudioButtonProps {
  onPlay?: () => void;
  onPause?: () => void;
  disabled?: boolean;
  className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  onPlay = () => {}, 
  onPause = () => {}, 
  disabled = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      onPause();
    } else {
      setIsPlaying(true);
      onPlay();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-12 h-12 rounded-full 
        bg-green-500 hover:bg-green-600 
        text-white font-bold text-lg
        transition-all duration-200 
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      {isPlaying ? (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="text-white"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="text-white ml-0.5"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </Button>
  );
};

export default AudioButton;