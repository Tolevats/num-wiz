import React, { useState, useCallback, useEffect } from "react";
import BasicCalculator from "./components/BasicCalculator";
import ScientificCalculator from "./components/ScientificCalculator";
import PowerUpDashboard from "./components/PowerUpDashboard";
import DidYouKnow from "./components/DidYouKnow";
import Header from "./components/Header";
import AnimatedBackground from "./components/AnimatedBackground";
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
  {
    id: "pi",
    name: "Pi Pioneer",
    icon: "π",
    lockedIcon: "❓",
    description: "Get a result ≈ Pi",
    type: "basic",
    checkCondition: (result) =>
      typeof result === "number" && Math.abs(result - Math.PI) < 0.01,
  },
  {
    id: "seven",
    name: "Lucky Seven",
    icon: "🍀7",
    lockedIcon: "❓",
    description: "Get a result of 7",
    type: "basic",
    checkCondition: (result) => result === 7,
  },
  {
    id: "zero",
    name: "Zero Hero",
    icon: "0♾️",
    lockedIcon: "❓",
    description: "Get a result of 0",
    type: "basic",
    checkCondition: (result) => result === 0,
  },
  {
    id: "angle",
    name: "Egyptian Angle",
    icon: "📐",
    lockedIcon: "❓",
    description: "Get a result of 90",
    type: "basic",
    checkCondition: (result) =>
      typeof result === "number" && Math.abs(result - 90) < 0.01,
  },
  {
    id: "dozen",
    name: "Double Dozen",
    icon: "⑫",
    lockedIcon: "❓",
    description: "Get a result of 12 or 24",
    type: "basic",
    checkCondition: (result) => result === 12 || result === 24,
  },
  // Scientific Badges
  {
    id: "exp",
    name: "Exponential Explorer",
    icon: "eˣ",
    lockedIcon: "❓",
    description: "Use the e^x function",
    type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === "unary" && op === "exp",
  }, // Check if "exp" was the unary operator
  {
    id: "log",
    name: "Logarithm Legend",
    icon: "ln",
    lockedIcon: "❓",
    description: "Use the ln(x) function",
    type: "scientific",
    checkCondition: (_r, _f, op, _s, type) =>
      type === "unary" && (op === "ln" || op === "log"),
  }, // Check if "ln" was the unary operator
  {
    id: "sin",
    name: "Sine Wave Surfer",
    icon: "sin",
    lockedIcon: "❓",
    description: "Use the sin(x) function",
    type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === "unary" && op === "sin",
  }, // Check if "sin" was the unary operator
  {
    id: "sqrt",
    name: "Square Rooter",
    icon: "√",
    lockedIcon: "❓",
    description: "Use the √ function",
    type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === "unary" && op === "sqrt",
  }, // Check if "sqrt" was the unary operator
  {
    id: "pow",
    name: "Power Player",
    icon: "x²",
    lockedIcon: "❓",
    description: "Use the x² function",
    type: "scientific",
    checkCondition: (_r, _f, op, _s, type) => type === "unary" && op === "pow",
  }, // Check if "pow" was the unary operator

  // Secret Badges (FUTURE implementation)
  //{ id: "fibonacci", name: "Fibonacci Flair", icon: "🌀", lockedIcon: "🔒", description: "Generate Fibonacci sequence", type: "secret", checkCondition: () => false },
  //{ id: "palindrome", name: "Palindrome Power", icon: "↔️", lockedIcon: "🔒", description: "Result is a palindrome", type: "secret", checkCondition: () => false },
  //{ id: "fact_badge", name: "Factorial Fanatic", icon: "!", lockedIcon: "🔒", description: "Calculate a factorial", type: "secret", checkCondition: (_r, _f, op, _s, type) => type === "unary" && op === "fact"},
];

// --- Fact Definitions ---
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
    triggerCondition: (_r, _f, op, _s, type) =>
      type === "constant" && op === "constant_input" && _r === Math.PI,
  },
  {
    id: "fact-divide-zero",
    text: "Oops! Dividing by zero is undefined in mathematics because it leads to contradictions.",
    triggerCondition: (result) =>
      typeof result === "string" && result.includes("Div by 0"),
  }, // Triggered by the error string
  {
    id: "fact-large-number",
    text: "Wow, that's a big number! Calculating large values is essential in fields like astronomy and cryptography.",
    triggerCondition: (result) =>
      typeof result === "number" && result > 1000000,
  },
  {
    id: "fact-negative",
    text: "Negative numbers are essential in mathematics, representing values less than zero, like debts or temperatures below freezing.",
    triggerCondition: (result) => typeof result === "number" && result < 0,
  },
  // Facts for scientific functions
  {
    id: "fact-sin",
    text: "Sine waves model many natural phenomena, like sound waves and light waves!",
    triggerCondition: (_r, _f, op, _s, type) =>
      type === "unary" && op === "sin",
  },
  {
    id: "fact-log",
    text: "Logarithms help measure things that vary widely, like earthquake intensity (Richter scale) and sound loudness (decibels)!",
    triggerCondition: (_r, _f, op, _s, type) =>
      type === "unary" && (op === "ln" || op === "log"),
  },
  {
    id: "fact-factorial",
    text: "Factorials (x!) are used in probability and combinatorics to count permutations.",
    triggerCondition: (_r, _f, op, _s, type) =>
      type === "unary" && op === "fact",
  },
  {
    id: "fact-error-domain",
    text: "Some functions have limits! This operation is outside its valid input range.",
    triggerCondition: (r) => typeof r === "string" && r.includes("Domain"),
  },
  {
    id: "fact-unlock-sci-mode-hint",
    text: `Collect all ${TOTAL_BASIC_BADGES_NEEDED} basic badges to unlock Scientific Mode!`,
    triggerCondition: () => false,
  }, // Special fact, not triggered by calc
];

function App() {
  // --- State for Num Wiz Features ---
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]); // State for badges
  const [currentFact, setCurrentFact] = useState<string | null>(null); // State for facts
  const [lastShownFactId, setLastShownFactId] = useState<string | null>(null); // Track last shown fact
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<string | null>(null); // To track recently unlocked badge for animation/notification
  const [isScientificModeUnlocked, setIsScientificModeUnlocked] = useState<boolean>(false); // State to track if scientific mode is unlocked
  const [isScientificModeActive, setIsScientificModeActive] = useState<boolean>(false); // State to track if scientific mode is *active*

  // Function to show a fact
  const handleShowFact = useCallback(
    (fact: Fact | string) => {
      const factText = typeof fact === "string" ? fact : fact.text;
      const factId =
        typeof fact === "string" ? `custom-${factText.slice(0, 10)}` : fact.id;

      // Prevent showing the same fact consecutively
      if (factId === lastShownFactId) {
        console.log("Attempted to show the same fact consecutively. Skipping.");
        return;
      }
      setCurrentFact(factText);
      setLastShownFactId(factId);
    },
    [lastShownFactId]
  );

  // Function to toggle scientific mode or show a hint
  const toggleScientificMode = useCallback(() => {
    if (isScientificModeUnlocked) {
      setIsScientificModeActive((prev) => !prev); // Toggle active state
    } else {
      // Show hint if trying to activate before unlocking
      const hintFact = ALL_FACTS.find(
        (f) => f.id === "fact-unlock-sci-mode-hint"
      );
      if (hintFact) {
        handleShowFact(hintFact);
      }
    }
  }, [isScientificModeUnlocked, handleShowFact]);

  // --- Unlock Scientific Mode Logic ---
  useEffect(() => {
    const unlockedBasicCount = ALL_BADGES.filter(
      (b) => b.type === "basic" && unlockedBadges.includes(b.id)
    ).length;
    if (
      unlockedBasicCount >= TOTAL_BASIC_BADGES_NEEDED &&
      !isScientificModeUnlocked
    ) {
      setIsScientificModeUnlocked(true);
      handleShowFact(
        "Congratulations! You've unlocked Scientific Mode. Click the 'Sci' button to activate it!"
      );
    }
  }, [unlockedBadges, isScientificModeUnlocked, handleShowFact]); // Re-run when badges change or mode unlocks

  // --- Callback Functions ---
  // Function to unlock a badge
  const handleUnlockBadge = useCallback(
    (badgeId: string) => {
      if (!unlockedBadges.includes(badgeId)) {
        setUnlockedBadges((prevBadges) => [...prevBadges, badgeId]);
        setJustUnlockedBadge(badgeId); // Set the just unlocked badge ID
        setTimeout(() => setJustUnlockedBadge(null), 1500);
      }
    },
    [unlockedBadges]
  ); // Dependency array includes unlockedBadges

  const handleCalculationComplete = useCallback(
    (
      result: number | string,
      firstOperand?: number | null,
      operator?: CalculationOperator | null,
      secondOperand?: number | null,
      operationType?: OperationType | null // Receive type from hook
    ) => {
      // Do not trigger facts/badges on 'clear' operation
      if (operationType === "clear") return;

      if (typeof result === "string" && result.startsWith("Error")) {
        const errorFact = ALL_FACTS.find((f) =>
          f.triggerCondition(
            result,
            firstOperand,
            operator,
            secondOperand,
            operationType
          )
        );
        if (errorFact) handleShowFact(errorFact);
        else handleShowFact(result); // Show the error message itself if no specific fact
        return;
      }
      // Check for badge unlocks:
      ALL_BADGES.forEach((badge) => {
        if (!unlockedBadges.includes(badge.id)) {
          // Only check badges that aren't already unlocked
          if (
            badge.checkCondition(
              result,
              firstOperand,
              operator,
              secondOperand,
              operationType
            )
          ) {
            handleUnlockBadge(badge.id);
          }
        }
      });
      // Displaying facts
      const triggeredFact = ALL_FACTS.find((fact) => {
        if (typeof result === "string" && result.startsWith("Error:"))
          return false;
        return fact.triggerCondition(
          result,
          firstOperand,
          operator,
          secondOperand,
          operationType
        );
      });

      if (triggeredFact) {
        handleShowFact(triggeredFact);
      }
    },
    [unlockedBadges, handleUnlockBadge, handleShowFact]
  ); // Dependencies for useCallback

  // --- Render ---
  const basicBadges = ALL_BADGES.filter((b) => b.type === "basic");
  const scientificBadges = ALL_BADGES.filter((b) => b.type === "scientific");

  return (
    <div className="App min-h-screen flex flex-col items-center ">
      <Header />
      <AnimatedBackground />
      <section className="header w-full text-center my-4 sm:my-6">
        <h2 className="tagline text-4xl sm:text-5xl font-bold bg-clip-text">
          Get your numbers right, the <span className="fun">fun way!</span>
        </h2>
      </section>
      <main className="w-full max-w-screen-xl flex flex-col md:flex-row gap-4 sm:gap-6 px-2 sm:px-0">
        {/* Left Column: Calculator */}
        <section className="w-full md:w-1/2 lg:w-3/5 flex justify-center md:justify-end">
          <div className="calculator-wrapper w-full">
            {isScientificModeActive ? (
              <ScientificCalculator
                onCalculationComplete={handleCalculationComplete}
                switchToBasicMode={toggleScientificMode}
              />
            ) : (
              <BasicCalculator
                onCalculationComplete={handleCalculationComplete}
                isScientificModeUnlocked={isScientificModeUnlocked}
                onToggleScientific={toggleScientificMode}
              />
            )}
          </div>
        </section>
        {/* Right Column: Dashboards and Facts */}
        <aside className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-4 sm:gap-6">
        <h2 className="cta-text">Keep the calculations coming!</h2>
          <PowerUpDashboard
            title={
              isScientificModeUnlocked
                ? "Basic Badges Complete!"
                : "Unlock Scientific Mode!"
            }
            badges={basicBadges}
            unlockedBadges={unlockedBadges}
            totalBadgesNeeded={TOTAL_BASIC_BADGES_NEEDED}
            justUnlockedBadgeId={justUnlockedBadge}
            isUnlocked={isScientificModeUnlocked} // Pass unlock status
            unlockMessage="Scientific Mode Ready!"
          />

          {isScientificModeUnlocked && (
            <PowerUpDashboard
              title="Scientific Badges"
              badges={scientificBadges}
              unlockedBadges={unlockedBadges}
              totalBadgesNeeded={scientificBadges.length} // Goal is to unlock all sci badges
              justUnlockedBadgeId={justUnlockedBadge}
              isUnlocked={scientificBadges.every((b) =>
                unlockedBadges.includes(b.id)
              )} // Check if all sci badges unlocked
              unlockMessage="All Scientific Badges Found!"
            />
          )}
          {currentFact && (
            <DidYouKnow
              fact={currentFact}
              onDismiss={() => setCurrentFact(null)} // Allow dismissing the fact
            />
          )}
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default App;
