import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Lightbulb, TrendingUp, Cpu, ShieldCheck } from "lucide-react";

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
}

const articles: Article[] = [
  {
    id: "website-vs-customers",
    category: "Business Strategy",
    title: "Why a New Website Won't Fix a Broken Sales Process",
    excerpt: "Many business owners assume a website overhaul will solve low sales. Here is why customer management and follow-ups matter more.",
    readTime: "4 min read",
    date: "2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "notebooks-to-crm",
    category: "Business Systems",
    title: "Ditching WhatsApp Notebooks: The True Cost of Unorganized Leads",
    excerpt: "How African SMEs lose up to 40% of potential leads by managing sales conversations in scattered personal chat threads.",
    readTime: "5 min read",
    date: "2026",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tender-ready-company-profile",
    category: "Branding",
    title: "What Corporate Banks & Tender Boards Look For in a Company Profile",
    excerpt: "The 5 essential sections every company profile must contain to project corporate governance and operational capability.",
    readTime: "6 min read",
    date: "2026",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "building-sales-team-zambia",
    category: "Sales Management",
    title: "How to Structure Sales Targets & KPIs for Your First Sales Team",
    excerpt: "A practical guide to setting realistic monthly targets, commission structures, and daily reporting metrics for local sales reps.",
    readTime: "7 min read",
    date: "2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Insights() {
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
              Practical Growth & Systems Knowledge
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Designhub <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No complex corporate jargon. Practical articles and guides on building better systems, managing sales, marketing, and operational growth.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((art, idx) => (
              <motion.article
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{art.date}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-foreground leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full justify-between">
                    <Link to="/project-consultation">
                      <span>Discuss Your Business Need</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
