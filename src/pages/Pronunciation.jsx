/**
 * Pronunciation Practice Page
 * Record voice and get pronunciation feedback
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWord, evaluatePronunciation, updateUserStats } from '../services/api';
import AudioRecorder from '../components/AudioRecorder';

export function Pronunciation() {
    const { user } = useAuth();
    const [difficulty, setDifficulty] = useState('easy');
    const [currentWord, setCurrentWord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    // Fetch a new word
    const fetchWord = async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        setAudioBlob(null);

        try {
            const word = await getWord('pronunciation', difficulty);
            setCurrentWord(word);
        } catch (err) {
            setError('Failed to load word. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch word on mount and difficulty change
    useEffect(() => {
        fetchWord();
    }, [difficulty]);

    // Handle recording complete
    const handleRecordingComplete = (blob) => {
        setAudioBlob(blob);
    };

    // Submit pronunciation for evaluation
    const handleSubmit = async () => {
        if (!audioBlob || !currentWord) return;

        setEvaluating(true);
        setError(null);

        try {
            const evalResult = await evaluatePronunciation(audioBlob, currentWord.word);
            setResult(evalResult);

            // Update user stats
            if (user) {
                await updateUserStats(user.uid, evalResult.score, 'pronunciation');
            }
        } catch (err) {
            setError('Failed to evaluate pronunciation. Please try again.');
            console.error(err);
        } finally {
            setEvaluating(false);
        }
    };

    // Get score class for styling
    const getScoreClass = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'needs-work';
        return 'poor';
    };

    return (
        <div className="page-container max-w-4xl mx-auto">
            <h1 className="page-header flex items-center gap-4">
                <span>🎤</span> Pronunciation Practice
            </h1>

            {/* Difficulty Selector */}
            <div className="card-brutal mb-8">
                <h3 className="font-bold uppercase text-sm mb-3">Select Difficulty</h3>
                <div className="flex flex-wrap gap-3">
                    {['easy', 'medium', 'hard'].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`
                px-6 py-2 font-bold uppercase border-4 border-brutal-black
                transition-all duration-150
                ${difficulty === d
                                    ? d === 'easy'
                                        ? 'bg-brutal-green shadow-none translate-x-1 translate-y-1'
                                        : d === 'medium'
                                            ? 'bg-brutal-yellow shadow-none translate-x-1 translate-y-1'
                                            : 'bg-brutal-red text-white shadow-none translate-x-1 translate-y-1'
                                    : 'bg-brutal-white shadow-brutal hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5'
                                }
              `}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="card-brutal bg-brutal-red/10 border-brutal-red p-4 mb-8">
                    <p className="font-mono text-brutal-red">{error}</p>
                </div>
            )}

            {/* Word Display */}
            {loading ? (
                <div className="card-brutal text-center py-12">
                    <p className="font-mono text-lg">Loading word...</p>
                </div>
            ) : currentWord && !result ? (
                <div className="card-brutal mb-8">
                    <div className="text-center mb-8">
                        <span className={`difficulty-${difficulty} mb-4 inline-block`}>
                            {difficulty.toUpperCase()}
                        </span>
                        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase mb-4 break-words">
                            {currentWord.word}
                        </h2>
                        <p className="font-mono text-gray-600 max-w-md mx-auto">
                            {currentWord.definition}
                        </p>
                    </div>

                    {/* Recording Section */}
                    <div className="border-t-4 border-brutal-black pt-8">
                        <h3 className="font-bold uppercase text-center mb-6">
                            Record Your Pronunciation
                        </h3>
                        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

                        {/* Submit Button */}
                        {audioBlob && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={evaluating}
                                    className="btn-brutal-primary text-lg px-8 py-4"
                                >
                                    {evaluating ? 'EVALUATING...' : 'CHECK PRONUNCIATION'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Results Display */}
            {result && (
                <div className="card-brutal animate-bounce-in">
                    <div className="text-center mb-8">
                        <h3 className="font-bold uppercase text-lg mb-4">Your Score</h3>
                        <div className={`score-display ${getScoreClass(result.score)}`}>
                            {result.score}%
                        </div>
                        <p className="font-mono mt-4 text-lg">{result.feedback}</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border-t-4 border-brutal-black pt-6">
                        <div className="p-4 bg-gray-100 border-2 border-brutal-black">
                            <h4 className="font-bold uppercase text-sm mb-2">Target Word</h4>
                            <p className="font-mono text-lg">{result.target_word}</p>
                            <p className="font-mono text-sm text-gray-600 mt-1">
                                /{result.target_phonemes}/
                            </p>
                        </div>
                        <div className="p-4 bg-gray-100 border-2 border-brutal-black">
                            <h4 className="font-bold uppercase text-sm mb-2">We Heard</h4>
                            <p className="font-mono text-lg">{result.recognized_text || '(nothing)'}</p>
                            <p className="font-mono text-sm text-gray-600 mt-1">
                                /{result.recognized_phonemes}/
                            </p>
                        </div>
                    </div>

                    {/* XP Earned */}
                    <div className="text-center p-4 bg-brutal-yellow border-4 border-brutal-black mb-6">
                        <p className="font-black text-lg">
                            +{result.score} XP EARNED! 🎉
                        </p>
                    </div>

                    {/* Next Word Button */}
                    <div className="text-center">
                        <button
                            onClick={fetchWord}
                            className="btn-brutal-secondary text-lg"
                        >
                            NEXT WORD →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pronunciation;
