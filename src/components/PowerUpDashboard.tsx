import React/* , { useEffect, useState } */ from "react";
import "./PowerUpDashboard.css";

// Define the structure for badge data passed as props
interface BadgeInfo {
  id: string;
  name: string;
  icon: string;
  lockedIcon: string;
  description: string;
}

// Define the props the component will receive
interface PowerUpDashboardProps {
  badges: BadgeInfo[]; // Expecting the array of badge definitions
  unlockedBadges: string[]; // Array of IDs of unlocked badges
  totalBasicBadges: number; // Total needed to unlock scientific mode
  justUnlockedBadgeId: string | null; // ID of the badge just unlocked
}

const PowerUpDashboard: React.FC<PowerUpDashboardProps> = ({
  badges, // Use the passed badges data
  unlockedBadges,
  totalBasicBadges,
  justUnlockedBadgeId,
}) => {
  const unlockedCount = unlockedBadges.length;
  const progressPercent = Math.min(
    100,
    (unlockedCount / totalBasicBadges) * 100
  );

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
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const isJustUnlocked = badge.id === justUnlockedBadgeId; // Check if this badge was just unlocked

          return (
            <div
              key={badge.id}
              className={`badge-item text-center p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center transition-all duration-300 relative group ${ // Added relative and group for tooltip
                isUnlocked
                  ? "bg-yellow-300 shadow-lg scale-105" // Style for unlocked badges
                  : "bg-gray-100 opacity-60 shadow-sm" // Style for locked badges
                } ${
                  isJustUnlocked ? 'animate-pulse' : '' // Add pulse animation if just unlocked
              }`}
              title={isUnlocked ? badge.name : `Locked: ${badge.description}`} // Tooltip
            >
              <span className="text-2xl mb-1">
                {isUnlocked ? badge.icon : badge.lockedIcon}
              </span>
              {/* Tooltip shown on hover */}
              <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                 {isUnlocked ? badge.name : badge.description}
                 {!isUnlocked && <span className="font-bold"> (Locked)</span>}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PowerUpDashboard;
