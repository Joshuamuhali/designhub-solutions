import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Globe, 
  BarChart3, 
  ShieldCheck, 
  Star, 
  Zap,
  Activity,
  Users,
  Layers,
  ChevronRight
} from "lucide-react";
import heroDashboardImg from "@/assets/hero-dashboard.png";

export function Hero() {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'systems'>('overview');

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden border-b border-border">
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Business, Digital & Growth Solutions</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.08]">
              Build Better. <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Grow Smarter.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              We help businesses build, market, sell and operate better — from professional branding and websites to custom software, marketing, sales teams, and business growth solutions.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-xl rounded-xl text-base px-8 py-6 transition-all hover:scale-105"
              >
                <Link to="/solutions" className="flex items-center justify-center gap-2">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto font-bold rounded-xl text-base px-8 py-6 border-2 border-border/80 hover:border-primary transition-all"
              >
                <Link to="/project-consultation">
                  Book a Consultation
                </Link>
              </Button>
            </div>

            {/* Trust Proof Badges */}
            <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>50+ Businesses Served</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zambia-Based Partner</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - VISUAL SHOWCASE MOCKUP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            {/* Outer Glow Wrapper */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Browser Window Mockup Frame */}
              <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden p-2 sm:p-3 relative group">
                
                {/* Browser Top Controls */}
                <div className="flex items-center justify-between pb-3 px-3 border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  
                  <div className="px-3 py-1 bg-muted/80 rounded-md text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 border border-border/40">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>designhub.co.zm/growth-platform</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="hidden sm:inline">LIVE PLATFORM</span>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-xl my-2 border border-border/40">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'overview'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Growth Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('crm')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'crm'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sales CRM</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('systems')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'systems'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-purple-500" />
                    <span>Software Systems</span>
                  </button>
                </div>

                {/* Live Content Display */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950">
                  <img 
                    src={heroDashboardImg} 
                    alt="Designhub Growth Dashboard"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Dynamic Metrics Overlay based on active tab */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between shadow-xl">
                    <AnimatePresence mode="wait">
                      {activeTab === 'overview' && (
                        <motion.div 
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between w-full"
                        >
                          <div>
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Total Client Growth Value</div>
                            <div className="text-lg font-black">K185,400 <span className="text-xs text-emerald-400 font-bold">+34% this month</span></div>
                          </div>
                          <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                            Active Campaign
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'crm' && (
                        <motion.div 
                          key="crm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between w-full"
                        >
                          <div>
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">CRM Sales Pipeline</div>
                            <div className="text-lg font-black">42 Qualified Leads <span className="text-xs text-blue-400 font-bold">12 Closed Won</span></div>
                          </div>
                          <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30">
                            Sales Team Live
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'systems' && (
                        <motion.div 
                          key="systems"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between w-full"
                        >
                          <div>
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Custom Software & Stock System</div>
                            <div className="text-lg font-black">99.9% Operational <span className="text-xs text-purple-400 font-bold">Auto Syncing</span></div>
                          </div>
                          <div className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/30">
                            Systems Operational
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-card/95 border border-border shadow-2xl backdrop-blur-md z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-muted-foreground uppercase">Average ROI</div>
                  <div className="text-sm font-black text-foreground">+142% Customer Growth</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-card/95 border border-border shadow-2xl backdrop-blur-md z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-muted-foreground uppercase">Verified Partner</div>
                  <div className="text-sm font-black text-foreground">Build • Market • Sell • Systems</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
