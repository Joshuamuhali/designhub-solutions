import React from 'react';

export const LShapeDesign: React.FC = () => (
  <div className="absolute right-0 top-0 w-1/3 h-full pointer-events-none">
    <div className="absolute right-0 top-0 w-full h-1/2 bg-gradient-to-l from-blue-600/20 to-transparent clip-path-l-shape"></div>
    <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-t from-green-600/20 to-transparent clip-path-l-shape-vertical"></div>
  </div>
);
