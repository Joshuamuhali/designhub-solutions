import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from "react-router-dom";
import { AnimatePresence, motion, easeInOut } from 'framer-motion';
import { PageLoader } from '@/components/ui/loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardRoutes from './pages/dashboard/index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Index from "./pages/Index";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import Work from "./pages/Work";
import Industries from "./pages/Industries";
import Insights from "./pages/Insights";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import ProjectConsultation from "./pages/ProjectConsultation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const slideVariants = {
    initial: { opacity: 0, y: 15 },
    in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeInOut } },
    out: { opacity: 0, y: -15, transition: { duration: 0.2, ease: easeInOut } },
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

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/services" element={<Navigate to="/solutions" replace />} />
      <Route path="/work" element={<Work />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/project-consultation" element={<ProjectConsultation />} />
      
      {/* Auth routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRoutes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm font-extrabold uppercase tracking-wider text-primary">Designhub Solutions</p>
          <p className="text-xs text-muted-foreground">Build Better. Grow Smarter.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
          <AuthProvider>
            <AnimatePresence mode="wait">
              <AnimatedRoute>
                <AppRoutes />
              </AnimatedRoute>
            </AnimatePresence>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
