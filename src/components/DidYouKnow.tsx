import React from "react";
import "./DidYouKnow.css";

// Define the props
interface DidYouKnowProps {
  fact: string | null; // The fact to display, or null if none
  onDismiss: () => void; // Function to call when the user dismisses the fact
}

const DidYouKnow: React.FC<DidYouKnowProps> = ({ fact, onDismiss }) => {
  // If no fact is provided, don't render anything
  if (!fact) {
    return null;
  }

  return (
    // Use a fixed or absolute position overlay, or inline block
    // This version is an inline block appearing below the calculator
    <div
      className="did-you-know-container bg-gradient-to-r from-teal-100 to-blue-100 p-4 rounded-lg shadow-md mt-6 w-full max-w-md mx-auto border border-blue-200"
      role="alert" // Good for accessibility, announces the content
      aria-live="polite" // Announce changes politely
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            💡 Did You Know?
          </h3>
          <p className="text-gray-700">{fact}</p>
        </div>
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-2"
          aria-label="Dismiss fact"
          title="Dismiss fact" // Tooltip
        >
          &times; {/* Simple 'x' close icon */}
        </button>
      </div>
    </div>
  );
};

export default DidYouKnow;
