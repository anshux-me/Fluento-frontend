/**
 * XP Bar Component
 * Displays user's XP progress towards next level
 */

export function XPBar({ currentXP, level }) {
    // Calculate XP for current level and next level
    const xpForCurrentLevel = (level - 1) * 500;
    const xpForNextLevel = level * 500;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const percentage = Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-sm">LEVEL {level}</span>
                <span className="font-mono text-sm">
                    {xpProgress} / {xpNeeded} XP
                </span>
            </div>
            <div className="xp-bar-container">
                <div
                    className="xp-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
                <div className="xp-bar-text">
                    {Math.round(percentage)}%
                </div>
            </div>
            <p className="font-mono text-xs text-gray-600">
                {xpNeeded - xpProgress} XP to Level {level + 1}
            </p>
        </div>
    );
}

export default XPBar;
