import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Rocket, Palette, Globe, Cpu, Megaphone, TrendingUp, BarChart3, HelpCircle, ShieldCheck, Layers, Award, Sparkles, Building2, Users } from "lucide-react";
import { ProductFinder } from "@/components/home/ProductFinder";
import { PRODUCT_CATEGORIES, PRODUCTS, PACKAGE_BUNDLES } from "@/data/products";

const categoryIcons: Record<string, any> = {
  start: Rocket,
  brand: Palette,
  digital: Globe,
  systems: Cpu,
  market: Megaphone,
  sales: TrendingUp,
  grow: BarChart3,
};

export default function Index() {
  const featuredProducts = PRODUCTS.filter((p) => p.popular || p.featured).slice(0, 8);

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden border-b border-border">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Business, Digital & Growth Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Build Better. <br className="hidden sm:inline" />
              <span className="text-primary bg-gradient-to-r from-primary via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Grow Smarter.
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
              We help businesses build, market, sell and operate better — from professional branding and websites to custom software, marketing, sales teams, and business growth solutions.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold shadow-lg rounded-xl text-base px-8 py-6"
              >
                <Link to="/solutions" className="flex items-center gap-2">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto font-bold rounded-xl text-base px-8 py-6 border-2"
              >
                <Link to="/project-consultation">
                  Book a Consultation
                </Link>
              </Button>
            </div>

            {/* Micro proof badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted-foreground border-t border-border/50 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>50+ Businesses Served</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zambia-Based Execution</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT FINDER */}
      <ProductFinder />

      {/* 3. PROBLEM SECTION */}
      <section className="py-20 bg-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full pointer-events-none" />

            <div className="space-y-6">
              <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full">
                Business Diagnosis
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Your business problem may be bigger than you think.
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  You may think you need a website — but perhaps the real problem is getting customers.
                </p>
                <p>
                  You may think you need more advertising — but perhaps your real problem is your sales process.
                </p>
                <p>
                  You may think you need more employees — but perhaps your business needs better systems first.
                </p>
                <p className="font-semibold text-foreground pt-2">
                  That's why we don't just sell one generic service. We look at what your business actually needs and help you build the right solution.
                </p>
              </div>

              <div className="pt-4">
                <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl">
                  <a href="#how-we-work" className="flex items-center gap-2">
                    <span>See How We Work</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION ARCHITECTURE ("OUR SOLUTIONS") */}
      <section className="py-24 bg-muted/20 border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              7 Core Solution Verticals
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Our Solution Architecture
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              A business can enter through any solution. Designhub connects strategy, branding, digital, software systems, marketing, sales, and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCT_CATEGORIES.map((cat, index) => {
              const Icon = categoryIcons[cat.id] || Globe;
              const isSystemsOrSales = cat.id === 'systems' || cat.id === 'sales';

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className={`p-8 rounded-2xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ${
                    isSystemsOrSales ? "border-primary/50 ring-2 ring-primary/10 bg-primary/[0.02]" : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 bg-muted text-foreground text-xs font-extrabold uppercase tracking-widest rounded-full">
                        {cat.name}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-foreground mb-2">
                      {cat.title}
                    </h3>

                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      "{cat.headline}"
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-between font-bold rounded-xl group"
                  >
                    <Link to={`/solutions?category=${cat.id}`}>
                      <span>Browse {cat.name} Products</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. POPULAR BUSINESS SOLUTIONS SHOWCASE */}
      <section className="py-24 bg-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                Standardized Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Popular Business Solutions
              </h2>
              <p className="text-muted-foreground text-base">
                Clear deliverables with starting prices. No hidden fees or confusing jargon.
              </p>
            </div>

            <Button size="lg" asChild className="shrink-0 font-bold rounded-xl">
              <Link to="/solutions" className="flex items-center gap-2">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-muted text-muted-foreground">
                      {prod.categoryName}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {prod.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground mb-2">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {prod.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  asChild
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5"
                >
                  <a
                    href={`https://wa.me/0974399695?text=${encodeURIComponent(prod.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Get Started
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPLETE BUSINESS PACKAGES */}
      <section className="py-24 bg-slate-950 text-white border-b border-slate-800">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Integrated Packages
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Complete Business Bundles
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Individual products provide quick entry points. Packages combine tools, marketing, websites, and systems to scale transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGE_BUNDLES.slice(0, 3).map((bundle) => (
              <div
                key={bundle.id}
                className={`p-8 rounded-3xl bg-slate-900 border flex flex-col justify-between space-y-8 ${
                  bundle.popular ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl" : "border-slate-800"
                }`}
              >
                <div>
                  {bundle.popular && (
                    <span className="inline-block mb-3 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                      Most Recommended
                    </span>
                  )}
                  <h3 className="text-2xl font-extrabold text-white">{bundle.name}</h3>
                  <div className="text-3xl font-black text-emerald-400 mt-2">{bundle.price}</div>
                  <p className="text-xs font-bold text-slate-300 mt-2">{bundle.tagline}</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{bundle.description}</p>

                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Package Inclusions:</div>
                    {bundle.inclusions.map((inc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild size="lg" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl">
                  <a
                    href={`https://wa.me/0974399695?text=${encodeURIComponent(`Hi Designhub! I'm interested in the ${bundle.name} package (${bundle.price}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{bundle.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW WE WORK (6-STEP PROCESS) */}
      <section id="how-we-work" className="py-24 bg-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              Execution Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              We don't just give advice. <br />
              <span className="text-primary">We help make it happen.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Our 6-stage operational framework ensures we diagnose the real problem before building and managing the solution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: "01", title: "UNDERSTAND", desc: "We learn about your business, operations, and growth goals." },
              { num: "02", title: "DIAGNOSE", desc: "We identify the actual problem holding your revenue or team back." },
              { num: "03", title: "PLAN", desc: "We recommend the exact product, website, or system required." },
              { num: "04", title: "BUILD", desc: "We design and create the required digital product or software system." },
              { num: "05", title: "IMPLEMENT", desc: "We put the solution into active operation alongside your team." },
              { num: "06", title: "MANAGE", desc: "We support and improve performance as your business scales." },
            ].map((step) => (
              <div key={step.num} className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all space-y-4">
                <span className="text-4xl font-black text-primary/40 block">
                  {step.num}
                </span>
                <h3 className="text-xl font-extrabold text-foreground tracking-wide">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY DESIGNHUB */}
      <section className="py-24 bg-muted/30 border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              The Designhub Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Why Ambitious Businesses Choose Designhub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Practical Solutions", desc: "We focus on real solutions your business can actually implement and use daily." },
              { title: "One Business Partner", desc: "Branding, websites, digital marketing, sales teams, and software under one roof." },
              { title: "Built for Real Businesses", desc: "Practical execution tailored for Zambian startups, SMEs, and expanding companies." },
              { title: "We Build, Not Just Advise", desc: "When you need more than a recommendation document, we build and implement it." },
              { title: "Simple Communication", desc: "No complex corporate jargon. Clear deliverables, transparent prices, and clear steps." },
              { title: "Long-Term Support", desc: "We stay involved after initial project launch to manage ongoing business growth." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h3 className="text-lg font-extrabold text-foreground">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="section-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Build Better and Grow Smarter?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto font-medium">
            Book a consultation or Business Check-Up to discover what your business needs to move forward.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto font-extrabold text-base px-8 py-6 rounded-xl shadow-lg">
              <Link to="/project-consultation">
                Book a Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto font-bold text-base px-8 py-6 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/solutions">
                Explore Solution Catalog
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
