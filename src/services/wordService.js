/**
 * Word Service - Firestore Integration
 * Fetches words directly from Firestore database
 */

import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    limit,
    orderBy,
    startAt,
    getCountFromServer
} from 'firebase/firestore';

// Cache for daily words
let dailyWordsCache = {
    date: null,
    words: []
};

// Cache for word counts
let wordCountsCache = null;

/**
 * Get word counts from metadata
 */
export async function getWordStats() {
    if (wordCountsCache) {
        return wordCountsCache;
    }

    try {
        const metadataRef = doc(db, 'metadata', 'word_counts');
        const metadataSnap = await getDoc(metadataRef);

        if (metadataSnap.exists()) {
            wordCountsCache = metadataSnap.data();
            return wordCountsCache;
        }

        return { easy: 0, medium: 0, hard: 0, total: 0 };
    } catch (error) {
        console.error('Error fetching word counts:', error);
        return { easy: 0, medium: 0, hard: 0, total: 0 };
    }
}

/**
 * Get a random word by difficulty
 */
export async function getRandomWord(difficulty) {
    try {
        const collectionName = `words_${difficulty.toLowerCase()}`;
        const wordsRef = collection(db, collectionName);

        // Get count for random selection
        const stats = await getWordStats();
        const count = stats[difficulty.toLowerCase()] || 100;

        // Generate random index
        const randomIndex = Math.floor(Math.random() * count);

        // Query for random word using index
        const q = query(
            wordsRef,
            orderBy('index'),
            startAt(randomIndex),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            // Fallback: get first word
            const fallbackQ = query(wordsRef, limit(1));
            const fallbackSnap = await getDocs(fallbackQ);
            if (!fallbackSnap.empty) {
                return formatWordData(fallbackSnap.docs[0].data());
            }
            return null;
        }

        return formatWordData(snapshot.docs[0].data());
    } catch (error) {
        console.error('Error fetching random word:', error);
        throw error;
    }
}

/**
 * Get daily words (2 easy, 2 medium, 1 hard)
 * Returns same words for the entire day
 */
export async function getDailyWords() {
    const today = new Date().toDateString();

    // Return cached words if valid
    if (dailyWordsCache.date === today && dailyWordsCache.words.length > 0) {
        return dailyWordsCache.words;
    }

    try {
        const stats = await getWordStats();

        // Use date as seed for consistent daily selection
        const dateSeed = new Date().toISOString().split('T')[0];
        const seedNum = hashCode(dateSeed);

        const dailyWords = [];

        // Get 2 easy words
        const easyIndices = getSeededRandomIndices(seedNum, stats.easy || 100, 2);
        for (const idx of easyIndices) {
            const word = await getWordByIndex('easy', idx);
            if (word) dailyWords.push(word);
        }

        // Get 2 medium words
        const mediumIndices = getSeededRandomIndices(seedNum + 1, stats.medium || 100, 2);
        for (const idx of mediumIndices) {
            const word = await getWordByIndex('medium', idx);
            if (word) dailyWords.push(word);
        }

        // Get 1 hard word
        const hardIndices = getSeededRandomIndices(seedNum + 2, stats.hard || 100, 1);
        for (const idx of hardIndices) {
            const word = await getWordByIndex('hard', idx);
            if (word) dailyWords.push(word);
        }

        // Cache results
        dailyWordsCache = { date: today, words: dailyWords };

        return dailyWords;
    } catch (error) {
        console.error('Error fetching daily words:', error);
        return [];
    }
}

/**
 * Get word by index from a difficulty collection
 */
async function getWordByIndex(difficulty, index) {
    try {
        const collectionName = `words_${difficulty}`;
        const wordsRef = collection(db, collectionName);

        const q = query(
            wordsRef,
            orderBy('index'),
            startAt(index),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            return {
                word: data.word,
                meaning: data.definitions?.[0] || '',
                difficulty: data.difficulty
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching word at index ${index}:`, error);
        return null;
    }
}

/**
 * Format word data for API response
 */
function formatWordData(data) {
    return {
        word: data.word || '',
        pos: data.pos || '',
        difficulty: data.difficulty || 'Medium',
        definition: data.definitions?.[0] || '',
        examples: data.examples || [],
        synonyms: data.synonyms || []
    };
}

/**
 * Simple hash function for string to number
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Generate seeded random indices
 */
function getSeededRandomIndices(seed, max, count) {
    const indices = [];
    let currentSeed = seed;

    for (let i = 0; i < count; i++) {
        currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
        indices.push(currentSeed % max);
    }

    return indices;
}
