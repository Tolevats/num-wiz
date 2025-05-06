import React from "react";
import { useCalculatorLogic, UseCalculatorLogicProps } from "../hooks/useCalculatorLogic"; // Import hook and types
import "./ScientificCalculator.css";

// Props expected by ScientificCalculator (just the callback)
interface ScientificCalculatorProps {
  onCalculationComplete: UseCalculatorLogicProps["onCalculationComplete"]; // Get type from hook
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onCalculationComplete }) => {
  // Use the custom hook, getting all handlers including scientific ones
  const {
    displayValue,
    inputDigit,
    inputDecimal,
    clearAll,
    handleOperator,
    handleEquals,
    handleToggleSign,
    handleUnary, // Use this for scientific functions AND %
    setDisplayDirectly, // Use this for constants like Pi
  } = useCalculatorLogic({ onCalculationComplete });

  return (
    // Scientific Calculator Container (5 columns)
    <div className="calculator-container scientific-calc bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6 rounded-lg shadow-xl mx-auto max-w-md">
      {/* Display Screen (same as basic) */}
      <div className="display bg-gray-800 bg-opacity-90 text-white text-right p-4 rounded-md mb-4 shadow-inner min-h-[4.5rem] flex items-end justify-end">
        <div
          className="output text-3xl sm:text-4xl font-mono break-all"
          role="textbox"
          aria-readonly="true"
          aria-live="polite"
          style={{ wordBreak: "break-all" }}
        >
          {displayValue === 'Error'
            ? <span className="text-red-400">{displayValue}</span>
            : (displayValue.length > 15 ? parseFloat(displayValue).toExponential(8) : displayValue.length > 9 ? parseFloat(displayValue).toLocaleString('en-US', { maximumFractionDigits: 8 }) : displayValue)
          }
        </div>
      </div>

       {/* Scientific Calculator Buttons Grid (5 columns) */}
       <div className="buttons grid grid-cols-5 gap-2">
            {/* --- Scientific Column --- */}
            <button onClick={() => handleUnary('sin')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Sine">sin</button>
            <button onClick={() => handleUnary('cos')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Cosine">cos</button>
            <button onClick={() => handleUnary('tan')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Tangent">tan</button>
            <button onClick={() => handleUnary('ln')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Natural Logarithm">ln</button>
            <button onClick={() => handleUnary('log')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Logarithm base 10">log</button>

            {/* --- Standard Columns --- */}
            {/* Row 1 */}
            <button onClick={clearAll} className="btn bg-rose-300 hover:bg-rose-400 text-black font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-rose-500" aria-label="All Clear">AC</button>
            <button onClick={handleToggleSign} className="btn bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-500" aria-label="Toggle Sign">+/-</button>
            <button onClick={() => handleUnary('%')} className="btn bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-500" aria-label="Percent">%</button>
            <button onClick={() => handleOperator('÷')} className="btn operator bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-amber-700" aria-label="Divide">÷</button>
            {/* Row 2 */}
            <button onClick={() => handleUnary('sqrt')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Square Root">√</button>
            <button onClick={() => inputDigit('7')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">7</button>
            <button onClick={() => inputDigit('8')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">8</button>
            <button onClick={() => inputDigit('9')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">9</button>
            <button onClick={() => handleOperator('×')} className="btn operator bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-amber-700" aria-label="Multiply">×</button>
            {/* Row 3 */}
            <button onClick={() => handleUnary('exp')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Exponent e">eˣ</button>
            <button onClick={() => inputDigit('4')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">4</button>
            <button onClick={() => inputDigit('5')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">5</button>
            <button onClick={() => inputDigit('6')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">6</button>
            <button onClick={() => handleOperator('-')} className="btn operator bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-amber-700" aria-label="Subtract">−</button>
            {/* Row 4 */}
            <button onClick={() => handleUnary('pow')} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Square">x²</button>
            <button onClick={() => inputDigit('1')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">1</button>
            <button onClick={() => inputDigit('2')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">2</button>
            <button onClick={() => inputDigit('3')} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">3</button>
            <button onClick={() => handleOperator('+')} className="btn operator bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-amber-700" aria-label="Add">+</button>
            {/* Row 5 */}
            <button onClick={() => setDisplayDirectly(String(Math.PI))} className="btn sci bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md shadow focus:ring-2 focus:ring-indigo-600" aria-label="Pi Constant">π</button>
            {/* Zero button now takes 1 column */}
            <button onClick={() => inputDigit('0')} className="btn number col-span-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400">0</button>
            <button onClick={inputDecimal} className="btn number bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-gray-400" aria-label="Decimal Point">.</button>
            <button onClick={handleEquals} className="btn equals bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-md shadow focus:ring-2 focus:ring-emerald-700" aria-label="Equals">=</button>
        </div>
    </div>
);
};

export default ScientificCalculator;