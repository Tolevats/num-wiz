import React from 'react';
import { useCalculatorLogic, UseCalculatorLogicProps } from '../hooks/useCalculatorLogic';
import './ScientificCalculator.css';

interface ScientificCalculatorProps {
    onCalculationComplete: UseCalculatorLogicProps['onCalculationComplete']; // Use imported type
    switchToBasicMode: () => void;
} 

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onCalculationComplete, switchToBasicMode }) => {
    const {
        displayValue, inputDigit, inputDecimal, clearAll,
        handleOperator, handleEquals, handleToggleSign, handleUnary, setDisplayDirectly
    } = useCalculatorLogic({ onCalculationComplete });

    // Button configurations for the 10x5 grid (macOS like)
    const buttonConfigs = [
        // Row 1
        { label: '(', op: '(', type: 'placeholder', aria: 'Open Parenthesis', styleClass: 'sci-function-btn' },
        { label: ')', op: ')', type: 'placeholder', aria: 'Close Parenthesis', styleClass: 'sci-function-btn' },
        { label: 'mc', op: 'mc', type: 'memory_placeholder', aria: 'Memory Clear', styleClass: 'sci-function-btn' },
        { label: 'm+', op: 'm+', type: 'memory_placeholder', aria: 'Memory Add', styleClass: 'sci-function-btn' },
        { label: 'm-', op: 'm-', type: 'memory_placeholder', aria: 'Memory Subtract', styleClass: 'sci-function-btn' },
        { label: 'mr', op: 'mr', type: 'memory_placeholder', aria: 'Memory Recall', styleClass: 'sci-function-btn' },
        { label: 'AC', op: 'clear', type: 'clear', aria: 'All Clear', styleClass: 'bg-slate-300 hover:bg-slate-400 text-black' },
        { label: '+/-', op: 'toggle_sign', type: 'toggle_sign', aria: 'Toggle Sign', styleClass: 'bg-slate-300 hover:bg-slate-400 text-black' },
        { label: '%', op: 'percent', type: 'unary', aria: 'Percent', styleClass: 'bg-slate-300 hover:bg-slate-400 text-black' },
        { label: '÷', op: '/', type: 'operator', aria: 'Divide', styleClass: 'operator-btn' },
        // Row 2
        { label: '2nd', op: '2nd', type: 'toggle_placeholder', aria: 'Second Functions', styleClass: 'sci-function-btn' },
        { label: 'x²', op: 'pow', type: 'unary', aria: 'Square', styleClass: 'sci-function-btn' },
        { label: 'x³', op: 'pow3', type: 'unary', aria: 'Cube', styleClass: 'sci-function-btn' },
        { label: 'xʸ', op: 'powy', type: 'binary_placeholder', aria: 'X to the Power of Y', styleClass: 'sci-function-btn' },
        { label: 'eˣ', op: 'exp', type: 'unary', aria: 'Euler\'s number to the power of X', styleClass: 'sci-function-btn' },
        { label: '10ˣ', op: 'ten_pow_x', type: 'unary', aria: '10 to the power of X', styleClass: 'sci-function-btn' },
        { label: '7', op: '7', type: 'digit', aria: '7', styleClass: 'number-btn' },
        { label: '8', op: '8', type: 'digit', aria: '8', styleClass: 'number-btn' },
        { label: '9', op: '9', type: 'digit', aria: '9', styleClass: 'number-btn' },
        { label: '×', op: '*', type: 'operator', aria: 'Multiply', styleClass: 'operator-btn' },
        // Row 3
        { label: '¹/ₓ', op: 'one_div_x', type: 'unary', aria: 'Reciprocal', styleClass: 'sci-function-btn' },
        { label: '√x', op: 'sqrt', type: 'unary', aria: 'Square Root', styleClass: 'sci-function-btn' },
        { label: '³√x', op: 'cbrt', type: 'unary', aria: 'Cube Root', styleClass: 'sci-function-btn' },
        { label: 'ʸ√x', op: 'ysqrtx', type: 'binary_placeholder', aria: 'Yth root of X', styleClass: 'sci-function-btn' },
        { label: 'ln', op: 'ln', type: 'unary', aria: 'Natural Logarithm', styleClass: 'sci-function-btn' },
        { label: 'log₁₀', op: 'log', type: 'unary', aria: 'Logarithm base 10', styleClass: 'sci-function-btn' },
        { label: '4', op: '4', type: 'digit', aria: '4', styleClass: 'number-btn' },
        { label: '5', op: '5', type: 'digit', aria: '5', styleClass: 'number-btn' },
        { label: '6', op: '6', type: 'digit', aria: '6', styleClass: 'number-btn' },
        { label: '-', op: '-', type: 'operator', aria: 'Subtract', styleClass: 'operator-btn' },
        // Row 4
        { label: 'x!', op: 'fact', type: 'unary', aria: 'Factorial', styleClass: 'sci-function-btn' },
        { label: 'sin', op: 'sin', type: 'unary', aria: 'Sine', styleClass: 'sci-function-btn' },
        { label: 'cos', op: 'cos', type: 'unary', aria: 'Cosine', styleClass: 'sci-function-btn' },
        { label: 'tan', op: 'tan', type: 'unary', aria: 'Tangent', styleClass: 'sci-function-btn' },
        { label: 'e', op: 'e_const', type: 'unary', aria: 'Euler\'s Number', styleClass: 'sci-function-btn' },
        { label: 'EE', op: 'EE', type: 'input_placeholder', aria: 'Exponent Entry', styleClass: 'sci-function-btn' },
        { label: '1', op: '1', type: 'digit', aria: '1', styleClass: 'number-btn' },
        { label: '2', op: '2', type: 'digit', aria: '2', styleClass: 'number-btn' },
        { label: '3', op: '3', type: 'digit', aria: '3', styleClass: 'number-btn' },
        { label: '+', op: '+', type: 'operator', aria: 'Add', styleClass: 'operator-btn' },
        // Row 5
        { label: 'Basic', op: 'toggle_basic', type: 'custom_action', action: switchToBasicMode, aria: 'Switch to Basic Mode', styleClass: 'basic-mode-btn-sci' },
        { label: 'sinh', op: 'sinh', type: 'unary', aria: 'Hyperbolic Sine', styleClass: 'sci-function-btn' },
        { label: 'cosh', op: 'cosh', type: 'unary', aria: 'Hyperbolic Cosine', styleClass: 'sci-function-btn' },
        { label: 'tanh', op: 'tanh', type: 'unary', aria: 'Hyperbolic Tangent', styleClass: 'sci-function-btn' },
        { label: 'π', op: 'pi_const', type: 'direct_display', value: String(Math.PI), aria: 'Pi Constant', styleClass: 'sci-function-btn' },
        { label: 'Rand', op: 'rand', type: 'unary', aria: 'Random Number', styleClass: 'sci-function-btn' },
        { label: '0', op: '0', type: 'digit', aria: '0', styleClass: 'number-btn col-span-2' }, // Spans 2 columns
        { label: '.', op: '.', type: 'decimal', aria: 'Decimal Point', styleClass: 'number-btn' },
        { label: '=', op: 'equals', type: 'equals', aria: 'Equals', styleClass: 'operator-btn' },
    ];

    const renderButton = (btnConfig: any, index: number | string) => {
        let actionFunc = () => console.warn("Placeholder action for:", btnConfig.op);
        if (btnConfig.type === 'unary') actionFunc = () => handleUnary(btnConfig.op);
        else if (btnConfig.type === 'digit') actionFunc = () => inputDigit(btnConfig.op);
        else if (btnConfig.type === 'operator') actionFunc = () => handleOperator(btnConfig.op);
        else if (btnConfig.type === 'clear') actionFunc = clearAll;
        else if (btnConfig.type === 'toggle_sign') actionFunc = handleToggleSign;
        else if (btnConfig.type === 'decimal') actionFunc = inputDecimal;
        else if (btnConfig.type === 'equals') actionFunc = handleEquals;
        else if (btnConfig.type === 'direct_display' && btnConfig.value) actionFunc = () => setDisplayDirectly(btnConfig.value);
        else if (btnConfig.type === 'custom_action' && btnConfig.action) actionFunc = btnConfig.action;

        const baseSciBtnClass = 'sci-btn focus:ring-2 focus:ring-offset-1 focus:ring-pink-500 focus:ring-offset-gray-800';
        return (
            <button
                key={`${btnConfig.label}-${index}`}
                onClick={actionFunc}
                className={`${baseSciBtnClass} ${btnConfig.styleClass || 'sci-function-btn'}`}
                aria-label={btnConfig.aria}
            >
                {btnConfig.label}
            </button>
        );
    };

    return (
        <div className="scientific-calculator-container">
            <div className="sci-display">
                <div className="sci-output" role="textbox" aria-readonly="true" aria-live="polite">
                    {displayValue === 'Error' || displayValue.startsWith("Error:")
                        ? <span className="text-red-400">{displayValue}</span>
                        : (displayValue.length > 18 && !displayValue.includes('E') ? parseFloat(displayValue).toExponential(10) : displayValue.length > 12 && !displayValue.includes('E') ? parseFloat(displayValue).toLocaleString('en-US', { maximumFractionDigits: 10 }) : displayValue)
                    }
                </div>
            </div>
            <div className="sci-buttons-grid">
                {buttonConfigs.map(renderButton)}
            </div>
        </div>
    );
};
export default ScientificCalculator;