import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Target, Users, ShieldCheck, Cpu, Rocket, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      {/* Hero Header */}
      <section className="py-24 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              About Designhub
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
              We Help Businesses Become <span className="text-primary">Better Businesses.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Combining business thinking with practical execution — helping Zambian companies build, market, sell, systemise and grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Evolution Story Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="section-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Our Journey & Evolution
            </h2>

            <p>
              Designhub started by helping businesses solve digital problems — building websites and managing digital marketing campaigns.
            </p>

            <p>
              Over time, we discovered that the website was rarely the whole problem.
            </p>

            <p className="p-6 rounded-2xl bg-card border border-border text-foreground font-semibold">
              Businesses needed better branding, stronger marketing, better sales processes, better operational systems, better management, and clearer growth strategies.
            </p>

            <p>
              That led Designhub to evolve into a full <strong className="text-foreground">business, digital and growth solutions company</strong>.
            </p>

            <p>
              Today, we don't only advise. We can plan it, build it, implement it, and manage it alongside ambitious business founders and leadership teams.
            </p>
          </div>

          {/* Unified Verified Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div className="p-6 rounded-2xl bg-muted/40 text-center space-y-1 border border-border/50">
              <span className="text-3xl font-black text-primary">50+</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Businesses Served</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/40 text-center space-y-1 border border-border/50">
              <span className="text-3xl font-black text-primary">100+</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Projects Delivered</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/40 text-center space-y-1 border border-border/50">
              <span className="text-3xl font-black text-primary">7</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Solution Verticals</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/40 text-center space-y-1 border border-border/50">
              <span className="text-3xl font-black text-primary">100%</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Zambian Owned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="section-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-4 md:col-span-2">
              <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                Founder & Leadership
              </span>
              <h2 className="text-3xl font-extrabold text-foreground">
                Joshua Muhali
              </h2>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Founder & Technology Director
              </p>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed pt-2">
                <p>
                  Joshua founded Designhub with a focus on solving practical business problems through strategy, digital technology, marketing, and software systems.
                </p>
                <p>
                  With hands-on experience across digital products, software engineering, and sales team structuring, Joshua leads Designhub's commitment to delivering real business performance rather than empty agency promises.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 text-center">
              <Building2 className="w-10 h-10 text-primary mx-auto" />
              <h4 className="text-base font-extrabold text-foreground">Practical Implementation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "We don't believe every business problem is a marketing problem. Our job is to identify what the business actually needs and make it happen."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              Our Values
            </span>
            <h2 className="text-3xl font-extrabold text-foreground">
              What Drives Designhub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "01 — Practical", desc: "We focus on solutions that businesses can actually implement and run daily." },
              { title: "02 — Simple", desc: "We remove unnecessary technical and corporate complexity." },
              { title: "03 — Results", desc: "Our work must create measurable business value and performance." },
              { title: "04 — Professional", desc: "We help businesses present and operate professionally." },
              { title: "05 — Partnership", desc: "We work with businesses as practical implementation partners." },
              { title: "06 — Progress", desc: "We believe businesses should continuously improve and scale." },
            ].map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border bg-card space-y-2">
                <h3 className="text-lg font-extrabold text-foreground">{val.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <Button size="lg" asChild className="font-bold rounded-xl">
              <Link to="/project-consultation" className="flex items-center gap-2">
                <span>Book a Consultation with Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
