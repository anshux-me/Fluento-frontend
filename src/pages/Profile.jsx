/**
 * Profile Page
 * User profile with stats and badges
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/api';
import XPBar from '../components/XPBar';
import BadgeDisplay from '../components/BadgeDisplay';

export function Profile() {
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
                setError('Failed to load profile');
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
                    <p className="font-mono text-lg">LOADING PROFILE...</p>
                </div>
            </div>
        );
    }

    const stats = profile?.stats || {};

    return (
        <div className="page-container max-w-4xl mx-auto">
            <h1 className="page-header flex items-center gap-4">
                <span>👤</span> Profile
            </h1>

            {/* Error */}
            {error && (
                <div className="card-brutal bg-brutal-red/10 border-brutal-red p-4 mb-8">
                    <p className="font-mono text-brutal-red">{error}</p>
                </div>
            )}

            {/* Profile Card */}
            <div className="card-brutal mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b-4 border-brutal-black">
                    {/* Avatar */}
                    <div className="w-24 h-24 border-4 border-brutal-black bg-brutal-yellow flex items-center justify-center text-4xl font-black">
                        {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-black uppercase">
                            {profile?.display_name || 'User'}
                        </h2>
                        <p className="font-mono text-gray-600">{profile?.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="badge-brutal bg-brutal-purple text-white">
                                Level {stats.level || 1}
                            </span>
                            <span className="badge-brutal bg-brutal-yellow">
                                {stats.total_xp || 0} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* XP Bar */}
                <XPBar currentXP={stats.total_xp || 0} level={stats.level || 1} />
            </div>

            {/* Statistics */}
            <div className="card-brutal mb-8">
                <h3 className="font-black uppercase text-lg mb-6 border-b-4 border-brutal-black pb-2">
                    Statistics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-100 border-2 border-brutal-black">
                        <div className="text-3xl font-black">{stats.streak || 0}</div>
                        <div className="font-mono text-sm uppercase">Day Streak</div>
                    </div>
                    <div className="text-center p-4 bg-gray-100 border-2 border-brutal-black">
                        <div className="text-3xl font-black">{stats.pronunciation_sessions || 0}</div>
                        <div className="font-mono text-sm uppercase">🎤 Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-gray-100 border-2 border-brutal-black">
                        <div className="text-3xl font-black">{stats.spelling_sessions || 0}</div>
                        <div className="font-mono text-sm uppercase">📝 Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-gray-100 border-2 border-brutal-black">
                        <div className="text-3xl font-black">
                            {(stats.pronunciation_sessions || 0) + (stats.spelling_sessions || 0)}
                        </div>
                        <div className="font-mono text-sm uppercase">Total</div>
                    </div>
                </div>
            </div>

            {/* Best Scores */}
            <div className="card-brutal mb-8">
                <h3 className="font-black uppercase text-lg mb-6 border-b-4 border-brutal-black pb-2">
                    Best Scores
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-brutal-blue/10 border-4 border-brutal-blue text-center">
                        <div className="text-3xl sm:text-5xl font-black text-brutal-blue">
                            {stats.best_pronunciation_score || 0}%
                        </div>
                        <div className="font-mono uppercase mt-2">🎤 Pronunciation</div>
                    </div>
                    <div className="p-6 bg-brutal-purple/10 border-4 border-brutal-purple text-center">
                        <div className="text-3xl sm:text-5xl font-black text-brutal-purple">
                            {stats.best_spelling_score || 0}%
                        </div>
                        <div className="font-mono uppercase mt-2">📝 Spelling</div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="card-brutal">
                <h3 className="font-black uppercase text-lg mb-6 border-b-4 border-brutal-black pb-2">
                    Badges ({profile?.badges?.length || 0} earned)
                </h3>
                <BadgeDisplay earnedBadges={profile?.badges || []} showAll={true} />
            </div>
        </div>
    );
}

export default Profile;
