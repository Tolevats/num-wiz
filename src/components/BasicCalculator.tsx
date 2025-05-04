import React, { useState } from 'react';
import './BasicCalculator.css'; // Import Calculator-specific styles

//Definition of type for operators
type Operator = '+' | '-' | '×' | '÷' |'=' | '%' | '+/-';

const Calculator: React.FC = () => {
  // State Variables
  // displayValue: The string currently shown on the calculator screen (e.g., "123", "0", "-5.5")
  const [displayValue, setDisplayValue] = useState<string>('0');
  // firstOperand: Stores the first number entered before an operator is pressed. Null if not set yet.
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  // operator: Stores the currently selected operator (+, -, *, /). Null if none selected.
  const [operator, setOperator] = useState<Operator | null>(null);
  // waitingForSecondOperand: Flag to track if the next digit input should start a new number
  // (true after an operator is pressed) or append to the current displayValue (false initially).
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  // --- Event Handlers ---
  /**
   * Handles inputting digits (0-9).
   * Appends the digit to the displayValue or replaces it if waiting for the second operand.
   * @param digit The digit ('0' through '9') that was clicked.
   */
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      // If we were waiting for the second operand, this digit starts the new number
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      // Otherwise, append the digit
      // Replace '0' if it's the only thing displayed, otherwise append
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
     // Basic console log for debugging
     console.log(`Digit ${digit} pressed. Display: ${displayValue === '0' ? digit : displayValue + digit}`);
  };

  /**
   * Handles inputting the decimal point (.).
   * Adds a decimal point if one doesn't already exist in the displayValue.
   */
  const inputDecimal = () => {
    // If waiting for the second operand, start with "0."
    if (waitingForSecondOperand) {
        setDisplayValue('0.');
        setWaitingForSecondOperand(false);
        console.log(`Decimal pressed (starting new number). Display: 0.`);
        return;
    }
    // Prevent adding multiple decimal points
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
      console.log(`Decimal pressed. Display: ${displayValue + '.'}`);
    } else {
       console.log(`Decimal pressed (ignored, already exists). Display: ${displayValue}`);
    }
  };

  /**
   * Handles the 'AC' (All Clear) button press.
   * Resets the calculator state to its initial values.
   */
  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    console.log("AC pressed. Calculator reset.");
  };

  // --- Placeholder Handlers (to be implemented) ---
  const handleOperator = (nextOperator: Operator) => {
    console.log(`Operator ${nextOperator} pressed. Current display: ${displayValue}`);
    // Logic for handling operators (+, -, *, /) will go here
    // This will involve storing the firstOperand and the operator
  };

  const handleEquals = () => {
    console.log(`Equals pressed. Current display: ${displayValue}`);
    // Logic for performing the calculation will go here
  };

  const handleToggleSign = () => {
    console.log(`+/- pressed. Current display: ${displayValue}`);
     // Logic for toggling the sign (+/-) will go here
     const currentValue = parseFloat(displayValue);
     if (currentValue !== 0) { // Don't change zero
        setDisplayValue(String(currentValue * -1));
     }
  };

 const handlePercent = () => {
    console.log(`% pressed. Current display: ${displayValue}`);
    // Logic for calculating percentage will go here
    const currentValue = parseFloat(displayValue);
    setDisplayValue(String(currentValue / 100));
 };


  // --- Render ---
  return (
    <div className="calculator-container bg-gradient-to-br from-blue-400 to-purple-500 p-4 sm:p-6 rounded-lg shadow-xl max-w-sm mx-auto my-8">
      {/* Display Screen with displayValue state */}
      <div className="display bg-gray-800 text-white text-right p-4 rounded-md mb-4 shadow-inner">
        <div 
        className="output text-3xl sm:text-4xl font-mono break-all"
        role="textbox"
        aria-readonly="true"
        aria-live="polite"
        >
          {displayValue} {/* Display the state variable */}
        </div> 
      </div>

      {/* Calculator Buttons Grid with onClick handlers */}
      <div className="buttons grid grid-cols-4 gap-2">
        {/* Row 1: AC, +/-, %, ÷ */}
        <button onClick={clearAll} className="btn bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 rounded-md shadow">AC</button>
        <button onClick={handleToggleSign} className="btn bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 rounded-md shadow">+/-</button>
        <button onClick={handlePercent} className="btn bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 rounded-md shadow">%</button>
        <button onClick={() => handleOperator('÷')} className="btn operator bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md shadow">÷</button>

        {/* Row 2: 7, 8, 9, * */}
        <button onClick={() => inputDigit('7')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">7</button>
        <button onClick={() => inputDigit('8')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">8</button>
        <button onClick={() => inputDigit('9')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">9</button>
        <button onClick={() => handleOperator('×')} className="btn operator bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md shadow">×</button>

        {/* Row 3: 4, 5, 6, - */}
        <button onClick={() => inputDigit('4')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">4</button>
        <button onClick={() => inputDigit('5')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">5</button>
        <button onClick={() => inputDigit('6')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">6</button>
        <button onClick={() => handleOperator('-')} className="btn operator bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md shadow">-</button>

        {/* Row 4: 1, 2, 3, + */}
        <button onClick={() => inputDigit('1')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">1</button>
        <button onClick={() => inputDigit('2')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">2</button>
        <button onClick={() => inputDigit('3')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">3</button>
        <button onClick={() => handleOperator('+')} className="btn operator bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md shadow">+</button>

        {/* Row 5: 0, ., = */}
        <button onClick={() => inputDigit('0')} className="btn number col-span-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">0</button>
        <button onClick={inputDecimal} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow">.</button>
        <button onClick={handleEquals} className="btn equals bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md shadow">=</button>
      </div>
    </div>
  );
};

export default Calculator;