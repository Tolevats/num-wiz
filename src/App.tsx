import React from 'react';
import Calculator from "./components/BasicCalculator";
import PowerUpDashboard from "./components/PowerUpDashboard";
import DidYouKnow from "./components/DidYouKnow";
import "./App.css";

function App() {
  // --- State for Num Wiz Features (will be expanded later) ---
  // State for badges (WIP)
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);
  // State for facts (WIP)
  const [currentFact, setCurrentFact] = React.useState<string | null>(null);

  // Function to simulate unlocking a badge (future implementation)
  /* const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges([...unlockedBadges, badgeId]);
    }
  }; */

  // Function to simulate showing a fact (future implementation)
/*   const handleShowFact = (fact: string) => {
    setCurrentFact(fact);
  }; */

  // --- Render ---
  return (
    // Main container with flex column layout, centering items
    <div className="App container mx-auto p-4 flex flex-col items-center min-h-screen">
      {/* Create and add Header Section */}
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Num Wiz!</h1>

      {/* Power-Up Dashboard */}
      <PowerUpDashboard
        unlockedBadges={unlockedBadges}
        totalBasicBadges={5}
      />

      {/* Main Calculator Component */}
      <Calculator />

      {/* "Did You Know?" Section */}
      <DidYouKnow
        fact={currentFact}
        onDismiss={() => setCurrentFact(null)} // Allow dismissing the fact
      />

      {/* Create and add Footer component later */}
    </div>
  );
}

export default App;
