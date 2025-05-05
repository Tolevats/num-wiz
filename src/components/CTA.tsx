import React, { useEffect, useState } from "react";
import "./CTA.css";

const CTA: React.FC = () => {
  const [bouncingNumbers, setBouncingNumbers] = useState<number[]>([]);

  // Generate random numbers for bouncing animation
  useEffect(() => {
    const numbers = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    );
    setBouncingNumbers(numbers);
  }, []);

  return (
    <section className="cta-section">
      {bouncingNumbers.map((num, index) => (
        <span
          key={index}
          className="bouncing-number"
          style={{
            animationDelay: `${index * 0.1}s`,
            left: `${10 + index * 10}%`,
          }}
        >
          {num}
        </span>
      ))}
      <div className="cta-content">
        <h2 className="cta-title">
          <span className="bouncing-text">Get Your Numbers Right</span>
          <span className="fade-text">The Fun Way!</span>
        </h2>
      </div>
    </section>
  );
};

export default CTA;
