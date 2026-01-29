/**
 * Word of the Day Component
 * Displays 5 daily words with auto-rotation every 2 seconds
 */

import { useState, useEffect } from 'react';
import { getDailyWords } from '../services/api';

export function WordOfTheDay() {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch daily words on mount
    useEffect(() => {
        async function fetchDailyWords() {
            try {
                const data = await getDailyWords();
                setWords(data.words || []);
            } catch (err) {
                console.error('Error fetching daily words:', err);
                setError('Failed to load words of the day');
            } finally {
                setLoading(false);
            }
        }

        fetchDailyWords();
    }, []);

    // Auto-rotate words every 5 seconds
    useEffect(() => {
        if (words.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [words.length]);

    // Handle dot click
    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="card-brutal bg-gradient-to-br from-brutal-yellow to-yellow-300 mb-8">
                <div className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-brutal-black animate-pulse"
                                style={{ animationDelay: `${i * 2}s` }}
                            />
                        ))}
                    </div>
                    <p className="font-mono text-sm">Loading words of the day...</p>
                </div>
            </div>
        );
    }

    if (error || words.length === 0) {
        return null; // Don't show section if no words available
    }

    const currentWord = words[currentIndex];

    return (
        <div className="card-brutal bg-gradient-to-br from-brutal-yellow to-yellow-300 mb-6 overflow-hidden p-4">
            {/* Header */}
            <div className="border-b-2 border-brutal-black pb-2 mb-3">
                <h2 className="font-black text-base uppercase flex items-center gap-2">
                    <span>📚</span> Word of the Day
                </h2>
            </div>

            {/* Word Display - Fixed height container */}
            <div className="text-center py-2 h-[100px] flex flex-col justify-center overflow-hidden">
                <div
                    key={currentIndex}
                    className="animate-fade-in"
                >
                    {/* Big Word - Fixed height with truncation */}
                    <h3 className="font-black text-2xl md:text-3xl uppercase tracking-wide mb-2 truncate px-2">
                        {currentWord.word}
                    </h3>

                    {/* Meaning - Fixed height with line clamp */}
                    <p className="font-mono text-sm text-brutal-black/80 max-w-md mx-auto px-2 line-clamp-2">
                        "{currentWord.meaning}"
                    </p>
                </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2 pt-3 border-t-2 border-brutal-black mt-3">
                {words.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2.5 h-2.5 rounded-full border-2 border-brutal-black transition-all duration-300 ${index === currentIndex
                            ? 'bg-brutal-black scale-125'
                            : 'bg-white hover:bg-gray-300'
                            }`}
                        aria-label={`Go to word ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default WordOfTheDay;
