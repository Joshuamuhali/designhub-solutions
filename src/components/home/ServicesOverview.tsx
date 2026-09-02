import { Link } from "react-router-dom";
import { Rocket, Palette, Globe, Cpu, Megaphone, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/data/products";

const whatsappNumber = "0974399695";

const categoryIcons: Record<string, any> = {
  start: Rocket,
  brand: Palette,
  digital: Globe,
  systems: Cpu,
  market: Megaphone,
  sales: TrendingUp,
  grow: BarChart3,
};

const categoryImages: Record<string, string> = {
  start: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  brand: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop",
  digital: "https://images.unsplash.com/photo-1545239355-0d5028440b71?q=80&w=800&auto=format&fit=crop",
  systems: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
  market: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
  sales: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
  grow: "https://images.unsplash.com/photo-1573497019940-1c286886d56a?q=80&w=800&auto=format&fit=crop",
};

export function ServicesOverview() {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/40 relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            Solution Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-3 mb-4">
            What Does Your Business <span className="text-primary">Need?</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            From your initial business setup to software systems, branding, websites, sales teams, and growth consulting.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || Globe;
            const bgImage = categoryImages[cat.id] || categoryImages.digital;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Visual Header */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={bgImage} 
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block">
                        Category {cat.name}
                      </span>
                      <h3 className="text-xl font-extrabold text-white">{cat.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      "{cat.headline}"
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                  >
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Designhub! I'm interested in products under the ${cat.name} category: ${cat.title}.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Get Started on WhatsApp</span>
                      <ArrowRight size={18} />
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all solutions button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild className="font-bold border-2">
            <Link to="/solutions" className="flex items-center gap-2">
              <span>View Full Product Catalogue</span>
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
