import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slide } from '../types';

interface SlideContentProps {
  slide: Slide;
}

export const SlideContent: React.FC<SlideContentProps> = ({ slide }) => (
  <div className="text-center lg:text-left">
    <motion.h1
      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {slide.title}
    </motion.h1>

    <motion.h2
      className="text-2xl sm:text-3xl font-semibold text-[#00FF1E] mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {slide.subtitle}
    </motion.h2>

    <motion.p
      className="text-lg text-white/90 mb-8 max-w-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {slide.description}
    </motion.p>

    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        asChild
        style={{
          backgroundColor: '#00FF1E',
          color: '#0b0b0b',
          boxShadow: '0 6px 14px rgba(0,255,30,0.12)',
        }}
      >
        <Link to={slide.primaryCTA.to}>
          {slide.primaryCTA.label}
          <ArrowRight size={16} className="inline-block ml-2" />
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
        className="border border-white/20 text-white hover:bg-white/10"
      >
        <Link to={slide.secondaryCTA.to}>
          {slide.secondaryCTA.label}
        </Link>
      </Button>
    </motion.div>
  </div>
);
