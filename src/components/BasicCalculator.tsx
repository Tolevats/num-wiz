import React, { useState } from "react";
import "./BasicCalculator.css"; // Import Calculator-specific styles

//Definition of type for operators
type Operator = "+" | "-" | "×" | "÷";

// Helper function to perform the calculation
const performCalculation = (
  first: number,
  second: number,
  operator: Operator
): number | string => {
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "×":
      return first * second;
    case "÷": {
      if (second === 0) return "Error"; // Handle division by zero
      // Handle potential floating point inaccuracies for simple cases
      const result = first / second;
      // Basic check for long decimals - could be more robust
      if (
        String(result).includes(".") &&
        String(result).split(".")[1].length > 8
      ) {
        return parseFloat(result.toFixed(8)); // Limit decimals for division
      }
      return result;
    }
    default:
      return second;
  }
};

// --- Prop Types for Calculator ---
interface CalculatorProps {
  // Function called when '=' is pressed and calculation is done
  onCalculationComplete: (
    result: number | string,
    firstOperand?: number | null,
    operator?: string | null, // Pass operator as string
    secondOperand?: number | null
  ) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculationComplete }) => {
  // --- State Variables ---
  const [displayValue, setDisplayValue] = useState<string>("0"); // displayValue: The string currently shown on the calculator screen
  const [firstOperand, setFirstOperand] = useState<number | null>(null); // firstOperand: Stores the first number entered before an operator is pressed. Null if not set yet
  const [operator, setOperator] = useState<Operator | null>(null); // operator: Stores the currently selected operator (+, -, *, /). Null if none selected.
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState<boolean>(false); // waitingForSecondOperand: Flag to track if the next digit input should start a new number. // (true after an operator is pressed) or append to the current displayValue (false initially).
  const [prevCalculation, setPrevCalculation] = useState<{
    operand: number;
    operator: Operator;
  } | null>(null); // Store the previous calculation details for potential consecutive equals presses

  // --- Event Handlers ---
  const inputDigit = (digit: string) => {
    if (displayValue === "Error") {
      setDisplayValue(digit); // Start new number after error
      setPrevCalculation(null);
      setWaitingForSecondOperand(false);
      return;
    }
    if (prevCalculation) setPrevCalculation(null); // Reset previous calculation if a new digit is entered after equals

    if (waitingForSecondOperand) {
      // If we were waiting for the second operand, this digit starts the new number
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      // Prevent excessively long numbers (limit to 15 digits)
      if (displayValue.replace(".", "").length >= 15) return;
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit); // Replace '0' if it's the only thing displayed, otherwise append
    }
  };

  const inputDecimal = () => {
    if (displayValue === "Error") {
      setDisplayValue("0.");
      setPrevCalculation(null);
      setWaitingForSecondOperand(false);
      return;
    }
    if (prevCalculation) setPrevCalculation(null); // Reset previous calculation if decimal is entered after equals

    if (waitingForSecondOperand) {
      // If waiting for the second operand, start with "0."
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      // Prevent excessively long numbers
      if (displayValue.length >= 15) return;
        setDisplayValue(displayValue + ".");
    }
  };

  const clearAll = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setPrevCalculation(null); // Clear previous calculation state
  };

  // --- Handles operator button presses ---
  const handleOperator = (nextOperator: Operator) => {
    if (displayValue === "Error") return; // Don't allow operations after error
    const inputValue = parseFloat(displayValue);
    setPrevCalculation(null); // Reset previous calculation state on new operator input

    if (operator && !waitingForSecondOperand && firstOperand !== null) {
      // If an operator is already set, and we are not waiting for the second operand, perform the previous calculation first
      const result = performCalculation(firstOperand, inputValue, operator);
      const resultString = String(result);
      setDisplayValue(resultString);
      // Check if result is a valid number before storing
      const numericResult = parseFloat(resultString);
      setFirstOperand(isNaN(numericResult) ? null : numericResult);
      // Handle error propagation
      if (result === "Error") {
        setOperator(null);
        setWaitingForSecondOperand(false);
        return; // Stop further processing on error
      }
    } else if (firstOperand === null) {
      setFirstOperand(inputValue); // If it's the first operator press, store the current display value as the first operand
    }
    // Set the new operator and flag that we're waiting for the second operand
    setOperator(nextOperator);
    setWaitingForSecondOperand(true);
  };

  // --- Updated handleEquals to call the prop ---
  const handleEquals = () => {
    if (displayValue === 'Error') return;

    let result: number | string;
    let op1: number | null = null;
    let op2: number | null = null;
    let currentOp: Operator | null = null;

    // Case 1: Standard calculation
    if (firstOperand !== null && operator && !waitingForSecondOperand) {
      op1 = firstOperand;
      op2 = parseFloat(displayValue);
      currentOp = operator;
      result = performCalculation(op1, op2, currentOp);
      setPrevCalculation({ operand: op2, operator: currentOp });
      setFirstOperand(null);
      setOperator(null);
    }
    // Case 2: Consecutive equals presses
    else if (prevCalculation && firstOperand === null) {
      op1 = parseFloat(displayValue); // The previous result
      op2 = prevCalculation.operand;
      currentOp = prevCalculation.operator;
      result = performCalculation(op1, op2, currentOp);
      // Keep prevCalculation for next equals press
    }
    // Case 3: Pressing equals without enough info
    else {
      console.log("Equals pressed, but not enough information to calculate.");
      return; // Don't call callback if nothing happened
    }

    const resultString = String(result);
    setDisplayValue(resultString);

    // *** Call the callback function passed from App ***
    onCalculationComplete(result, op1, currentOp, op2);
  };

  const handleToggleSign = () => {
    if (displayValue === "Error" || displayValue === "0") return; // Don't toggle sign on error message
    console.log(`+/- pressed. Current display: ${displayValue}`);
    setDisplayValue(String(parseFloat(displayValue) * -1));
    setPrevCalculation(null); // Reset previous calculation state if sign is toggled
  };

  const handlePercent = () => {
    if (displayValue === "Error") return; // Don't calculate percent on error message
    console.log(`% pressed. Current display: ${displayValue}`);
    const currentValue = parseFloat(displayValue);
    // Calculate percentage based on first operand if available
    let resultValue;
    if (firstOperand !== null && operator) {
      // Calculate percentage of the first operand
      resultValue = firstOperand * (currentValue / 100);
    } else {
      resultValue = currentValue / 100;
    }
    setDisplayValue(String(resultValue));
    setPrevCalculation(null); // Reset previous calculation state if percent is used
    setWaitingForSecondOperand(false);
  };

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
          {displayValue === "Error" ? (
            <span className="text-red-400">{displayValue}</span> // Style error message
          ) : displayValue.length > 15 ? ( // Use exponential for very long numbers
            parseFloat(displayValue).toExponential(8)
          ) : displayValue.length > 9 ? ( // Add commas for readability for large numbers
            parseFloat(displayValue).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            })
          ) : (
            displayValue
          )}
        </div>
      </div>

      {/* Calculator Buttons Grid with onClick handlers */}
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
          onClick={handlePercent}
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

        {/* Row 5: 0, ., = */}
        <button
          onClick={() => inputDigit("0")}
          className="btn number col-span-2"
          aria-label="Zero"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="btn utility"
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

export default Calculator;
