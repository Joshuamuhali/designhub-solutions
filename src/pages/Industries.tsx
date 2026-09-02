import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Store, Building, Building2, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";

interface IndustryItem {
  id: string;
  name: string;
  headline: string;
  tagline: string;
  description: string;
  icon: any;
  recommendedProducts: string[];
}

const industries: IndustryItem[] = [
  {
    id: "startups",
    name: "Startups & New Ventures",
    headline: "Start your business professionally from day one.",
    tagline: "Build a solid foundation",
    description: "For founders who want to establish credibility immediately with tenders, investors, and early clients.",
    icon: Rocket,
    recommendedProducts: [
      "Business Starter Package (From K3,500)",
      "Logo Package (From K1,500)",
      "Company Profile (From K1,500)",
      "Starter Website (K5,000)",
    ],
  },
  {
    id: "small-businesses",
    name: "Small Businesses & Retail",
    headline: "Build a stronger business without making things complicated.",
    tagline: "Get online & manage sales",
    description: "Practical tools for local stores, service providers, and traders needing more customers and organized records.",
    icon: Store,
    recommendedProducts: [
      "Professional Website (K7,500)",
      "Social Media Starter (K850/mo)",
      "Inventory Management System (From K10,000)",
      "Business Check-Up (K2,500)",
    ],
  },
  {
    id: "growing-smes",
    name: "Growing SMEs",
    headline: "Put better systems, sales, and marketing behind your growth.",
    tagline: "Scale operations & revenue",
    description: "For expanding mid-tier companies experiencing operational friction or needing structured sales management.",
    icon: Building,
    recommendedProducts: [
      "Customer Management System / CRM (From K10,000)",
      "Marketing Growth Package (K1,500/mo)",
      "Build Your Sales Team (From K5,000)",
      "Business Growth Plan (From K5,000)",
    ],
  },
  {
    id: "established-companies",
    name: "Established Companies",
    headline: "Improve performance, modernize operations, and build for scale.",
    tagline: "Modernize & optimize",
    description: "For established businesses looking to replace legacy manual work with custom software automation and dedicated sales teams.",
    icon: Building2,
    recommendedProducts: [
      "Advanced E-Commerce & Web Portals (From K15,000)",
      "Sales Operations Management (From K3,500/mo)",
      "Custom Business Software (Custom Quote)",
      "Business Management Partnership (Retainer)",
    ],
  },
];

export default function Industries() {
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              Industry & Business Audience Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Solutions Built for <span className="text-primary">Your Stage of Growth</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you are formalizing a brand-new startup, growing a local retail business, or scaling an enterprise, we tailor our solutions for your operational scale.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          {ind.tagline}
                        </span>
                        <h3 className="text-2xl font-extrabold text-foreground">
                          {ind.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-foreground bg-muted/50 p-3 rounded-xl border border-border/60">
                      "{ind.headline}"
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ind.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                        Recommended Product Inclusions:
                      </div>
                      {ind.recommendedProducts.map((prod, pi) => (
                        <div key={pi} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{prod}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
                      <Link to={`/solutions`} className="flex items-center justify-center gap-2">
                        <span>Explore Solutions for {ind.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
