/**
 * Audio Player Component
 * Plays TTS audio for spelling practice
 */

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer({ audioUrl, onPlay, autoPlay = false }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const audioRef = useRef(null);

    // Auto-play on mount if enabled
    useEffect(() => {
        if (autoPlay && audioUrl && audioRef.current) {
            handlePlay();
        }
    }, [audioUrl, autoPlay]);

    const handlePlay = async () => {
        if (!audioRef.current || !audioUrl) return;

        try {
            setIsLoading(true);
            await audioRef.current.play();
            setIsPlaying(true);
            setPlayCount(prev => prev + 1);
            if (onPlay) onPlay();
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                onError={() => setIsLoading(false)}
            />

            {/* Play Button */}
            <button
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={isLoading || !audioUrl}
                className={`
          w-24 h-24 rounded-full border-4 border-brutal-black
          flex items-center justify-center text-4xl
          transition-all duration-150
          ${isPlaying
                        ? 'bg-brutal-yellow animate-pulse-glow'
                        : 'bg-brutal-white shadow-brutal hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                {isLoading ? (
                    <span className="animate-spin">⏳</span>
                ) : isPlaying ? (
                    <span>⏸️</span>
                ) : (
                    <span>🔊</span>
                )}
            </button>

            {/* Play Count */}
            <p className="font-mono text-sm text-gray-600">
                Played: {playCount} {playCount === 1 ? 'time' : 'times'}
            </p>

            {/* Hint */}
            <p className="font-mono text-xs text-gray-500">
                Click to {isPlaying ? 'pause' : 'play'} the word
            </p>
        </div>
    );
}

export default AudioPlayer;
