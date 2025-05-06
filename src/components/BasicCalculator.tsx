import React from "react";
import { useCalculatorLogic } from "../hooks/useCalculatorLogic";
import "./BasicCalculator.css";

// Props expected by BasicCalculator (just the callback)
interface BasicCalculatorProps {
  onCalculationComplete: ReturnType<typeof useCalculatorLogic>['handleEquals']; // Get type from hook
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({ onCalculationComplete }) => {
  // Use the custom hook to get state and handlers
  const {
      displayValue,
      inputDigit,
      inputDecimal,
      clearAll,
      handleOperator,
      handleEquals,
      handleToggleSign,
      handleUnary, // Use handleUnary for '%'
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
          {displayValue === 'Error'
            ? <span className="text-red-400">{displayValue}</span>
            : (displayValue.length > 15 ? parseFloat(displayValue).toExponential(8) : displayValue.length > 9 ? parseFloat(displayValue).toLocaleString('en-US', { maximumFractionDigits: 8 }) : displayValue)
          }
        </div>
      </div>

      {/* Calculator Buttons Grid with onClick handlers */}
      <div className="buttons">
        {/* Row 1: AC, +/-, %, ÷ */}
        <button onClick={clearAll} className="btn clear" aria-label="All Clear">AC</button>
        <button onClick={handleToggleSign} className="btn utility" aria-label="Toggle Sign">+/-</button>
        <button onClick={() => handleUnary('%')} className="btn utility" aria-label="Percent">%</button>
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

        {/* Row 5: 0, ., = */}
        <button onClick={() => inputDigit("0")} className="btn number col-span-2" aria-label="Zero">0</button>
        <button onClick={inputDecimal} className="btn utility" aria-label="Decimal Point">.</button>
        <button onClick={handleEquals} className="btn equals" aria-label="Equals">=</button>
      </div>
    </div>
  );
};

export default BasicCalculator;
