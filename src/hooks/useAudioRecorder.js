/**
 * Custom hook for audio recording
 * Uses MediaRecorder API for browser-based recording
 */

import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder(maxDuration = 5000) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [error, setError] = useState(null);
    const [duration, setDuration] = useState(0);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            setAudioBlob(null);

            // Revoke old URL if exists
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            startTimeRef.current = Date.now();

            // Collect data chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = () => {
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                // Create blob from chunks
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Create preview URL
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Calculate duration
                const elapsed = Date.now() - startTimeRef.current;
                setDuration(Math.round(elapsed / 1000));
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);

            // Auto-stop after max duration
            timerRef.current = setTimeout(() => {
                stopRecording();
            }, maxDuration);

        } catch (err) {
            console.error('Recording error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Microphone access denied. Please allow microphone access.');
            } else if (err.name === 'NotFoundError') {
                setError('No microphone found. Please connect a microphone.');
            } else {
                setError('Failed to start recording. Please try again.');
            }
        }
    }, [audioUrl, maxDuration]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
    }, []);

    // Reset recording
    const resetRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
        setError(null);
    }, [audioUrl]);

    // Cleanup on unmount
    const cleanup = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
    }, [audioUrl]);

    return {
        isRecording,
        audioBlob,
        audioUrl,
        error,
        duration,
        startRecording,
        stopRecording,
        resetRecording,
        cleanup,
    };
}

export default useAudioRecorder;
