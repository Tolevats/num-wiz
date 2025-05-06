import React from "react";
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
  title: string;
  badges: BadgeInfo[]; // Expecting the array of badge definitions
  unlockedBadges: string[]; // Array of IDs of unlocked badges
  totalBadgesNeeded: number; // Total needed to unlock scientific mode
  justUnlockedBadgeId: string | null; // ID of the badge just unlocked
  isUnlocked?: boolean;
  unlockMessage?: string; 
  className?: string;
}

const PowerUpDashboard: React.FC<PowerUpDashboardProps> = ({ 
  title, 
  badges, 
  unlockedBadges, 
  totalBadgesNeeded, 
  justUnlockedBadgeId, 
  isUnlocked = false, 
  unlockMessage = "Goal Achieved!", 
  className = "" }) => {
    const relevantUnlockedCount = badges.filter(b => unlockedBadges.includes(b.id)).length;
    const progressPercent = totalBadgesNeeded > 0 ? Math.min(100, (relevantUnlockedCount / totalBadgesNeeded) * 100) : 0;
  
   return (
    <div className={`power-up-dashboard bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-6 w-full max-w-md mx-auto ${className}`}>
      <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">{title}</h2>
      {!isUnlocked ? (
          <>
            <div className="progress-bar bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                <div className="progress bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress: ${relevantUnlockedCount} of ${totalBadgesNeeded} badges collected`}></div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">Collect {totalBadgesNeeded} power-ups ({relevantUnlockedCount}/{totalBadgesNeeded})</p>
          </>
      ) : ( <p className="text-lg font-semibold text-green-600 text-center mb-4 animate-pulse">{unlockMessage}</p> )}
      <div className={`badges-grid grid grid-cols-${badges.length > 5 ? 5 : Math.max(3, badges.length)} gap-3 justify-items-center`}>
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const isJustUnlocked = badge.id === justUnlockedBadgeId;
          return (
            <div key={badge.id} className={`badge-item text-center p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center transition-all duration-300 relative group ${ isUnlocked ? 'bg-yellow-300 shadow-lg scale-105' : 'bg-gray-100 opacity-60 shadow-sm' } ${ isJustUnlocked ? 'animate-pulse' : '' }`}>
              <span className="text-2xl mb-1">{isUnlocked ? badge.icon : badge.lockedIcon}</span>
               <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"> {isUnlocked ? badge.name : badge.description} {!isUnlocked && <span className="font-bold"> (Locked)</span>} </div>
            </div> );
        })}
      </div>
    </div> );
};

export default PowerUpDashboard;
