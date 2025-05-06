import { useState, useCallback } from "react";

// Define operator types
export type Operator = "+" | "-" | "×" | "÷";
export type ScientificOperator =
  | "sin"
  | "cos"
  | "tan"
  | "ln"
  | "log"
  | "sqrt"
  | "exp"
  | "pow"
  | "%";
export type CalculationOperator = Operator | ScientificOperator | string; // Allow other strings like '%' or 'π'

// Define calculation types
export type OperationType = "binary" | "unary" | "other";

// --- Calculation Helper Functions ---
const performCalculation = (
  first: number,
  second: number,
  operator: Operator
): number | string => {
  // Basic binary calculations
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "×":
      return first * second;
    case "÷": {
      if (second === 0) return "Error";
      const result = first / second;
      // Basic precision handling
      if (
        String(result).includes(".") &&
        String(result).split(".")[1].length > 8
      ) {
        return parseFloat(result.toFixed(8));
      }
      return result;
    }
    default:
      return second; // Should not happen
  }
};

const performScientificCalculation = (
  operand: number,
  operation: ScientificOperator
): number | string => {
  // Unary scientific calculations
  try {
    // Handle potential precision issues with trig functions near poles (e.g., tan(pi/2))
    const epsilon = 1e-10; // Small number for comparisons
    if (operation === "tan" && Math.abs(Math.cos(operand)) < epsilon)
      return "Error"; // tan(pi/2 + k*pi) is undefined

    switch (operation) {
      case "sin":
        return Math.sin(operand); // Assumes radians
      case "cos":
        return Math.cos(operand); // Assumes radians
      case "tan":
        return Math.tan(operand); // Assumes radians
      case "ln":
        return operand > 0 ? Math.log(operand) : "Error";
      case "log":
        return operand > 0 ? Math.log10(operand) : "Error";
      case "sqrt":
        return operand >= 0 ? Math.sqrt(operand) : "Error";
      case "exp":
        return Math.exp(operand);
      case "pow":
        return Math.pow(operand, 2); // x squared (can be extended)
      case "%":
        return operand / 100; // Treat standalone % as divide by 100
      default:
        return "Error";
    }
  } catch (e) {
    console.error("Scientific calculation error:", e);
    return "Error";
  }
};

// --- Prop Types for the Hook ---
export interface UseCalculatorLogicProps {
  onCalculationComplete: (
    result: number | string,
    firstOperand?: number | null,
    operator?: CalculationOperator | null,
    secondOperand?: number | null,
    operationType?: OperationType | null
  ) => void;
}

// --- The Custom Hook ---
export const useCalculatorLogic = ({ onCalculationComplete }: UseCalculatorLogicProps) => {
  // --- State Variables ---
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null); // Only for binary ops (+,-,*,/)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [prevCalculation, setPrevCalculation] = useState<{ operand: number; operator: Operator } | null>(null);

  // --- Event Handlers ---
  const inputDigit = useCallback((digit: string) => {
      if (displayValue === "Error") setDisplayValue(""); // Clear error on new input
      if (prevCalculation) setPrevCalculation(null);

      if (waitingForSecondOperand) {
        setDisplayValue(digit);
        setWaitingForSecondOperand(false);
      } else {
        if (displayValue.replace(/[.-]/g, "").length >= 15) return; // Limit digits
        setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
      }
    }, [displayValue, waitingForSecondOperand, prevCalculation]);

  const inputDecimal = useCallback(() => {
    if (displayValue === "Error") setDisplayValue("");
    if (prevCalculation) setPrevCalculation(null);

    if (waitingForSecondOperand) {
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      if (displayValue.replace(/[.-]/g, "").length >= 15) return;
      setDisplayValue(displayValue + ".");
    }
  }, [displayValue, waitingForSecondOperand, prevCalculation]);

  const clearAll = useCallback(() => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setPrevCalculation(null);
    onCalculationComplete(0, null, null, null, "other"); // Notify App state
  }, [onCalculationComplete]);

  const handleOperator = useCallback((nextOperator: Operator) => {
      if (displayValue === "Error") return;
      const inputValue = parseFloat(displayValue);
      if (isNaN(inputValue)) return;

      setPrevCalculation(null);

      // Perform intermediate calculation if needed (e.g., 5 + 3 + ...)
      if (operator && !waitingForSecondOperand && firstOperand !== null) {
        const result = performCalculation(firstOperand, inputValue, operator);
        const resultString = String(result);
        setDisplayValue(resultString);
        const numericResult = parseFloat(resultString);
        setFirstOperand(isNaN(numericResult) ? null : numericResult);
        // Handle intermediate error
        if (result === "Error") {
          onCalculationComplete(
            result,
            firstOperand,
            operator,
            inputValue,
            "binary"
          );
          setOperator(null); // Clear operator on error
          setWaitingForSecondOperand(false); // Don't wait for operand after error
          return; // Stop processing
        }
      } else if (firstOperand === null) {
        // Store the first operand if none exists
        setFirstOperand(inputValue);
      }
      // If waiting for second operand, pressing another operator just changes the operator
      setOperator(nextOperator);
      setWaitingForSecondOperand(true);
    }, [displayValue, operator, firstOperand, waitingForSecondOperand, onCalculationComplete]);

  const handleEquals = useCallback(() => {
    if (displayValue === "Error") return;

    let result: number | string;
    let op1: number | null = null;
    let op2: number | null = null;
    let currentOp: Operator | null = null;
    let operationType: OperationType = "other";

    // Standard calculation: 5 + 3 =
    if (firstOperand !== null && operator && !waitingForSecondOperand) {
      op1 = firstOperand;
      op2 = parseFloat(displayValue);
      if (isNaN(op2)) { setDisplayValue("Error"); onCalculationComplete("Error"); return; }
      currentOp = operator;
      result = performCalculation(op1, op2, currentOp);
      setPrevCalculation({ operand: op2, operator: currentOp }); // Store for consecutive equals
      setFirstOperand(null); // Clear state for next calculation
      setOperator(null);
      operationType = "binary";
    }
    // Consecutive equals: 5 + 3 = = =
    else if (prevCalculation && firstOperand === null) {
      op1 = parseFloat(displayValue); // Previous result
      if (isNaN(op1)) { setDisplayValue("Error"); onCalculationComplete("Error"); return; }
      op2 = prevCalculation.operand; // Stored second operand
      currentOp = prevCalculation.operator; // Stored operator
      result = performCalculation(op1, op2, currentOp);
      // Keep prevCalculation for next equals press
      operationType = "binary";
    }
    // Not enough info to calculate
    else {
      return;
    }

    const resultString = String(result);
    setDisplayValue(resultString);
    // Notify App
    onCalculationComplete(result, op1, currentOp, op2, operationType);
  }, [displayValue, firstOperand, operator, waitingForSecondOperand, prevCalculation, onCalculationComplete]);

  const handleToggleSign = useCallback(() => {
    if (displayValue === "Error" || displayValue === "0") return;
    setDisplayValue(String(parseFloat(displayValue) * -1));
    setPrevCalculation(null); // Reset consecutive equals
  }, [displayValue]);

  // Handles unary operations (scientific functions and %)
  const handleUnary = useCallback((operation: ScientificOperator) => {
      if (displayValue === "Error") return;
      const operand = parseFloat(displayValue);
      if (isNaN(operand)) {
        setDisplayValue("Error");
        onCalculationComplete("Error");
        return;
      }

      let result: number | string;
      const op1 = operand;
      let op2 = null; // Unary operations don't have a second operand in the traditional sense

      // Special handling for % when it acts like a binary modifier (e.g., 100 + 10 %)
      if (operation === "%" && firstOperand !== null && operator && !waitingForSecondOperand) {
        // Calculate percentage of the first operand
        op2 = operand; // The value we're taking the percentage of
        const percentValue = firstOperand * (op2 / 100);
        setDisplayValue(String(percentValue));
        // Don't finalize calculation yet, allow equals or another operator
        setWaitingForSecondOperand(false);
        return;
      } else {
        // Standard unary operation (sin, cos, sqrt, standalone %)
        result = performScientificCalculation(operand, operation);
      }

      const resultString = String(result);
      setDisplayValue(resultString);

      // Reset state after unary operation (acts like equals)
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      setPrevCalculation(null);

      // Notify App
      onCalculationComplete(result, op1, operation, op2, "unary");
    }, [displayValue, firstOperand, operator, waitingForSecondOperand, onCalculationComplete]);

  // Function to directly set the display (e.g., for constants like Pi)
  const setDisplayDirectly = useCallback((value: string) => {
      setDisplayValue(value);
      setWaitingForSecondOperand(false); // Allow overwriting or appending
      setPrevCalculation(null);
      setFirstOperand(null); // Clear pending operations when a constant is pressed
      setOperator(null);
      
      // onCalculationComplete(parseFloat(value), null, 'constant', null, 'other');
    }, [/* onCalculationComplete */]);

  // Return state and handlers
  return {
    displayValue,
    inputDigit,
    inputDecimal,
    clearAll,
    handleOperator,
    handleEquals,
    handleToggleSign,
    handleUnary, // Use this for scientific functions and %
    setDisplayDirectly, // For constants
  };
};
