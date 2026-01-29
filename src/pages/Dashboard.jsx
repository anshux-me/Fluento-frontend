/**
 * Dashboard Page
 * Main landing page with gamification stats and practice options
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/api';
import XPBar from '../components/XPBar';
import BadgeDisplay from '../components/BadgeDisplay';
import WordOfTheDay from '../components/WordOfTheDay';

export function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            try {
                const data = await getUserProfile(user.uid);
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="card-brutal p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="waveform-bar"
                                style={{ animationDelay: `${i * 2}s` }}
                            />
                        ))}
                    </div>
                    <p className="font-mono text-lg">LOADING...</p>
                </div>
            </div>
        );
    }

    const stats = profile?.stats || {
        total_xp: 0,
        level: 1,
        streak: 0,
        pronunciation_sessions: 0,
        spelling_sessions: 0,
    };

    return (
        <div className="page-container max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="page-header">
                    Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}!
                </h1>
            </div>

            {/* Word of the Day - TOP of dashboard */}
            <WordOfTheDay />

            {/* Error Message */}
            {error && (
                <div className="card-brutal bg-brutal-red/10 border-brutal-red p-4 mb-8">
                    <p className="font-mono text-brutal-red">{error}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Level Card */}
                <div className="card-brutal text-center">
                    <div className="level-badge mx-auto mb-4">
                        {stats.level}
                    </div>
                    <h3 className="font-black uppercase text-lg">Level</h3>
                    <p className="font-mono text-sm text-gray-600">Keep practicing!</p>
                </div>

                {/* Streak Card */}
                <div className="card-brutal text-center">
                    <div className="streak-counter justify-center mb-4">
                        <span className="streak-fire">🔥</span>
                        <span className="text-4xl font-black">{stats.streak}</span>
                    </div>
                    <h3 className="font-black uppercase text-lg">Day Streak</h3>
                    <p className="font-mono text-sm text-gray-600">
                        {stats.streak > 0 ? "You're on fire!" : 'Start your streak!'}
                    </p>
                </div>

                {/* Sessions Card */}
                <div className="card-brutal text-center">
                    <div className="text-4xl font-black mb-4">
                        {stats.pronunciation_sessions + stats.spelling_sessions}
                    </div>
                    <h3 className="font-black uppercase text-lg">Total Sessions</h3>
                    <p className="font-mono text-sm text-gray-600">
                        🎤 {stats.pronunciation_sessions} | 📝 {stats.spelling_sessions}
                    </p>
                </div>
            </div>

            {/* XP Progress */}
            <div className="card-brutal mb-8">
                <h3 className="font-black uppercase text-lg mb-4 border-b-4 border-brutal-black pb-2">
                    Experience Progress
                </h3>
                <XPBar currentXP={stats.total_xp} level={stats.level} />
            </div>

            {/* Practice Cards */}
            <h2 className="font-black text-2xl uppercase mb-4 flex items-center gap-2">
                <span>🎯</span> Start Practicing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pronunciation Card */}
                <Link to="/pronunciation" className="card-brutal-hover group">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">🎤</span>
                        <div>
                            <h3 className="font-black text-xl uppercase">Pronunciation</h3>
                            <p className="font-mono text-sm text-gray-600">
                                Practice speaking words correctly
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="badge-brutal bg-brutal-blue text-white">
                            Voice Input
                        </span>
                        <span className="font-bold text-brutal-blue group-hover:translate-x-1 transition-transform">
                            START →
                        </span>
                    </div>
                </Link>

                {/* Spelling Card */}
                <Link to="/spelling" className="card-brutal-hover group">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">📝</span>
                        <div>
                            <h3 className="font-black text-xl uppercase">Spelling</h3>
                            <p className="font-mono text-sm text-gray-600">
                                Listen and spell the words
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="badge-brutal bg-brutal-purple text-white">
                            Audio Input
                        </span>
                        <span className="font-bold text-brutal-purple group-hover:translate-x-1 transition-transform">
                            START →
                        </span>
                    </div>
                </Link>
            </div>

            {/* Recent Badges */}
            <div className="card-brutal">
                <div className="flex items-center justify-between mb-4 border-b-4 border-brutal-black pb-2">
                    <h3 className="font-black uppercase text-lg">Badges</h3>
                    <Link
                        to="/profile"
                        className="font-mono text-sm text-brutal-blue hover:underline"
                    >
                        VIEW ALL →
                    </Link>
                </div>
                <BadgeDisplay earnedBadges={profile?.badges || []} showAll={true} />
            </div>
        </div>
    );
}

export default Dashboard;
