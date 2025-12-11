// src/components/ui/l-shape.tsx
import * as React from 'react';

interface LShapeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  color?: string;
  rotate?: number;
}

export const LShape = React.forwardRef<HTMLDivElement, LShapeProps>(
  ({ size = 100, color = 'currentColor', rotate = 0, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{
          width: size,
          height: size,
          color,
          transform: `rotate(${rotate}deg)`,
          ...style,
        }}
        {...props}
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 60% 100%, 60% 40%, 0% 40%)',
            backgroundColor: 'currentColor',
          }}
        />
      </div>
    );
  }
);

LShape.displayName = 'LShape';

export const LShapeOutline = React.forwardRef<HTMLDivElement, LShapeProps & { strokeWidth?: number }>(
  ({ size = 100, color = 'currentColor', rotate = 0, strokeWidth = 2, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{
          width: size,
          height: size,
          color,
          transform: `rotate(${rotate}deg)`,
          ...style,
        }}
        {...props}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          <path
            d={`M0,0 L${size},0 L${size},${size} L${size * 0.6},${size} L${size * 0.6},${size * 0.4} L0,${size * 0.4} Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
);

LShapeOutline.displayName = 'LShapeOutline';