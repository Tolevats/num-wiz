import React, { useState } from 'react';
import './BasicCalculator.css'; // Import Calculator-specific styles

//Definition of type for operators
type Operator = '+' | '-' | '×' | '÷';

// Helper function to perform the calculation
const performCalculation = (first: number, second: number, operator: Operator): number | string => {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '×':
      return first * second;
    case '÷':
      if (second === 0) {
        return 'Error'; // Handle division by zero
      }
      return first / second;
    default:
      // Should not happen with TypeScript, but good practice
      return second;
  }
};

const Calculator: React.FC = () => {
  // --- State Variables ---
  const [displayValue, setDisplayValue] = useState<string>('0'); // displayValue: The string currently shown on the calculator screen
  const [firstOperand, setFirstOperand] = useState<number | null>(null); // firstOperand: Stores the first number entered before an operator is pressed. Null if not set yet
  const [operator, setOperator] = useState<Operator | null>(null); // operator: Stores the currently selected operator (+, -, *, /). Null if none selected.
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false); // waitingForSecondOperand: Flag to track if the next digit input should start a new number. // (true after an operator is pressed) or append to the current displayValue (false initially).
  const [prevCalculation, setPrevCalculation] = useState<{ operand: number; operator: Operator } | null>(null); // Store the previous calculation details for potential consecutive equals presses

  // --- Event Handlers ---
  const inputDigit = (digit: string) => {
    if (prevCalculation) setPrevCalculation(null); // Reset previous calculation if a new digit is entered after equals
    
    if (waitingForSecondOperand) { // If we were waiting for the second operand, this digit starts the new number
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit); // Replace '0' if it's the only thing displayed, otherwise append
    }
     // Basic console log for debugging
     console.log(`Digit ${digit} pressed. Display: ${displayValue === '0' ? digit : displayValue + digit}`);
  };

  const inputDecimal = () => {
    if (prevCalculation) setPrevCalculation(null); // Reset previous calculation if decimal is entered after equals
    
    if (waitingForSecondOperand) { // If waiting for the second operand, start with "0."
        setDisplayValue('0.');
        setWaitingForSecondOperand(false);
        console.log(`Decimal pressed (starting new number). Display: 0.`);
        return;
    }
    if (!displayValue.includes('.')) { // Prevent adding multiple decimal points
      setDisplayValue(displayValue + '.');
      console.log(`Decimal pressed. Display: ${displayValue + '.'}`);
    } else {
       console.log(`Decimal pressed (ignored, already exists). Display: ${displayValue}`);
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setPrevCalculation(null); // Clear previous calculation state
    console.log("AC pressed. Calculator reset.");
  };

  // --- Handles operator button presses ---
  const handleOperator = (nextOperator: Operator) => { //@param nextOperator The operator that was clicked
    console.log(`Operator ${nextOperator} pressed. Current display: ${displayValue}`);
    const inputValue = parseFloat(displayValue);

    setPrevCalculation(null); // Reset previous calculation state on new operator input

    if (operator && !waitingForSecondOperand && firstOperand !== null) { // If an operator is already set, and we are not waiting for the second operand, perform the previous calculation first
      const result = performCalculation(firstOperand, inputValue, operator);
      const resultString = String(result);
      setDisplayValue(resultString);
      setFirstOperand(typeof result === 'number' ? result : null); // Store result as new first operand only if it's a number
      console.log(`Intermediate calculation: ${firstOperand} ${operator} ${inputValue} = ${resultString}`);
    } else if (firstOperand === null) {
        setFirstOperand(inputValue); // If it's the first operator press, store the current display value as the first operand
    } else {
        // If waiting for second operand, just update the operator
        console.log(`Operator changed from ${operator} to ${nextOperator}`);
    }

    // Set the new operator and flag that we're waiting for the second operand
    setOperator(nextOperator);
    setWaitingForSecondOperand(true);
  };

  const handleEquals = () => {
    console.log(`Equals pressed. State: firstOperand=${firstOperand}, operator=${operator}, displayValue=${displayValue}, waiting=${waitingForSecondOperand}`);

    let result: number | string;
    let currentSecondOperand: number;

    // Case 1: Standard calculation
    if (firstOperand !== null && operator && !waitingForSecondOperand) {
        currentSecondOperand = parseFloat(displayValue);
        result = performCalculation(firstOperand, currentSecondOperand, operator);
        console.log(`Calculation: ${firstOperand} ${operator} ${currentSecondOperand} = ${result}`);
        // Store details for potential consecutive equals presses
        setPrevCalculation({ operand: currentSecondOperand, operator: operator });
        setFirstOperand(null); // Clear first operand after calculation
        setOperator(null); // Clear operator
        // waitingForSecondOperand remains false
    }
    // Case 2: Consecutive equals presses
    else if (prevCalculation && firstOperand === null) { // Check firstOperand is null to ensure it's after an initial equals
        const currentDisplayValue = parseFloat(displayValue); // The result of the last calculation
        result = performCalculation(currentDisplayValue, prevCalculation.operand, prevCalculation.operator);
        console.log(`Consecutive equals: ${currentDisplayValue} ${prevCalculation.operator} ${prevCalculation.operand} = ${result}`);
        // Keep prevCalculation the same for the next equals press
    }
    // Case 3: Pressing equals without enough info
    else {
        console.log("Equals pressed, but not enough information to calculate.");
        return; // Do nothing
    }

    const resultString = String(result);
    setDisplayValue(resultString);
    // Don't set waitingForSecondOperand here, allow new number input or operator after equals
  };

  const handleToggleSign = () => {
    console.log(`+/- pressed. Current display: ${displayValue}`);
    if (displayValue === 'Error') return; // Don't toggle sign on error message
    const currentValue = parseFloat(displayValue);
    if (currentValue !== 0) { // Don't change zero
      setDisplayValue(String(currentValue * -1));
    }
    setPrevCalculation(null); // Reset previous calculation state if sign is toggled
  };

 const handlePercent = () => {
    console.log(`% pressed. Current display: ${displayValue}`);
    if (displayValue === 'Error') return; // Don't calculate percent on error message
    const currentValue = parseFloat(displayValue);
    setDisplayValue(String(currentValue / 100));
    setPrevCalculation(null);// Reset previous calculation state if percent is used
    setOperator(null);
    setFirstOperand(null);
    setWaitingForSecondOperand(false);
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
        aria-label="calculator screen display"
        >
          {displayValue.length > 12 ? parseFloat(displayValue).toExponential(5) : displayValue} {/* Display the state variable */} {/* Basic formatting for long numbers - might be better a library */}
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