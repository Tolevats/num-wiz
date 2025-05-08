import { useState, useCallback } from "react";

// Define operator types
export type Operator = "+" | "-" | "×" | "÷";
export type ScientificOperator =
  | "sin" | "cos" | "tan"  // Trigonometric
  | "asin" | "acos" | "atan" // Inverse trigonometric
  | "sinh" | "cosh" | "tanh" // Hyperbolic
  | "asinh" | "acosh" | "atanh" // Inverse hyperbolic
  | "ln" | "log"  // Logarithmic (log10)
  | "logy" | "log2" // Log base y (placeholder), log base 2
  | "sqrt" | "cbrt" | "ysqrtx" // Roots (square, cube, y root x placeholder)
  | "exp"  // e^x
  | "pow" // x^2 
  | "pow3" // x^3
  | "powy" // x^y (placeholder - needs binary op handling)
  | "two_pow_x" // 2^x
  | "ten_pow_x" // 10^x (same as "exp" if base is e, or Math.pow(10,x))
  | "one_div_x" // 1/x (reciprocal)
  | "fact" // x! (factorial)
  | "percent" // %
  | "e_const" // Euler's number constant
  | "pi_const" // Pi constant (already handled by setDisplayDirectly)
  | "rand" // Random number
  | "EE"; // Scientific notation (placeholder)

export type CalculationOperator = Operator | ScientificOperator | string; // Allow other strings like "%" or "π"
export type OperationType = "binary" | "unary" | "constant" | "other" | "clear"; // Calculation types

// --- Calculation Helper Functions ---
const performCalculation = (first: number, second: number, operator: Operator): number | string => {
  // Basic binary calculations
  switch (operator) {
    case "+": return first + second;
    case "-": return first - second;
    case "×": return first * second;
    case "÷": {
      if (second === 0) return "Error: Div by 0";
      const result = first / second;
      // Basic precision handling
      if (String(result).includes(".") && String(result).split(".")[1].length > 8) 
        { 
          return parseFloat(result.toFixed(8));
        }
      return result;
    }
    default: return second;
  }
};

const factorial = (n: number): number | string => {
  if (n < 0) return "Error: Neg Factorial";
  if (n === 0 || n === 1) return 1;
  if (n > 170) return "Infinity"; // Factorial grows very fast, 170! is max for JS numbers
  let result = 1;
  for (let i = 2; i <= n; i++) {
      result *= i;
  }
  return result;
};

const performScientificCalculation = (operand: number, operation: ScientificOperator): number | string => {
  // Unary scientific calculations
  try {
    // Handle potential precision issues with trig functions near poles (e.g., tan(pi/2))
    const epsilon = 1e-10; // Small number for comparisons
    switch (operation) {
      //Trig
      case "sin": return Math.sin(operand);
      case "cos": return Math.cos(operand);
      case "tan": return Math.abs(Math.cos(operand)) < epsilon ? "Error: Undefined" : Math.tan(operand);
      case "asin": return Math.asin(operand);
      case "acos": return Math.acos(operand);
      case "atan": return Math.atan(operand);
      // Hyperbolic
      case "sinh": return Math.sinh(operand);
      case "cosh": return Math.cosh(operand);
      case "tanh": return Math.tanh(operand);
      case "asinh": return Math.asinh(operand);
      case "acosh": return Math.acosh(operand);
      case "atanh": return Math.atanh(operand);
      // Logs
      case "ln": return operand > 0 ? Math.log(operand) : "Error: Log Domain";
      case "log": return operand > 0 ? Math.log10(operand) : "Error: Log Domain";
      case "log2": return operand > 0 ? Math.log2(operand) : "Error: Log Domain";
      // Roots
      case "sqrt": return operand >= 0 ? Math.sqrt(operand) : "Error: Sqrt Domain";
      case "cbrt": return Math.cbrt(operand); // cube
      // Powers
      case "exp": return Math.exp(operand); // e^x
      case "pow": return Math.pow(operand, 2); //  x^2
      case "pow3": return Math.pow(operand, 3); // x^3
      case "two_pow_x": return Math.pow(2, operand); // 2^x
      case "ten_pow_x": return Math.pow(10, operand); // 10^x
      // Other
      case "one_div_x": return operand !== 0 ? 1 / operand : "Error: Div by 0";
      case "fact": return Number.isInteger(operand) ? factorial(operand) : "Error: Non-integer";
      case "percent": return operand / 100;
      case "e_const": return Math.E;
      case "rand": return Math.random();

      // Placeholders for more complex ops
      case "logy": return `log_y(${operand}) P`; // Placeholder
      case "ysqrtx": return `y√${operand} P`; // Placeholder
      case "powy": return `${operand}^y P`; // Placeholder
      case "EE": return `${operand}E P`; // Placeholder
      default: console.warn(`Unknown scientific op: ${operation}`); return "Error: Unknown Op";
    }
  } catch (e: unknown) {
    console.error("Scientific calculation error:", e);
    // Check for specific math errors like domain errors from acosh etc.
    if (e instanceof Error && e.message.includes("outside of domain") || e instanceof Error && e.message.includes("Invalid") || e instanceof Error && e.name === "RangeError") return "Error: Domain";
    return "Error: Math";
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
  initialDisplay?: string;
}

// --- The Custom Hook ---
export const useCalculatorLogic = ({ onCalculationComplete, initialDisplay = "0" }: UseCalculatorLogicProps) => {
  // --- State Variables ---
  const [displayValue, setDisplayValue] = useState<string>(initialDisplay);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null); // Only for binary ops (+,-,*,/)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [prevCalculation, setPrevCalculation] = useState<{ operand: number; operator: Operator } | null>(null);
  //const [angleMode, setAngleMode] = useState<"rad" | "deg">("rad"); // TO WORK LATER: Add state for Rad/Deg mode for full trig functions

  // --- Event Handlers ---
  const inputDigit = useCallback((digit: string) => {
      if (displayValue === "Error" || displayValue.startsWith("Error:")) setDisplayValue(""); // Clear error on new input
      if (prevCalculation) setPrevCalculation(null);
      if (waitingForSecondOperand) {
        setDisplayValue(digit);
        setWaitingForSecondOperand(false);
      } else {
        if (displayValue.replace(/[.-]/g, "").length >= 15 && !displayValue.includes("E")) return;
        setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
      }
    }, [displayValue, waitingForSecondOperand, prevCalculation]);

  const inputDecimal = useCallback(() => {
    if (displayValue === "Error" || displayValue.startsWith("Error:")) setDisplayValue("");
    if (prevCalculation) setPrevCalculation(null);
    if (waitingForSecondOperand) {
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      if (displayValue.replace(/[.-]/g, "").length >= 15 && !displayValue.includes("E")) return;
      setDisplayValue(displayValue + ".");
    }
  }, [displayValue, waitingForSecondOperand, prevCalculation]);

  const clearAll = useCallback(() => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setPrevCalculation(null);
    onCalculationComplete(0, null, null, null, "clear"); // Pass 'clear' type so it doesn't trigger facts for '0'
  }, [onCalculationComplete]);

  const handleOperator = useCallback((nextOperator: Operator) => {
      if (displayValue === "Error" || displayValue.startsWith("Error:")) return;
      const inputValue = parseFloat(displayValue);
      if (isNaN(inputValue)) { setDisplayValue("Error: Invalid Input"); return; }
      setPrevCalculation(null);
      // Perform intermediate calculation if needed
      if (operator && !waitingForSecondOperand && firstOperand !== null) {
        const result = performCalculation(firstOperand, inputValue, operator);
        const resultString = String(result);
        setDisplayValue(resultString);
        const numericResult = parseFloat(resultString); // Re-parse in case of "Error"
        setFirstOperand(isNaN(numericResult) ? null : numericResult);
        // Handle intermediate error
        if (resultString.startsWith("Error:")) {
          onCalculationComplete(resultString, firstOperand, operator, inputValue, "binary");
          setOperator(null); // Clear operator on error
          setWaitingForSecondOperand(false); // Don't wait for operand after error
          return; // Stop processing
        }
      } else if (firstOperand === null) {
        setFirstOperand(inputValue); // Store the first operand if none exists
      }
      setOperator(nextOperator); // If waiting for second operand, pressing another operator just changes the operator
      setWaitingForSecondOperand(true);
    }, [displayValue, operator, firstOperand, waitingForSecondOperand, onCalculationComplete]);

  const handleEquals = useCallback(() => {
    if (displayValue === "Error" || displayValue.startsWith("Error:")) return;

    let result: number | string;
    let op1: number | null = null;
    let op2: number | null = null;
    let currentOp: Operator | null = null;
    const operationType: OperationType = "binary";

    // Standard calculation: 5 + 3 =
    if (firstOperand !== null && operator && !waitingForSecondOperand) {
      op1 = firstOperand;
      op2 = parseFloat(displayValue);
      if (isNaN(op2)) { setDisplayValue("Error: Invalid Input"); onCalculationComplete("Error: Invalid Input"); return; }
      currentOp = operator;
      result = performCalculation(op1, op2, currentOp);
      setPrevCalculation({ operand: op2, operator: currentOp }); // Store for consecutive equals
      setFirstOperand(null); // Clear state for next calculation
      setOperator(null);
    }
    // Consecutive equals: 5 + 3 = = =
    else if (prevCalculation && firstOperand === null) {
      op1 = parseFloat(displayValue); // Previous result
      if (isNaN(op1)) { setDisplayValue("Error: Invalid Input"); onCalculationComplete("Error: Invalid Input"); return; }
      op2 = prevCalculation.operand; // Stored second operand
      currentOp = prevCalculation.operator; // Stored operator
      result = performCalculation(op1, op2, currentOp);
    }
    else { // Not enough info to calculate
      return;
    }

    const resultString = String(result);
    setDisplayValue(resultString);
    onCalculationComplete(result, op1, currentOp, op2, operationType);
  }, [displayValue, firstOperand, operator, waitingForSecondOperand, prevCalculation, onCalculationComplete]);

  const handleToggleSign = useCallback(() => {
    if (displayValue === "Error" || displayValue.startsWith("Error:") || displayValue ===  "0") return;
    if (displayValue.includes("E")) { // Handle scientific notation
      const parts = displayValue.split("E");
      setDisplayValue(`${parseFloat(parts[0]) * -1}E${parts[1]}`);
  } else {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  }
    setPrevCalculation(null); // Reset consecutive equals
  }, [displayValue]);

  // Handles unary operations (scientific functions)
  const handleUnary = useCallback((operation: ScientificOperator) => {
      if (displayValue === "Error" || displayValue.startsWith("Error:")) return;
      const operand = parseFloat(displayValue);
      if (isNaN(operand) && operation !== "rand" && operation !== "e_const") { // rand and e_const don't need an operand
        setDisplayValue("Error: Invalid Input");
        onCalculationComplete("Error: Invalid Input");
        return;
      }

      let result: number | string;
      const op1 = (operation === "rand" || operation === "e_const") ? null : operand; // op1 is null for constants/rand
      let opType: OperationType = "unary";

      if (operation === "percent" && firstOperand !== null && operator && !waitingForSecondOperand) {
        const percentValue = firstOperand * (operand / 100); // Calculate percentage of the first operand
        setDisplayValue(String(percentValue));
        setWaitingForSecondOperand(false); // Result replaces second operand
        onCalculationComplete(percentValue, firstOperand, `${operator} then %`, operand, "binary");
        return;
      } else if (operation === "e_const") {
          result = Math.E;
          opType = "constant";
      } else {
        result = performScientificCalculation(operand, operation);
      }

      const resultString = String(result);
      setDisplayValue(resultString);
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      setPrevCalculation(null);
      onCalculationComplete(result, op1, operation, null, opType);
    }, [displayValue, firstOperand, operator, waitingForSecondOperand, onCalculationComplete]);

  // Function to directly set the display (e.g., for constants like Pi)
  const setDisplayDirectly = useCallback((value: string) => {
      setDisplayValue(value);
      setWaitingForSecondOperand(false); // Allow overwriting or appending
      setPrevCalculation(null);
      setFirstOperand(null); // Clear pending operations when a constant is pressed
      setOperator(null);
      onCalculationComplete(parseFloat(value), null, "constant_input", null, "constant");
    }, [onCalculationComplete]);

    // TO WORK LATER: Add memory functions and EE handling
    // const [memory, setMemory] = useState<number>(0);
    // const memoryClear = () => setMemory(0);
    // const memoryAdd = () => setMemory(memory + parseFloat(displayValue));
    // const memorySubtract = () => setMemory(memory - parseFloat(displayValue));
    // const memoryRecall = () => setDisplayValue(String(memory));

  return {  // Return state and handlers
    displayValue,
    inputDigit,
    inputDecimal,
    clearAll,
    handleOperator,
    handleEquals,
    handleToggleSign,
    handleUnary, // Use this for scientific functions and %
    setDisplayDirectly, // For constants
    // To-dos later: memoryClear, memoryAdd, memorySubtract, memoryRecall,
  };
};
