import React from "react";
import "./PowerUpDashboard.css";

// Define the props the component will receive
interface PowerUpDashboardProps {
  unlockedBadges: string[]; // Array of IDs of unlocked badges
  totalBasicBadges: number; // Total needed to unlock scientific mode
  // We'll add more props later for specific badge details
}

const PowerUpDashboard: React.FC<PowerUpDashboardProps> = ({
  unlockedBadges,
  totalBasicBadges,
}) => {
  const unlockedCount = unlockedBadges.length;
  const progressPercent = Math.min(
    100,
    (unlockedCount / totalBasicBadges) * 100
  );

  // Placeholder badge data - replace with actual badge definitions later
  const basicBadges = [
    { id: "pi", name: "Pi Pioneer", icon: "π", lockedIcon: "❓" },
    { id: "seven", name: "Lucky Seven", icon: "7✨", lockedIcon: "❓" },
    { id: "zero", name: "Zero Hero", icon: "0♾️", lockedIcon: "❓" },
    { id: "angle", name: "Egyptian Angle", icon: "📐", lockedIcon: "❓" },
    { id: "dozen", name: "Double Dozen", icon: "⑫", lockedIcon: "❓" },
    // Add secret badges later
  ];

  return (
    <div className="power-up-dashboard bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">
        Unlock Scientific Mode!
      </h2>

      {/* Progress Bar */}
      <div className="progress-bar bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className="progress bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${unlockedCount} of ${totalBasicBadges} badges collected`}
        ></div>
      </div>
      <p className="text-sm text-gray-600 text-center mb-4">
        Collect {totalBasicBadges} power-ups ({unlockedCount}/{totalBasicBadges}
        )
      </p>

      {/* Badge Display Area */}
      <div className="badges-grid grid grid-cols-3 sm:grid-cols-5 gap-3 justify-items-center">
        {basicBadges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`badge-item text-center p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center transition-all duration-300 ${
                isUnlocked
                  ? "bg-yellow-300 shadow-inner scale-105" // Style for unlocked badges
                  : "bg-gray-100 opacity-60" // Style for locked badges
              }`}
              title={isUnlocked ? badge.name : `Locked: ${badge.name}`} // Tooltip
            >
              <span className="text-2xl mb-1">
                {isUnlocked ? badge.icon : badge.lockedIcon}
              </span>
              {/* <span className="text-xs font-medium truncate w-full">{badge.name}</span> */}
            </div>
          );
        })}
      </div>

      {/* Tooltip Hint (Example - could be more sophisticated) */}
      <p className="text-xs text-gray-500 text-center mt-3 italic">
        Hover over locked badges for hints (coming soon)!
      </p>
    </div>
  );
};

export default PowerUpDashboard;
