import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
//import React from "react";

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

const swirl = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1.5) rotate(360deg); }
`;

const characters = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "+", "-", "×", "÷", "?", "=", "√", "%",
  "sin", "cos", "tan", "log", "ln", "π", "e",
  "!", "±", "∫", "∑", "∞", "x²", "x³", "xⁿ",
  "x!", "y√x", "∛x", "∜x", "∝", "∠", "∫dx", "∑n",
];

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
  opacity: 0.1;
`;

const FloatingCharacter = styled.div<{
  left: number;
  top: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}>`
  position: absolute;
  left: ${(props) => props.left}%;
  top: ${(props) => props.top}%;
  font-size: ${1 + Math.random() * 2}rem;
  color: ${(props) => props.color};
  transform: rotate(${(props) => props.rotation}deg);
  animation: ${float} ${(props) => props.duration}s infinite ${(props) => props.delay}s linear;
  transition: all 0.3s ease;

  &:hover {
    animation: ${swirl} 0.5s ease-out forwards;
    cursor: pointer;
    opacity: 0.5;
    z-index: 1;
  }
`;

const AnimatedBackground = () => {
  return (
    <BackgroundContainer>
      {characters.map((char, index) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 5;
        const duration = 10 + Math.random() * 20;
        const color = `hsl(${Math.random() * 360}, 70%, 80%)`;

        return (
          <FloatingCharacter
            key={index}
            left={left}
            top={top}
            rotation={rotation}
            delay={delay}
            duration={duration}
            color={color}
          >
            {char}
            </FloatingCharacter>
        );
      })}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
