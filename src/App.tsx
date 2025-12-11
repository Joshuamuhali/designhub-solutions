import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { PageLoader } from '@/components/ui/loading';
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const slideVariants = {
    initial: {
      opacity: 0,
      x: navigationType === 'POP' ? -50 : 50,
    },
    in: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    out: {
      opacity: 0,
      x: navigationType === 'POP' ? 50 : -50,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={slideVariants}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname.split('/')[1]}>
      <Route path="/" element={<AnimatedRoute><Index /></AnimatedRoute>} />
      <Route path="/about" element={<AnimatedRoute><About /></AnimatedRoute>} />
      <Route path="/services" element={<AnimatedRoute><Services /></AnimatedRoute>} />
      <Route path="/faq" element={<AnimatedRoute><FAQ /></AnimatedRoute>} />
      <Route path="/contact" element={<AnimatedRoute><Contact /></AnimatedRoute>} />
      <Route path="*" element={<AnimatedRoute><NotFound /></AnimatedRoute>} />
    </Routes>
  </AnimatePresence>
);

const App = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return <PageLoader message="Welcome to DesignHub" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
