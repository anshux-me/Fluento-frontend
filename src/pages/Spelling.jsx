/**
 * Spelling Practice Page
 * Listen to audio and type the spelling
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWord, getTTSAudio, evaluateSpelling, updateUserStats, createAudioUrl, revokeAudioUrl } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';

export function Spelling() {
    const { user } = useAuth();
    const [difficulty, setDifficulty] = useState('easy');
    const [currentWord, setCurrentWord] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showHint, setShowHint] = useState(false);

    // Fetch a new word and its audio
    const fetchWord = async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        setUserInput('');
        setShowHint(false);

        // Revoke old audio URL
        if (audioUrl) {
            revokeAudioUrl(audioUrl);
            setAudioUrl(null);
        }

        try {
            // Get word
            const word = await getWord('spelling', difficulty);
            setCurrentWord(word);

            // Get TTS audio
            const audioBlob = await getTTSAudio(word.word);
            const url = createAudioUrl(audioBlob);
            setAudioUrl(url);
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

        // Cleanup on unmount
        return () => {
            if (audioUrl) {
                revokeAudioUrl(audioUrl);
            }
        };
    }, [difficulty]);

    // Submit spelling for evaluation
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || !currentWord) return;

        setEvaluating(true);
        setError(null);

        try {
            const evalResult = await evaluateSpelling(userInput.trim(), currentWord.word);
            setResult(evalResult);

            // Update user stats
            if (user) {
                await updateUserStats(user.uid, evalResult.score, 'spelling');
            }
        } catch (err) {
            setError('Failed to evaluate spelling. Please try again.');
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

    // Get hint (first letter and length)
    const getHint = () => {
        if (!currentWord) return '';
        const word = currentWord.word;
        return `${word[0].toUpperCase()}${'_'.repeat(word.length - 1)} (${word.length} letters)`;
    };

    return (
        <div className="page-container max-w-4xl mx-auto">
            <h1 className="page-header flex items-center gap-4">
                <span>📝</span> Spelling Practice
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

            {/* Main Content */}
            {loading ? (
                <div className="card-brutal text-center py-12">
                    <p className="font-mono text-lg">Loading word...</p>
                </div>
            ) : currentWord && !result ? (
                <div className="card-brutal">
                    <div className="text-center mb-8">
                        <span className={`difficulty-${difficulty} mb-4 inline-block`}>
                            {difficulty.toUpperCase()}
                        </span>
                        <h2 className="font-black text-2xl uppercase mb-6">
                            Listen and Spell the Word
                        </h2>

                        {/* Audio Player */}
                        <AudioPlayer audioUrl={audioUrl} autoPlay={true} />

                        {/* Hint */}
                        <div className="mt-6">
                            {showHint ? (
                                <p className="font-mono text-lg text-gray-600">
                                    Hint: {getHint()}
                                </p>
                            ) : (
                                <button
                                    onClick={() => setShowHint(true)}
                                    className="font-mono text-sm text-brutal-blue hover:underline"
                                >
                                    Need a hint?
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Spelling Input */}
                    <form onSubmit={handleSubmit} className="border-t-4 border-brutal-black pt-8">
                        <div className="mb-6">
                            <label className="block font-bold uppercase text-sm mb-3 text-center">
                                Type Your Answer
                            </label>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="input-brutal text-center text-2xl tracking-widest"
                                placeholder="Type here..."
                                autoFocus
                                disabled={evaluating}
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={evaluating || !userInput.trim()}
                                className="btn-brutal-primary text-lg px-8 py-4"
                            >
                                {evaluating ? 'CHECKING...' : 'CHECK SPELLING'}
                            </button>
                        </div>
                    </form>
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

                    {/* Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border-t-4 border-brutal-black pt-6">
                        <div className={`p-4 border-4 ${result.score === 100 ? 'bg-brutal-green/20 border-brutal-green' : 'bg-gray-100 border-brutal-black'}`}>
                            <h4 className="font-bold uppercase text-sm mb-2">Your Answer</h4>
                            <p className="font-mono text-2xl tracking-wider">{result.user_text}</p>
                        </div>
                        <div className="p-4 bg-gray-100 border-4 border-brutal-black">
                            <h4 className="font-bold uppercase text-sm mb-2">Correct Spelling</h4>
                            <p className="font-mono text-2xl tracking-wider">{result.correct_word}</p>
                        </div>
                    </div>

                    {/* Play Audio Again */}
                    <div className="text-center mb-6">
                        <AudioPlayer audioUrl={audioUrl} />
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

export default Spelling;
