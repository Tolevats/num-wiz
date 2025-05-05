import React, { useState, useCallback } from "react";
import Calculator from "./components/BasicCalculator";
import PowerUpDashboard from "./components/PowerUpDashboard";
import DidYouKnow from "./components/DidYouKnow";
import "./App.css";

// --- Data Definitions for Badges and Facts ---

interface Badge {
  id: string;
  name: string;
  icon: string;
  lockedIcon: string;
  description: string; // Hint for unlocking
  checkCondition: (
    result: number | string,
    firstOperand?: number | null,
    operator?: string | null,
    secondOperand?: number | null
  ) => boolean;
}

interface Fact {
  id: string;
  text: string;
  triggerCondition: (
    result: number | string,
    firstOperand?: number | null,
    operator?: string | null,
    secondOperand?: number | null
  ) => boolean;
}

// Define the actual badges
const ALL_BADGES: Badge[] = [
  // Basic Badges
  {
    id: "pi",
    name: "Pi Pioneer",
    icon: "π",
    lockedIcon: "❓",
    description: "Calculate something involving Pi (approx 3.14)",
    checkCondition: (result) =>
      typeof result === "number" && Math.abs(result - Math.PI) < 0.01,
  },
  {
    id: "seven",
    name: "Lucky Seven",
    icon: "7✨",
    lockedIcon: "❓",
    description: "Get a result of exactly 7",
    checkCondition: (result) => result === 7,
  },
  {
    id: "zero",
    name: "Zero Hero",
    icon: "0♾️",
    lockedIcon: "❓",
    description: "Get a result of exactly 0",
    checkCondition: (result) => result === 0,
  },
  {
    id: "angle",
    name: "Egyptian Angle",
    icon: "📐",
    lockedIcon: "❓",
    description: "Get a result close to 90",
    checkCondition: (result) =>
      typeof result === "number" && Math.abs(result - 90) < 0.01,
  },
  {
    id: "dozen",
    name: "Double Dozen",
    icon: "⑫",
    lockedIcon: "❓",
    description: "Get a result of 12 or 24",
    checkCondition: (result) => result === 12 || result === 24,
  },
  // Add secret/scientific badges later
];

// Some facts
const ALL_FACTS: Fact[] = [
  {
    id: "fact-zero",
    text: "The concept of zero as a number, allowing for place-value systems, was a major breakthrough in mathematics!",
    triggerCondition: (result) => result === 0,
  },
  {
    id: "fact-seven",
    text: "The number 7 appears frequently in cultures worldwide, often considered lucky or significant in stories and myths.",
    triggerCondition: (result) => result === 7,
  },
  {
    id: "fact-pi",
    text: "Pi (π) is an irrational number, meaning its decimal representation never ends and never repeats!",
    triggerCondition: (result) =>
      typeof result === "number" && Math.abs(result - Math.PI) < 0.01,
  },
  {
    id: "fact-divide-zero",
    text: "Oops! Dividing by zero is undefined in mathematics because it leads to contradictions.",
    triggerCondition: (result) => result === "Error", // Triggered by the error string
  },
  {
    id: "fact-large-number",
    text: "Wow, that's a big number! Calculating large values is essential in fields like astronomy and cryptography.",
    triggerCondition: (result) =>
      typeof result === "number" && result > 1000000, // Example threshold
  },
];

function App() {
  // --- State for Num Wiz Features ---
  // State for badges:
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  // State for facts:
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  // To track recently unlocked badge for animation/notification:
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<string | null>(
    null
  );

  // --- Callback Functions ---
  // Function to unlock a badge
  const handleUnlockBadge = useCallback(
    (badgeId: string) => {
      // Check if already unlocked to prevent unnecessary state updates
      if (!unlockedBadges.includes(badgeId)) {
        console.log(`Unlocking badge: ${badgeId}`);
        setUnlockedBadges((prevBadges) => [...prevBadges, badgeId]);
        setJustUnlockedBadge(badgeId); // Set the just unlocked badge ID
        // Clear the 'just unlocked' status after a short delay (for animation)
        setTimeout(() => setJustUnlockedBadge(null), 1500);
      }
    },
    [unlockedBadges]
  ); // Dependency array includes unlockedBadges

  // Function to show a fact
  const handleShowFact = useCallback((factText: string) => {
    console.log(`Showing fact: ${factText.substring(0, 30)}...`);
    setCurrentFact(factText);
  }, []); // No dependencies needed if it just sets state directly

  /**
   * This function is passed to the Calculator component.
   * It's called when a calculation is completed (equals pressed).
   * It checks the result against badge and fact conditions.
   */
  const handleCalculationComplete = useCallback(
    (
      result: number | string,
      firstOperand?: number | null,
      operator?: string | null,
      secondOperand?: number | null
    ) => {
      console.log(`App: Calculation complete. Result: ${result}`);

      // Don't show facts or check badges if there was an error (handled separately)
      if (result === "Error") {
        const errorFact = ALL_FACTS.find(f => f.triggerCondition(result));
        if (errorFact) {
          handleShowFact(errorFact.text);
        }
        return;
      }

      /* let factShown = false; */ // Flag to prevent showing multiple facts for one calculation

      // Check for badge unlocks
      ALL_BADGES.forEach((badge) => {
        // Only check badges that aren't already unlocked
        if (!unlockedBadges.includes(badge.id)) {
          try {
            if (
              badge.checkCondition(
                result,
                firstOperand,
                operator,
                secondOperand
              )
            ) {
              handleUnlockBadge(badge.id);
            }
          } catch (error) {
            console.error(
              `Error checking condition for badge ${badge.id}:`,
              error
            );
          }
        }
      });

      // Check for more facts to display (prioritize specific facts over generic ones)
      // Shuffle facts slightly or pick randomly if multiple match? For now, first match.
      const triggeredFact = ALL_FACTS.find(fact => {
        // Don't re-trigger the error fact here
        if (fact.id === "fact-divide-zero") return false;
        try {
          return fact.triggerCondition(
            result,
            firstOperand,
            operator,
            secondOperand
          );
        } catch (error) {
          console.error(
            `Error checking trigger condition for fact ${fact.id}:`,
            error
          );
          return false;
        }
      });

      if (triggeredFact) {
        handleShowFact(triggeredFact.text);
        /* factShown = true; */
      }
    },
    [unlockedBadges, handleUnlockBadge, handleShowFact]
  ); // Dependencies for useCallback

  // --- Render ---
  return (
    // Main container with flex column layout, centering items
    <div className="App container mx-auto p-4 flex flex-col items-center min-h-screen">
      {/* Create and add Header Section */}
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Num Wiz!</h1>

      {/* Power-Up Dashboard */}
      <PowerUpDashboard
        badges={ALL_BADGES.filter((b) =>
          ["pi", "seven", "zero", "angle", "dozen"].includes(b.id)
        )} // Basic badges for now
        unlockedBadges={unlockedBadges}
        totalBasicBadges={5}
        justUnlockedBadgeId={justUnlockedBadge} // Pass down the ID of the recently unlocked badge
      />

      {/* Main Calculator Component */}
      <Calculator onCalculationComplete={handleCalculationComplete} />

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
