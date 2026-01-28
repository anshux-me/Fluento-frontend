/**
 * Audio Recorder Component
 * Provides UI for recording audio with visual feedback
 */

import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useEffect } from 'react';

export function AudioRecorder({ onRecordingComplete, maxDuration = 5000 }) {
    const {
        isRecording,
        audioBlob,
        audioUrl,
        error,
        duration,
        startRecording,
        stopRecording,
        resetRecording,
        cleanup,
    } = useAudioRecorder(maxDuration);

    // Notify parent when recording is complete
    useEffect(() => {
        if (audioBlob && onRecordingComplete) {
            onRecordingComplete(audioBlob);
        }
    }, [audioBlob, onRecordingComplete]);

    // Cleanup on unmount
    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="card-brutal bg-brutal-red/10 border-brutal-red p-4">
                    <p className="font-mono text-sm text-brutal-red">{error}</p>
                </div>
            )}

            {/* Recording Controls */}
            <div className="flex flex-col items-center gap-4">
                {!isRecording && !audioBlob && (
                    <button
                        onClick={startRecording}
                        className="btn-brutal-primary text-lg px-8 py-4 flex items-center gap-3"
                    >
                        <span className="text-2xl">🎤</span>
                        <span>START RECORDING</span>
                    </button>
                )}

                {isRecording && (
                    <div className="flex flex-col items-center gap-4">
                        {/* Recording Indicator */}
                        <div className="flex items-center gap-3">
                            <div className="recording-pulse" />
                            <span className="font-mono font-bold text-brutal-red uppercase">
                                Recording...
                            </span>
                        </div>

                        {/* Waveform Animation */}
                        <div className="flex items-center justify-center gap-1 h-12">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div
                                    key={i}
                                    className="waveform-bar bg-brutal-red"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>

                        {/* Stop Button */}
                        <button
                            onClick={stopRecording}
                            className="btn-brutal-danger text-lg px-8 py-4 flex items-center gap-3"
                        >
                            <span className="text-2xl">⏹️</span>
                            <span>STOP</span>
                        </button>

                        <p className="font-mono text-sm text-gray-600">
                            Max {maxDuration / 1000} seconds
                        </p>
                    </div>
                )}

                {audioBlob && !isRecording && (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        {/* Playback */}
                        <div className="card-brutal w-full p-4">
                            <p className="font-mono text-sm mb-2">
                                Duration: {duration}s
                            </p>
                            <audio
                                src={audioUrl}
                                controls
                                className="w-full"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={resetRecording}
                                className="btn-brutal flex items-center gap-2"
                            >
                                <span>🔄</span>
                                <span>RETRY</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AudioRecorder;
