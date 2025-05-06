import React, { useState, useCallback, useEffect } from "react";
import BasicCalculator from "./components/BasicCalculator";
import ScientificCalculator from "./components/ScientificCalculator";
import PowerUpDashboard from "./components/PowerUpDashboard";
import DidYouKnow from "./components/DidYouKnow";
import Header from "./components/Header";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import "./App.css";
import { OperationType, CalculationOperator } from "./hooks/useCalculatorLogic";

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
    operator?: CalculationOperator | null,
    secondOperand?: number | null,
    operationType?: OperationType | null
  ) => boolean;
  type: "basic" | "scientific" | "secret";
}

interface Fact {
  id: string;
  text: string;
  triggerCondition: (
    result: number | string,
    firstOperand?: number | null,
    operator?: CalculationOperator | null,
    secondOperand?: number | null,
    operationType?: OperationType | null
  ) => boolean;
}

// --- Constants ---
const TOTAL_BASIC_BADGES_NEEDED = 5;

// --- Badge Definitions ---
const ALL_BADGES: Badge[] = [
  // Basic Badges
  { id: "pi", name: "Pi Pioneer", icon: "π", lockedIcon: "❓", description: "Calculate Pi", type: "basic",
    checkCondition: (result) => typeof result === "number" && Math.abs(result - Math.PI) < 0.01 },
  { id: "seven", name: "Lucky Seven", icon: "7✨", lockedIcon: "❓", description: "Get a result of exactly 7", type: "basic",
    checkCondition: (result) => result === 7 },
  { id: "zero", name: "Zero Hero", icon: "0♾️", lockedIcon: "❓", description: "Get a result of exactly 0", type: "basic",
    checkCondition: (result) => result === 0 },
  { id: "angle", name: "Egyptian Angle", icon: "📐", lockedIcon: "❓", description: "Get a result close to 90", type: "basic",
    checkCondition: (result) => typeof result === "number" && Math.abs(result - 90) < 0.01 },
  { id: "dozen", name: "Double Dozen",
    icon: "⑫", lockedIcon: "❓", description: "Get a result of 12 or 24", type: "basic", 
    checkCondition: (result) => result === 12 || result === 24 },
  // Scientific Badges
  { id: "exp", name: "Exponential Explorer", icon: "eˣ", lockedIcon: "🔬", description: "Use the e^x function", type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'exp' }, // Check if 'exp' was the unary operator
  { id: "log", name: "Logarithm Legend", icon: "ln", lockedIcon: "🔬", description: "Use the ln(x) function", type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'ln' }, // Check if 'ln' was the unary operator
  { id: "sin", name: "Sine Wave Surfer", icon: "sin", lockedIcon: "🔬", description: "Use the sin(x) function", type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'sin' }, // Check if 'sin' was the unary operator
  { id: 'sqrt', name: 'Square Rooter', icon: '√', lockedIcon: '🔬', description: 'Use the √ function', type: 'scientific',
    checkCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'sqrt' }, // Check if 'sqrt' was the unary operator
  { id: 'pow', name: 'Power Player', icon: 'x²', lockedIcon: '🔬', description: 'Use the x² function', type: 'scientific',
    checkCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'pow' }, // Check if 'pow' was the unary operator
  
  // Secret Badges (add conditions later)
  // { id: 'fibonacci', name: 'Fibonacci Flair', icon: '🌀', lockedIcon: '🔒', description: 'Generate Fibonacci sequence', type: 'secret', checkCondition: () => false },
  // { id: 'palindrome', name: 'Palindrome Power', icon: '↔️', lockedIcon: '🔒', description: 'Result is a palindrome', type: 'secret', checkCondition: () => false },
];

// --- Fact Definitions ---
const ALL_FACTS: Fact[] = [
  { id: "fact-zero", text: "The concept of zero as a number, allowing for place-value systems, was a major breakthrough in mathematics!",
    triggerCondition: (result) => result === 0 },
  { id: "fact-seven", text: "The number 7 appears frequently in cultures worldwide, often considered lucky or significant in stories and myths.",
    triggerCondition: (result) => result === 7 },
  { id: "fact-pi", text: "Pi (π) is an irrational number, meaning its decimal representation never ends and never repeats!",
    triggerCondition: (result) => typeof result === "number" && Math.abs(result - Math.PI) < 0.01 },
  { id: "fact-divide-zero", text: "Oops! Dividing by zero is undefined in mathematics because it leads to contradictions.",
    triggerCondition: (result) => result === "Error" }, // Triggered by the error string
  { id: "fact-large-number", text: "Wow, that's a big number! Calculating large values is essential in fields like astronomy and cryptography.",
    triggerCondition: (result) => typeof result === "number" && result > 1000000 },
  { id: "fact-negative", text: "Negative numbers are essential in mathematics, representing values less than zero, like debts or temperatures below freezing.",
    triggerCondition: (result) => typeof result === "number" && result < 0 },
  // Add facts for scientific functions?
  { id: 'fact-sin', text: 'Sine waves model many natural phenomena, like sound waves and light waves!', triggerCondition: (_r, _f, op, _s, type) => type === 'unary' && op === 'sin'},
  { id: 'fact-log', text: 'Logarithms help measure things that vary widely, like earthquake intensity (Richter scale) and sound loudness (decibels)!', triggerCondition: (_r, _f, op, _s, type) => type === 'unary' && (op === 'ln' || op === 'log')},
];

function App() {
  // --- State for Num Wiz Features ---
  // State for badges:
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  // State for facts:
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  // To track recently unlocked badge for animation/notification:
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<string | null>(null);
  // State to track if scientific mode is unlocked
  const [isScientificModeUnlocked, setIsScientificModeUnlocked] = useState<boolean>(false);
  // State to track if scientific mode is *active* (user might toggle it later)
  const isScientificModeActive = isScientificModeUnlocked;

  // --- Unlock Scientific Mode Logic ---
  useEffect(() => {
    // Count how many *basic* badges are unlocked
    const unlockedBasicCount = ALL_BADGES.filter((badge) => badge.type === "basic" && unlockedBadges.includes(badge.id)).length;

    // Check if the required number of basic badges are unlocked
    if ( unlockedBasicCount >= TOTAL_BASIC_BADGES_NEEDED && !isScientificModeUnlocked) {
      console.log("--- Scientific Mode Unlocked! ---");
      setIsScientificModeUnlocked(true);
      // Optionally show a special fact or notification
      // handleShowFact("Congratulations! You've unlocked Scientific Mode with advanced functions!");
    }
  }, [unlockedBadges, isScientificModeUnlocked]); // Re-run when badges change or mode unlocks

  // --- Callback Functions ---
  // Function to unlock a badge
  const handleUnlockBadge = useCallback((badgeId: string) => {
      // Check if already unlocked to prevent unnecessary state updates
      if (!unlockedBadges.includes(badgeId)) {
        console.log(`Unlocking badge: ${badgeId}`);
        setUnlockedBadges((prevBadges) => [...prevBadges, badgeId]);
        setJustUnlockedBadge(badgeId); // Set the just unlocked badge ID
        // Clear the 'just unlocked' status after a short delay (for animation)
        setTimeout(() => setJustUnlockedBadge(null), 1500);
      }
    }, [unlockedBadges]); // Dependency array includes unlockedBadges

  // Function to show a fact
  const handleShowFact = useCallback((factText: string) => {
    console.log(`Showing fact: ${factText.substring(0, 30)}...`);
    setCurrentFact(factText);
  }, []); // No dependencies needed if it just sets state directly

  // Updated signature to accept operationType
  const handleCalculationComplete = useCallback((
      result: number | string,
      firstOperand?: number | null,
      operator?: CalculationOperator | null,
      secondOperand?: number | null,
      operationType?: OperationType | null // Receive type from hook
    ) => {
      console.log(`App: Calculation complete. Result: ${result}, Operator: ${operator}, Type: ${operationType}`)

      // Error handled separately
      if (result === "Error") {
        const errorFact = ALL_FACTS.find((f) => f.triggerCondition(result));
        if (errorFact) handleShowFact(errorFact.text);
        return;
      }

      // Check for badge unlocks
      ALL_BADGES.forEach((badge) => {
        // Only check badges that aren't already unlocked
        if (!unlockedBadges.includes(badge.id)) {
          try {
            if (badge.checkCondition(result, firstOperand, operator, secondOperand, operationType)) {
              handleUnlockBadge(badge.id);
            }
          } catch (error) { console.error(`Error checking condition for badge ${badge.id}:`, error ); }
        }
      });

      // Check facts
      // Shuffle facts slightly or pick randomly if multiple match? For now, first match.
      const triggeredFact = ALL_FACTS.find((fact) => {
        // Don't re-trigger the error fact here
        if (fact.id === "fact-divide-zero") return false;
        try {
          return fact.triggerCondition(result, firstOperand, operator, secondOperand, operationType);
        } catch (error) { console.error(`Error checking trigger condition for fact ${fact.id}:`, error ); return false; }
      });

      if (triggeredFact) {
        handleShowFact(triggeredFact.text);
      }
    }, [unlockedBadges, handleUnlockBadge, handleShowFact]); // Dependencies for useCallback

  // --- Render ---
  const basicBadges = ALL_BADGES.filter(b => b.type === 'basic');
  const scientificBadges = ALL_BADGES.filter(b => b.type === 'scientific');

  return (
    // Main container with flex column layout, centering items
    <div className="App container">
      <Header />
      <CTA />
      <PowerUpDashboard
        title="Unlock Scientific Mode!"
        badges={basicBadges}
        unlockedBadges={unlockedBadges}
        totalBadgesNeeded={TOTAL_BASIC_BADGES_NEEDED}
        justUnlockedBadgeId={justUnlockedBadge}
        isUnlocked={isScientificModeUnlocked} // Pass unlock status
        unlockMessage="Scientific Mode Unlocked!"
      />

      {/* Scientific Badge Dashboard (conditionally rendered) */}
      {isScientificModeUnlocked && (
        <PowerUpDashboard
          title="Scientific Badges"
          badges={scientificBadges}
          unlockedBadges={unlockedBadges}
          totalBadgesNeeded={scientificBadges.length} // Goal is to unlock all sci badges
          justUnlockedBadgeId={justUnlockedBadge}
          isUnlocked={scientificBadges.every(b => unlockedBadges.includes(b.id))} // Check if all sci badges unlocked
          unlockMessage="All Scientific Badges Found!"
          className="mt-4" // Add margin top
        />
      )}

      <h2 className="text-2xl font-bold mx-6">Keep the Calculations Coming!</h2>
      
      {/* --- Conditionally render Basic or Scientific Calculator --- */}
      <div className="calculator-wrapper mt-6">
            {isScientificModeActive ? (
                <ScientificCalculator onCalculationComplete={handleCalculationComplete} />
            ) : (
                <BasicCalculator onCalculationComplete={handleCalculationComplete} />
            )}
      </div>

      <DidYouKnow
        fact={currentFact}
        onDismiss={() => setCurrentFact(null)} // Allow dismissing the fact
      />

      <Footer />
    </div>
  );
}

export default App;
