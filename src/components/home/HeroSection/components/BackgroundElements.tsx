import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundElementsProps {
  shapes: string[];
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({ shapes }) => {
  const shapeClasses: Record<string, string> = {
    circle: "rounded-full",
    triangle: "clip-triangle",
    hexagon: "clip-hexagon",
    square: "rounded-lg",
    diamond: "clip-diamond"
  };
  
  const positions = [
    { top: "10%", left: "5%" },
    { top: "60%", right: "10%" },
    { bottom: "15%", left: "15%" },
    { top: "30%", right: "20%" }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>
      <div className="absolute right-0 bottom-0 w-full h-1/3 bg-gradient-to-t from-green-600/10 to-transparent"></div>
      
      {shapes.map((shape, i) => (
        <motion.div
          key={`${shape}-${i}`}
          className={`absolute w-24 h-24 bg-gradient-to-br from-blue-400/20 to-green-400/20 backdrop-blur-sm ${shapeClasses[shape]}`}
          style={positions[i % positions.length]}
          animate={{
            scale: [1, 1.2, 1],
            rotate: shape === "diamond" ? [0, 45, 0] : [0, 180, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-[rgba(0,255,30,0.12)] rounded-full blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[rgba(36,114,183,0.08)] rounded-full blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
