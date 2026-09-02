import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Palette, FileText, Globe, Cpu, Megaphone, TrendingUp, HelpCircle, ArrowRight } from "lucide-react";

interface OptionCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  category: string;
  targetPath: string;
  color: string;
}

const options: OptionCard[] = [
  {
    id: "start",
    title: "I need to start my business",
    subtitle: "Formal structure, documents & starter package",
    icon: Rocket,
    category: "start",
    targetPath: "/solutions?category=start",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600",
  },
  {
    id: "logo",
    title: "I need a logo or branding",
    subtitle: "Professional visual identity & style guides",
    icon: Palette,
    category: "brand",
    targetPath: "/solutions?category=brand",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600",
  },
  {
    id: "profile",
    title: "I need a company profile",
    subtitle: "High-impact document for tenders & clients",
    icon: FileText,
    category: "brand",
    targetPath: "/solutions?category=brand",
    color: "from-sky-500/10 to-blue-500/10 border-sky-500/30 text-sky-600",
  },
  {
    id: "website",
    title: "I need a website",
    subtitle: "Responsive design from K5,000",
    icon: Globe,
    category: "digital",
    targetPath: "/solutions?category=digital",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600",
  },
  {
    id: "software",
    title: "I need business software",
    subtitle: "CRMs, stock systems & custom tools",
    icon: Cpu,
    category: "systems",
    targetPath: "/solutions?category=systems",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600",
  },
  {
    id: "marketing",
    title: "I need more customers",
    subtitle: "Social media, ads & lead generation",
    icon: Megaphone,
    category: "market",
    targetPath: "/solutions?category=market",
    color: "from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-600",
  },
  {
    id: "sales",
    title: "I need more sales",
    subtitle: "Sales team training & pipeline management",
    icon: TrendingUp,
    category: "sales",
    targetPath: "/solutions?category=sales",
    color: "from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-600",
  },
  {
    id: "business-checkup",
    title: "I'm not sure what I need",
    subtitle: "Book a Business Check-Up diagnostic",
    icon: HelpCircle,
    category: "grow",
    targetPath: "/project-consultation?service=not-sure",
    color: "from-slate-500/10 to-zinc-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300",
  },
];

export function ProductFinder() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-muted/40 border-y border-border">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full mb-3">
            Interactive Product Finder
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            What does your business need right now?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-3">
            Select what you are looking to solve, and we will guide you directly to the right solution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {options.map((opt, index) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => navigate(opt.targetPath)}
                className={`p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group bg-gradient-to-br ${opt.color}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {opt.subtitle}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                  <span>Explore Product</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
