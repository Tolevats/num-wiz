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
      {!isUnlocked ? (
          <>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center text-spans-container">
                <div className="text-yellow-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-600">Collect <strong>{totalBadgesNeeded}</strong> Power-Ups: <strong>{relevantUnlockedCount}</strong>/{totalBadgesNeeded}</span>
                <span className="text-gray-700"><strong>Next: </strong>{title}</span>
              </div>
            </div>
            <div className="progress-bar bg-gray-300 rounded-full h-4 mb-3 overflow-hidden">
                  <div className="progress bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} role="progressbar" aria-valuenow={Number(progressPercent)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress: ${relevantUnlockedCount} of ${totalBadgesNeeded} badges collected`}></div>
                </div>
          </>
      ) : ( <p className="text-lg font-semibold text-green-600 text-center mb-4 animate-pulse">{unlockMessage}</p> )}
      <div className="badges-grid grid grid-cols-${badges.length > 5 ? 5 : Math.max(3, badges.length)}`}">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const isJustUnlocked = badge.id === justUnlockedBadgeId;
          return (
            <div key={badge.id} className={`badge-item text-center flex flex-col items-center justify-center transition-all duration-300 relative group ${ isUnlocked ? 'bg-yellow-300 shadow-lg scale-105' : 'bg-gray-100 opacity-60 shadow-sm' } ${ isJustUnlocked ? 'animate-pulse' : '' }`}>
              <span className="text-2xl mb-1">{isUnlocked ? badge.icon : badge.lockedIcon}</span>
               <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"> {isUnlocked ? badge.name : badge.description} {!isUnlocked && <span className="locked">(🔒)</span>} </div>
            </div> );
        })}
      </div>
    </div> );
};

export default PowerUpDashboard;
