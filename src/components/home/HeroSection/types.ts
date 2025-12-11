export interface Slide {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    label: string;
    to: string;
  };
  secondaryCTA: {
    label: string;
    to: string;
  };
  image: string;
  shapes: string[];
  carouselImages: string[];
}

export interface CarouselItemProps {
  image: string;
  alt: string;
}

export interface LShapeDesignProps {
  className?: string;
}

export interface HeroSectionProps {
  slides?: Slide[];
  autoplaySpeed?: number;
}
