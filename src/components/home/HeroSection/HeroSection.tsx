import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import { Slide, HeroSectionProps } from "./types";
import { LShapeDesign } from "./components/LShapeDesign";
import { CarouselItem } from "./components/CarouselItem";
import { SlideContent } from "./components/SlideContent";
import { SlideNavigation } from "./components/SlideNavigation";
import { BackgroundElements } from "./components/BackgroundElements";

const DEFAULT_SLIDES: Slide[] = [
  {
    key: "digital-presence",
    title: "Transform Your Digital Presence",
    subtitle: "Creative Solutions for Modern Businesses",
    description: "We help businesses thrive in the digital world with innovative design and development solutions tailored to your needs.",
    primaryCTA: { label: "Get Started", to: "/contact" },
    secondaryCTA: { label: "Learn More", to: "/about" },
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2070&auto=format&fit=crop",
    shapes: ["circle", "triangle"],
    carouselImages: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559028006-8484420490f9?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    key: "social-marketing",
    title: "Grow Online With Simple, Stress-Free Digital Marketing",
    subtitle: "Reach More Customers Every Day",
    description: "We create content, manage your pages, and run ads to help your business reach more people every day — without confusion or pressure.",
    primaryCTA: { label: "Grow My Socials", to: "/contact" },
    secondaryCTA: { label: "See Marketing Packages", to: "/services" },
    image: "https://images.unsplash.com/photo-1611926653376-d75bda727e33?q=80&w=2070&auto=format&fit=crop",
    shapes: ["hexagon", "square"],
    carouselImages: [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    key: "sales-leads",
    title: "Let Us Help You Get Customers — Not Just 'Likes'",
    subtitle: "Real Results That Matter",
    description: "We run paid ads, generate leads, and even close sales for you — while giving you clear reports you can understand.",
    primaryCTA: { label: "Get More Customers", to: "/contact" },
    secondaryCTA: { label: "Explore Sales Services", to: "/services" },
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop",
    shapes: ["diamond", "circle"],
    carouselImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    key: "systems",
    title: "Smarter Tools for Smoother Business Growth",
    subtitle: "Automate and Scale Your Business",
    description: "From CRM setup to custom web apps, we help you automate work, manage clients, and run your business with ease.",
    primaryCTA: { label: "Build My System", to: "/contact" },
    secondaryCTA: { label: "See All Services", to: "/services" },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    shapes: ["triangle", "hexagon"],
    carouselImages: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559028006-8484420490f9?q=80&w=2070&auto=format&fit=crop"
    ]
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides = DEFAULT_SLIDES,
  autoplaySpeed = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<number>();
  const currentSlide = slides[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  useEffect(() => {
    if (isPaused) return;
    
    autoplayRef.current = window.setTimeout(() => {
      nextSlide();
    }, autoplaySpeed);

    return () => {
      if (autoplayRef.current) {
        window.clearTimeout(autoplayRef.current);
      }
    };
  }, [currentIndex, isPaused, autoplaySpeed]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden min-h-screen flex items-center"
      aria-label="Hero section"
      style={{
        background:
          "linear-gradient(135deg, rgba(36,114,183,0.95) 0%, rgba(36,114,183,0.85) 50%, rgba(0,255,30,0.06) 100%)",
      }}
    >
      <LShapeDesign />
      <BackgroundElements shapes={currentSlide.shapes} />

      <div className="relative z-10 w-full pt-20 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm text-white text-sm font-medium mb-6"
          >
            <Sparkles size={16} className="text-[#00FF1E]" />
            <span>Your Friendly Partner in Digital Growth</span>
          </motion.div>

          <div className="relative mt-6">
            <SlideNavigation onPrev={prevSlide} onNext={nextSlide} />
            
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.key}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  drag="x"
                  dragElastic={0.18}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -80 || info.velocity.x < -500) nextSlide();
                    if (info.offset.x > 80 || info.velocity.x > 500) prevSlide();
                  }}
                  className="px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
                >
                  <SlideContent slide={currentSlide} />
                  
                  <div className="relative space-y-6 lg:col-span-2">
                    <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        className="w-full h-80 sm:h-96 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-xl font-bold">{currentSlide.title.split('—')[0]}</h3>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className="text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-2 text-sm">5.0 (120+ reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {currentSlide.carouselImages.map((img, idx) => (
                        <CarouselItem 
                          key={idx} 
                          image={img} 
                          alt={`${currentSlide.key} ${idx + 1}`} 
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex ? "bg-white scale-110" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-white/80 mt-10 max-w-2xl mx-auto"
          >
            We help businesses grow online with websites, branding, marketing, and sales support — all in a simple,
            approachable way. No techy stress, just results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10"
          >
            {[ 
              { value: "50+", label: "Happy Clients" },
              { value: "100+", label: "Projects Done" },
              { value: "3+", label: "Years Experience" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-bold text-[#00FF1E]">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
