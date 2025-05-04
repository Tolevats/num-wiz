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
      if (second === 0) {
        return "Error"; // Handle division by zero
      }
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
      // Should not happen with TypeScript, but good practice
      return second;
  }
};

const Calculator: React.FC = () => {
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
      if (displayValue.replace(".", "").length >= 15) {
        console.log("Max digits reached");
        return;
      }
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit); // Replace '0' if it's the only thing displayed, otherwise append
    }
    // Basic console log for debugging
    console.log(
      `Digit ${digit} pressed. Display: ${
        displayValue === "0" ? digit : displayValue + digit
      }`
    );
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
      console.log(`Decimal pressed (starting new number). Display: 0.`);
      return;
    }
    if (!displayValue.includes(".")) {
      // Prevent excessively long numbers
      if (displayValue.length >= 15) {
        console.log("Max digits reached");
        return;
      }
      setDisplayValue(displayValue + ".");
      console.log(`Decimal pressed. Display: ${displayValue + "."}`);
    } else {
      console.log(
        `Decimal pressed (ignored, already exists). Display: ${displayValue}`
      );
    }
  };

  const clearAll = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setPrevCalculation(null); // Clear previous calculation state
    console.log("AC pressed. Calculator reset.");
  };

  // --- Handles operator button presses ---
  const handleOperator = (nextOperator: Operator) => {
    if (displayValue === "Error") return; // Don't allow operations after error

    console.log(
      `Operator ${nextOperator} pressed. Current display: ${displayValue}`
    );
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
      console.log(
        `Intermediate calculation: ${firstOperand} ${operator} ${inputValue} = ${resultString}`
      );
      // Handle error propagation
      if (result === "Error") {
        setOperator(null);
        setWaitingForSecondOperand(false);
        return; // Stop further processing on error
      }
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
    console.log(
      `Equals pressed. State: firstOperand=${firstOperand}, operator=${operator}, displayValue=${displayValue}, waiting=${waitingForSecondOperand}`
    );
    if (displayValue === "Error") return; // Don't allow equals after error

    let result: number | string;
    let currentSecondOperand: number;

    // Case 1: Standard calculation
    if (firstOperand !== null && operator && !waitingForSecondOperand) {
      currentSecondOperand = parseFloat(displayValue);
      result = performCalculation(firstOperand, currentSecondOperand, operator);
      console.log(
        `Calculation: ${firstOperand} ${operator} ${currentSecondOperand} = ${result}`
      );
      // Store details for potential consecutive equals presses
      setPrevCalculation({ operand: currentSecondOperand, operator: operator });
      setFirstOperand(null); // Clear first operand after calculation
      setOperator(null); // Clear operator
      // waitingForSecondOperand remains false
    }
    // Case 2: Consecutive equals presses
    else if (prevCalculation && firstOperand === null) {
      // Check firstOperand is null to ensure it's after an initial equals
      const currentDisplayValue = parseFloat(displayValue); // The result of the last calculation
      result = performCalculation(
        currentDisplayValue,
        prevCalculation.operand,
        prevCalculation.operator
      );
      console.log(
        `Consecutive equals: ${currentDisplayValue} ${prevCalculation.operator} ${prevCalculation.operand} = ${result}`
      );
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
    if (displayValue === "Error" || displayValue === "0") return; // Don't toggle sign on error message
    console.log(`+/- pressed. Current display: ${displayValue}`);
    setDisplayValue(String(parseFloat(displayValue) * -1));
    setPrevCalculation(null); // Reset previous calculation state if sign is toggled
  };

  const handlePercent = () => {
    if (displayValue === "Error") return; // Don't calculate percent on error message
    console.log(`% pressed. Current display: ${displayValue}`);
    const currentValue = parseFloat(displayValue);
    // More standard calculator behavior: calculate percentage based on first operand if available
    let resultValue;
    if (firstOperand !== null && operator) {
      // Calculate percentage of the first operand
      resultValue = firstOperand * (currentValue / 100);
    } else {
      // Otherwise, just divide by 100 (less common, but simple)
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
        <button
          onClick={clearAll}
          className="btn clear" aria-label="All Clear"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="btn utility" aria-label="Toggle Sign"
        >
          +/-
        </button>
        <button
          onClick={handlePercent}
          className="btn utility" aria-label="Percent"
        >
          %
        </button>
        <button
          onClick={() => handleOperator("÷")}
          className="btn operator" aria-label="Divide"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, * */}
        <button
          onClick={() => inputDigit("7")}
          className="btn number" aria-label="Seven"
        >
          7
        </button>
        <button
          onClick={() => inputDigit("8")}
          className="btn number" aria-label="Eight"
        >
          8
        </button>
        <button
          onClick={() => inputDigit("9")}
          className="btn number" aria-label="Nine"
        >
          9
        </button>
        <button
          onClick={() => handleOperator("×")}
          className="btn operator" aria-label="Multiply"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, - */}
        <button
          onClick={() => inputDigit("4")}
          className="btn number" aria-label="Four"
        >
          4
        </button>
        <button
          onClick={() => inputDigit("5")}
          className="btn number" aria-label="Five"
        >
          5
        </button>
        <button
          onClick={() => inputDigit("6")}
          className="btn number" aria-label="Six"
        >
          6
        </button>
        <button
          onClick={() => handleOperator("-")}
          className="btn operator" aria-label="Subtract"
        >
          -
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => inputDigit("1")}
          className="btn number" aria-label="One"
        >
          1
        </button>
        <button
          onClick={() => inputDigit("2")}
          className="btn number" aria-label="Two"
        >
          2
        </button>
        <button
          onClick={() => inputDigit("3")}
          className="btn number" aria-label="Three"
        >
          3
        </button>
        <button
          onClick={() => handleOperator("+")}
          className="btn operator" aria-label="Add"
        >
          +
        </button>

        {/* Row 5: 0, ., = */}
        <button
          onClick={() => inputDigit("0")}
          className="btn number col-span-2" aria-label="Zero"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="btn utility" aria-label="Decimal Point"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="btn equals" aria-label="Equals"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
