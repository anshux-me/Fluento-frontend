/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import { getRandomWord as getWordFromFirestore, getDailyWords as getDailyWordsFromFirestore, getWordStats } from './wordService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper function for API requests
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `Request failed with status ${response.status}`);
    }

    // Check if response is audio
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('audio')) {
        return response.blob();
    }

    return response.json();
}

/**
 * Get authenticated headers
 */
function getAuthHeaders(firebaseUid) {
    return {
        'X-Firebase-UID': firebaseUid,
    };
}

// ============== User Endpoints ==============

/**
 * Sync user with backend after Firebase auth
 */
export async function syncUser(firebaseUid, email, displayName) {
    return apiRequest('/user/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firebase_uid: firebaseUid,
            email,
            display_name: displayName,
        }),
    });
}

/**
 * Get user profile with stats and badges
 */
export async function getUserProfile(firebaseUid) {
    return apiRequest('/user/profile', {
        headers: getAuthHeaders(firebaseUid),
    });
}

/**
 * Get user stats only
 */
export async function getUserStats(firebaseUid) {
    return apiRequest('/user/stats', {
        headers: getAuthHeaders(firebaseUid),
    });
}

/**
 * Update user stats after practice session
 */
export async function updateUserStats(firebaseUid, xpEarned, mode) {
    return apiRequest('/user/stats', {
        method: 'POST',
        headers: {
            ...getAuthHeaders(firebaseUid),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            xp_earned: xpEarned,
            mode,
        }),
    });
}

// ============== Word Endpoints ==============

/**
 * Get a random word for practice (from Firestore)
 */
export async function getWord(mode, difficulty) {
    return getWordFromFirestore(difficulty);
}

/**
 * Get the 5 words of the day (from Firestore)
 */
export async function getDailyWords() {
    const words = await getDailyWordsFromFirestore();
    return { words };
}

/**
 * Get word count (from Firestore)
 */
export async function getWordCount(difficulty = null) {
    const stats = await getWordStats();
    if (difficulty) {
        return { count: stats[difficulty.toLowerCase()] || 0, difficulty };
    }
    return { count: stats.total || 0, difficulty: null };
}

// ============== Pronunciation Endpoints ==============

/**
 * Evaluate pronunciation
 */
export async function evaluatePronunciation(audioBlob, targetWord) {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');
    formData.append('target_word', targetWord);

    return apiRequest('/pronunciation/evaluate', {
        method: 'POST',
        body: formData,
    });
}

// ============== Spelling Endpoints ==============

/**
 * Evaluate spelling
 */
export async function evaluateSpelling(userText, targetWord) {
    return apiRequest('/spelling/evaluate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_text: userText,
            target_word: targetWord,
        }),
    });
}

/**
 * Get TTS audio for a word
 */
export async function getTTSAudio(word) {
    return apiRequest(`/spelling/tts/${encodeURIComponent(word)}`);
}

/**
 * Create audio URL from blob
 */
export function createAudioUrl(blob) {
    return URL.createObjectURL(blob);
}

/**
 * Revoke audio URL to free memory
 */
export function revokeAudioUrl(url) {
    URL.revokeObjectURL(url);
}

// ============== Health Check ==============

/**
 * Check API health
 */
export async function checkHealth() {
    return apiRequest('/health');
}
