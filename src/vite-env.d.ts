/// <reference types="vite/client" />

// Type definitions for CSS modules
interface CSSModuleClasses {
  [key: string]: string;
}

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}

// For SVG imports
interface SvgrComponent extends React.FC<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const content: string;
  export const ReactComponent: SvgrComponent;
  export default content;
}

// For image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// For CSS imports
declare module '*.css';
declare module '*.scss';

// For React components
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
