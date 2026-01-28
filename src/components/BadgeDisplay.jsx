/**
 * Badge Display Component
 * Shows earned and locked badges
 */

// Badge definitions
const BADGE_ICONS = {
    first_steps: '🌟',
    century: '💯',
    streak_week: '🔥',
    streak_month: '🏆',
    level_5: '⭐',
    level_10: '🌟',
    perfect_pronunciation: '🎤',
    perfect_spelling: '📝',
};

// All available badges
const ALL_BADGES = [
    { id: 'first_steps', name: 'First Steps', description: 'Earned 100 XP' },
    { id: 'century', name: 'Century', description: 'Completed 100 sessions' },
    { id: 'streak_week', name: 'Week Warrior', description: '7 day streak' },
    { id: 'streak_month', name: 'Monthly Master', description: '30 day streak' },
    { id: 'level_5', name: 'Rising Star', description: 'Reached level 5' },
    { id: 'level_10', name: 'Expert', description: 'Reached level 10' },
    { id: 'perfect_pronunciation', name: 'Perfect Pronunciation', description: '100% pronunciation score' },
    { id: 'perfect_spelling', name: 'Spelling Bee', description: '100% spelling score' },
];

export function BadgeDisplay({ earnedBadges = [], showAll = false }) {
    const earnedIds = earnedBadges.map(b => b.id);

    const displayBadges = showAll
        ? ALL_BADGES
        : ALL_BADGES.filter(b => earnedIds.includes(b.id));

    if (displayBadges.length === 0 && !showAll) {
        return (
            <div className="card-brutal p-4 text-center">
                <p className="font-mono text-gray-600">No badges earned yet. Keep practicing!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayBadges.map((badge) => {
                const isEarned = earnedIds.includes(badge.id);

                return (
                    <div
                        key={badge.id}
                        className={`achievement-badge ${!isEarned && showAll ? 'locked' : ''}`}
                        title={badge.description}
                    >
                        <span className="text-3xl">
                            {BADGE_ICONS[badge.id] || '🏅'}
                        </span>
                        <span className="font-bold text-xs text-center uppercase">
                            {badge.name}
                        </span>
                        {isEarned && (
                            <span className="text-xs text-brutal-green font-mono">
                                ✓ EARNED
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default BadgeDisplay;
