import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { LShape, LShapeOutline } from './ui/l-shape';

// Stock image URLs (replace with your actual image URLs or import local images)
const HERO_IMAGES = {
  main: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop',
  secondary: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
  shape: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
};

const fadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (i: number = 0) => ({
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.1
    }
  })
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30 min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] opacity-20">
          <LShape 
            size={800}
            color="#3b82f6"
            className="opacity-20"
            rotate={15}
          />
        </div>
        
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] opacity-10">
          <LShape 
            size={600}
            color="#8b5cf6"
            className="opacity-20"
            rotate={-15}
          />
        </div>
        
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10">
          <LShapeOutline 
            size={256}
            color="#3b82f6"
            strokeWidth={2}
            rotate={45}
          />
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              custom={0}
              variants={fadeIn} 
              className="relative inline-block"
            >
              <span className="px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Transform Your Digital Presence
              </span>
            </motion.div>
            
            <motion.h1 
              custom={1}
              variants={fadeIn}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Creative Solutions for <span className="text-primary">Modern</span> Businesses
            </motion.h1>
            
            <motion.p 
              custom={2}
              variants={fadeIn}
              className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0"
            >
              We help businesses thrive in the digital world with innovative design and development solutions tailored to your needs.
            </motion.p>
            
            <motion.div 
              custom={3}
              variants={fadeIn}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                Learn More
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            
            <motion.div 
              custom={4}
              variants={fadeIn}
              className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground lg:justify-start"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-foreground/10"
                    style={{
                      backgroundImage: `url(https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}0.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ))}
              </div>
              <span>Trusted by 1000+ businesses worldwide</span>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { 
                delay: 0.2,
                duration: 0.8,
                ease: "easeOut" 
              } 
            }}
          >
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={HERO_IMAGES.main} 
                alt="Team collaboration"
                className="object-cover w-full h-auto aspect-[4/3] sm:aspect-video md:aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/3] rounded-2xl"
              />
              
              {/* Floating shape with image */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <div className="relative w-full h-full">
                  <LShape 
                    size={256}
                    color="#3b82f6"
                    className="absolute inset-0 w-full h-full"
                    rotate={15}
                  />
                  <div className="absolute inset-0 overflow-hidden rounded-2xl m-2">
                    <img 
                      src={HERO_IMAGES.shape} 
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats card */}
              <div className="absolute bottom-6 left-6 p-4 bg-background/90 backdrop-blur-sm rounded-xl shadow-lg max-w-[200px]">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full" />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -z-10 -top-8 -left-8 w-32 h-32 opacity-50">
              <LShapeOutline 
                size={128}
                color="#8b5cf6"
                strokeWidth={2}
                rotate={-15}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
