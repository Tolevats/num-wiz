import React from "react";
import { useCalculatorLogic } from "../hooks/useCalculatorLogic";
import "./BasicCalculator.css";

// SVG Lock Icon component
const LockIcon = () => (
  <img 
    src="/imgs/lock-keyhole-minimalistic-white.svg" 
    alt="Lock icon"
    className="icon"
    aria-hidden="true"
    width="24"
    height="24"
  />
);

// SVG Change Mode Icon component
const ChangeModeIcon = () => (
  <img
    src="/imgs/calculator-operators.svg"
    alt="Science icon"
    className="icon"
    width="20"
    height="20"
  />
);

// Props expected by BasicCalculator (just the callback)
interface BasicCalculatorProps {
  onCalculationComplete:  ReturnType<typeof useCalculatorLogic>['handleEquals']; // Get type from hook
  isScientificModeUnlocked: boolean;
  onToggleScientific: () => void; // Callback to toggle scientific mode active state
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({ 
  onCalculationComplete, 
  isScientificModeUnlocked,
  onToggleScientific 
}) => {
  // Use the custom hook to get state and handlers
  const {
      displayValue,
      inputDigit,
      inputDecimal,
      clearAll,
      handleOperator,
      handleEquals,
      handleToggleSign,
      handleUnary,
  } = useCalculatorLogic({ onCalculationComplete });

  // --- Render ---
  return (
    <div className="calculator-container">
      {/* Display Screen with displayValue state */}
      <div className="display">
        <div className="output" role="textbox" aria-readonly="true" aria-live="polite" aria-label="calculator screen display">
          {/* Display formatting */}
          {displayValue === "Error" || displayValue.startsWith("Error:")
            ? <span className="text-red-400">{displayValue}</span>
            : (displayValue.length > 15 && !displayValue.includes('E') ? parseFloat(displayValue).toExponential(8) : displayValue.length > 9 && !displayValue.includes('E') ? parseFloat(displayValue).toLocaleString('en-US', { maximumFractionDigits: 8 }) : displayValue)
          }
        </div>
      </div>

      {/* Calculator Buttons Grid - 4 columns */}
      <div className="buttons">
        {/* Row 1: AC, +/-, %, ÷ */}
        <button onClick={clearAll} className="btn clear" aria-label="All Clear">AC</button>
        <button onClick={handleToggleSign} className="btn utility" aria-label="Toggle Sign">+/-</button>
        <button onClick={() => handleUnary("percent")} className="btn utility" aria-label="Percent">%</button>
        <button onClick={() => handleOperator("÷")} className="btn operator" aria-label="Divide">÷</button>

        {/* Row 2: 7, 8, 9, * */}
        <button onClick={() => inputDigit("7")} className="btn number" aria-label="Seven">7</button>
        <button onClick={() => inputDigit("8")} className="btn number" aria-label="Eight">8</button>
        <button onClick={() => inputDigit("9")} className="btn number" aria-label="Nine">9</button>
        <button onClick={() => handleOperator("×")} className="btn operator" aria-label="Multiply">×</button>

        {/* Row 3: 4, 5, 6, - */}
        <button onClick={() => inputDigit("4")} className="btn number" aria-label="Four">4</button>
        <button onClick={() => inputDigit("5")} className="btn number" aria-label="Five">5</button>
        <button onClick={() => inputDigit("6")} className="btn number" aria-label="Six">6</button>
        <button onClick={() => handleOperator("-")} className="btn operator" aria-label="Subtract">-</button>

        {/* Row 4: 1, 2, 3, + */}
        <button onClick={() => inputDigit("1")} className="btn number" aria-label="One">1</button>
        <button onClick={() => inputDigit("2")} className="btn number" aria-label="Two">2</button>
        <button onClick={() => inputDigit("3")} className="btn number" aria-label="Three">3</button>
        <button onClick={() => handleOperator("+")} className="btn operator" aria-label="Add">+</button>

        {/* Row 5: Sci Toggle, 0, ., = */}
        <button
          onClick={onToggleScientific}
          className={`btn focus:ring-2 ${
            isScientificModeUnlocked
                ? 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-700'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed focus:ring-gray-500'
        }`}
          aria-label={isScientificModeUnlocked ? "Switch to Scientific Mode" : "Scientific Mode Locked"}
          disabled={!isScientificModeUnlocked} // Disable if not unlocked, though click handled by onToggleScientific
        >
          {isScientificModeUnlocked ? <ChangeModeIcon /> : <LockIcon />}
        </button>
        <button onClick={() => inputDigit("0")} className="btn number" aria-label="Zero">0</button>
        <button onClick={inputDecimal} className="btn number" aria-label="Decimal Point">.</button>
        <button onClick={handleEquals} className="btn equals" aria-label="Equals">=</button>
      </div>
    </div>
  );
};

export default BasicCalculator;
