import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, Globe, Cpu, Megaphone, TrendingUp, Palette } from "lucide-react";

interface CaseStudy {
  id: string;
  client: string;
  category: 'Websites' | 'Branding' | 'Marketing' | 'Software' | 'Business Systems' | 'Sales' | 'Creative';
  title: string;
  summary: string;
  image: string;
  problem: string;
  solution: string;
  whatWeBuilt: string[];
  result: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "kasama-logistics-systems",
    client: "Kasama Express Freight",
    category: "Business Systems",
    title: "Automating Freight Tracking & Internal Fleet Operations",
    summary: "Replaced scattered WhatsApp messages and paper logbooks with a centralized freight tracking and customer status dashboard.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    problem: "The client managed over 40 weekly cargo dispatches using notebooks and manual WhatsApp updates, causing dispatch errors and lost client queries.",
    solution: "Designhub built a custom logistics management portal and automated SMS status tracking system.",
    whatWeBuilt: [
      "Custom Fleet & Cargo Tracking Portal",
      "Automated WhatsApp & SMS Notification System",
      "Customer Portal for Real-time Waybill Updates",
      "Driver Mobile App & POD Capture",
    ],
    result: "Reduced cargo tracking inquiry calls by 65% and eliminated 100% of dispatch logging errors within 60 days.",
  },
  {
    id: "zed-retail-ecommerce",
    client: "Copperbelt Retail & Hardware",
    category: "Websites",
    title: "E-Commerce & Mobile Payment Integration for Regional Distribution",
    summary: "Built a mobile-first e-commerce web platform integrated with Airtel Money and MTN MoMo for instant orders.",
    image: "https://images.unsplash.com/photo-1556742049-0a67daf40955?q=80&w=800&auto=format&fit=crop",
    problem: "Outdated legacy website with zero mobile ordering capabilities; lost revenue to competitors with fast mobile checkout.",
    solution: "Designed and launched an Advanced E-Commerce Website with local Zambian payment gateway integration.",
    whatWeBuilt: [
      "10-Page Custom E-Commerce Storefront",
      "Airtel MoMo & MTN Money Payment Gateway",
      "Real-time Inventory Sync",
      "Automated Order Invoice Generator",
    ],
    result: "Generated over K140,000 in direct online revenue in the first 90 days following launch.",
  },
  {
    id: "lusaka-financial-branding",
    client: "Apex Financial Advisory",
    category: "Branding",
    title: "Complete Brand Identity & Corporate Profile Transformation",
    summary: "Crafted an authoritative brand identity system, pitch decks, and company profile for corporate tenders.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    problem: "The financial advisory firm had an outdated logo and informal proposal presentation that failed to win corporate bank tenders.",
    solution: "Delivered a complete Business Branding package, guidelines, and executive Company Profile.",
    whatWeBuilt: [
      "Executive Logo & Typography Guidelines",
      "16-Page Corporate Company Profile PDF",
      "Executive Pitch Deck Presentation",
      "Stationery & Proposal Documentation",
    ],
    result: "Successfully secured 3 new institutional banking clients within 4 months of brand relaunch.",
  },
  {
    id: "zambia-agro-sales",
    client: "GreenFields Agro Solutions",
    category: "Sales",
    title: "Sales Team Restructuring & CRM Pipeline Implementation",
    summary: "Structured a 6-person sales team, established daily KPIs, and deployed a custom Sales Management System.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    problem: "Sales representatives had no clear leads pipeline, missing follow-ups, and unmonitored sales calls.",
    solution: "Implemented the 'Build Your Sales Team' program and Customer CRM System.",
    whatWeBuilt: [
      "Sales Representative Pipeline Dashboard",
      "Objection Handling Scripts & Call Workflows",
      "Weekly Management Review & KPI Monitoring",
      "Sales Agent Commission Tracker Module",
    ],
    result: "Increased sales conversion rate by 42% and shortened average deal closing cycles from 21 days to 9 days.",
  },
  {
    id: "lusaka-hospitality-marketing",
    client: "Safari Haven Lodges",
    category: "Marketing",
    title: "Full-Funnel Social Media & Lead Generation Campaign",
    summary: "Executed targeted video reels, Facebook ad campaigns, and booking funnel for safari tourism.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    problem: "Low occupancy rates during off-peak seasonal months due to reliance on word-of-mouth.",
    solution: "Subscribed to Customer Growth Marketing Package featuring video production and meta ads.",
    whatWeBuilt: [
      "15 High-Definition Promo Video Reels",
      "Targeted Meta & Google Search Ads",
      "Direct WhatsApp Booking Funnel",
      "Monthly Lead & Guest Tracking",
    ],
    result: "Achieved 88% lodge room occupancy throughout off-peak months with 3.8x Return on Ad Spend.",
  },
  {
    id: "smart-health-software",
    client: "Zambia Health Tech Services",
    category: "Software",
    title: "Custom Patient Record & Clinic Management Platform",
    summary: "Engineered a cloud-based clinic management tool for patient appointments, medical records, and billing.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    problem: "Manual paper files caused long patient waiting times and double-booked doctor appointments.",
    solution: "Developed custom web software for multi-clinic management.",
    whatWeBuilt: [
      "Patient Electronic Health Record (EHR)",
      "Doctor Schedule & SMS Reminder Engine",
      "Billing & Pharmacy Stock Integration",
      "Role-Based Multi-Staff Security System",
    ],
    result: "Reduced average patient wait times by 55% across 4 clinic branches.",
  },
];

const categories = ['All', 'Websites', 'Branding', 'Marketing', 'Software', 'Business Systems', 'Sales'];

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredStudies = selectedCategory === 'All'
    ? caseStudies
    : caseStudies.filter((cs) => cs.category === selectedCategory);

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              Proof & Implementation Case Studies
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Businesses We've <span className="text-primary">Helped Build & Scale</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore how we solve practical business problems through strategy, branding, websites, software, sales systems, and targeted marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-card border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-background">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                        {study.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        {study.client}
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground leading-snug">
                        {study.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {study.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-muted/40 p-4 rounded-xl border border-border/60">
                      <div>
                        <span className="font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                          The Challenge:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {study.problem}
                        </p>
                      </div>
                      <div>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                          Our Solution:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                        What Designhub Built:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {study.whatWeBuilt.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        Measurable Result:
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {study.result}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
                    <Link to={`/project-consultation?ref=${study.id}`} className="flex items-center justify-center gap-2">
                      <span>Achieve Similar Results for Your Business</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ready for transformation?</span>
              <h3 className="text-3xl font-extrabold">Let's solve your business challenges together.</h3>
              <p className="text-sm text-slate-400">
                Book a Business Check-Up or consultation with our implementation team.
              </p>
            </div>
            <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-lg shrink-0">
              <Link to="/project-consultation">
                Book a Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
