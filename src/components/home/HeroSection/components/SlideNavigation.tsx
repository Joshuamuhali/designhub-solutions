import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({ onPrev, onNext }) => (
  <>
    <button
      aria-label="Previous slide"
      onClick={onPrev}
      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors"
    >
      <ChevronLeft size={20} className="text-white" />
    </button>

    <button
      aria-label="Next slide"
      onClick={onNext}
      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors"
    >
      <ChevronRight size={20} className="text-white" />
    </button>
  </>
);
