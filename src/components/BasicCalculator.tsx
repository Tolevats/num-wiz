import React from "react";
import {
  useCalculatorLogic,
  UseCalculatorLogicProps,
} from "../hooks/useCalculatorLogic";
import "./BasicCalculator.css";

// SVG Lock Icon component
const LockIcon = () => (
  <svg
    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon stroke-current"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// SVG Change Mode Icon component
const ScienceIcon = () => (
  <svg
    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon stroke-current"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

// Props expected by BasicCalculator (just the callback)
interface BasicCalculatorProps {
  onCalculationComplete: UseCalculatorLogicProps["onCalculationComplete"]; // Use imported type
  isScientificModeUnlocked: boolean;
  onToggleScientific: () => void; // Callback to toggle scientific mode active state
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({
  onCalculationComplete,
  isScientificModeUnlocked,
  onToggleScientific,
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
        <div
          className="output"
          role="textbox"
          aria-readonly="true"
          aria-live="polite"
          aria-label="calculator screen display"
        >
          {/* Display formatting */}
          {displayValue === "Error" || displayValue.startsWith("Error:") ? (
            <span className="text-red-400">{displayValue}</span>
          ) : displayValue.length > 15 && !displayValue.includes("E") ? (
            parseFloat(displayValue).toExponential(8)
          ) : displayValue.length > 9 && !displayValue.includes("E") ? (
            parseFloat(displayValue).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            })
          ) : (
            displayValue
          )}
        </div>
      </div>

      {/* Calculator Buttons Grid - 4 columns */}
      <div className="buttons">
        {/* Row 1: AC, +/-, %, ÷ */}
        <button onClick={clearAll} className="btn clear" aria-label="All Clear">
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="btn utility"
          aria-label="Toggle Sign"
        >
          +/-
        </button>
        <button
          onClick={() => handleUnary("percent")}
          className="btn utility"
          aria-label="Percent"
        >
          %
        </button>
        <button
          onClick={() => handleOperator("÷")}
          className="btn operator"
          aria-label="Divide"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, * */}
        <button
          onClick={() => inputDigit("7")}
          className="btn number"
          aria-label="Seven"
        >
          7
        </button>
        <button
          onClick={() => inputDigit("8")}
          className="btn number"
          aria-label="Eight"
        >
          8
        </button>
        <button
          onClick={() => inputDigit("9")}
          className="btn number"
          aria-label="Nine"
        >
          9
        </button>
        <button
          onClick={() => handleOperator("×")}
          className="btn operator"
          aria-label="Multiply"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, - */}
        <button
          onClick={() => inputDigit("4")}
          className="btn number"
          aria-label="Four"
        >
          4
        </button>
        <button
          onClick={() => inputDigit("5")}
          className="btn number"
          aria-label="Five"
        >
          5
        </button>
        <button
          onClick={() => inputDigit("6")}
          className="btn number"
          aria-label="Six"
        >
          6
        </button>
        <button
          onClick={() => handleOperator("-")}
          className="btn operator"
          aria-label="Subtract"
        >
          -
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => inputDigit("1")}
          className="btn number"
          aria-label="One"
        >
          1
        </button>
        <button
          onClick={() => inputDigit("2")}
          className="btn number"
          aria-label="Two"
        >
          2
        </button>
        <button
          onClick={() => inputDigit("3")}
          className="btn number"
          aria-label="Three"
        >
          3
        </button>
        <button
          onClick={() => handleOperator("+")}
          className="btn operator"
          aria-label="Add"
        >
          +
        </button>

        {/* Row 5: Sci Toggle, 0, ., = */}
        <button
          onClick={onToggleScientific}
          className={`btn text-sm sm:text-base md:text-lg font-semibold py-2 sm:py-3 rounded-md shadow focus:ring-2 ${
            isScientificModeUnlocked
              ? "bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-700"
              : "bg-gray-400 text-gray-700 cursor-pointer focus:ring-gray-500"
          }`}
          aria-label={
            isScientificModeUnlocked
              ? "Switch to Scientific Mode"
              : "Scientific Mode Locked"
          }
          disabled={!isScientificModeUnlocked} // Disable if not unlocked, though click handled by onToggleScientific
        >
          {isScientificModeUnlocked ? <ScienceIcon /> : <LockIcon />}
        </button>
        <button
          onClick={() => inputDigit("0")}
          className="btn number"
          aria-label="Zero"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="btn number"
          aria-label="Decimal Point"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="btn equals"
          aria-label="Equals"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default BasicCalculator;
