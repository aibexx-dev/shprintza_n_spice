import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AudioButtonProps {
  audioSrc?: string;
  onPlay?: () => void;
  onPause?: () => void;
  disabled?: boolean;
  className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  audioSrc,
  onPlay = () => {}, 
  onPause = () => {}, 
  disabled = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio and reset when audioSrc changes (page navigation)
  useEffect(() => {
    console.log('AudioButton: audioSrc changed to:', audioSrc);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    
    // Create new audio element for the new source
    if (audioSrc) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = audioSrc;
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', audio.error, e);
        setIsPlaying(false);
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio ready to play:', audioSrc);
      });
      
      audio.addEventListener('loadstart', () => {
        console.log('Audio loading started:', audioSrc);
      });
      
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  const handleClick = () => {
    console.log('AudioButton clicked, disabled:', disabled, 'audioRef:', audioRef.current);
    if (disabled || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause();
    } else {
      console.log('Attempting to play audio...');
      audioRef.current.play()
        .then(() => {
          console.log('Audio playing successfully');
        })
        .catch((err) => {
          console.error('Play error:', err);
        });
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