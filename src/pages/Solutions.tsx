import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, ArrowRight, Rocket, Palette, Globe, Cpu, Megaphone, TrendingUp, BarChart3, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES, PRODUCTS, PACKAGE_BUNDLES, Product } from "@/data/products";

const categoryIcons: Record<string, any> = {
  start: Rocket,
  brand: Palette,
  digital: Globe,
  systems: Cpu,
  market: Megaphone,
  sales: TrendingUp,
  grow: BarChart3,
};

export default function Solutions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryParam || "all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (activeCategoryParam) {
      setSelectedCategory(activeCategoryParam);
    }
  }, [activeCategoryParam]);

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categoryId === selectedCategory);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <Layout>
      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              Product Catalogue & Solution Architecture
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Business, Digital & <span className="text-primary">Growth Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We sell standardized, practical products with transparent pricing anchors. Select a category below or explore our full product catalog.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="py-8 bg-card border-b border-border sticky top-20 z-30 backdrop-blur-md bg-card/90">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>All Solutions</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-background/20">
                {PRODUCTS.length}
              </span>
            </button>

            {PRODUCT_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id] || Globe;
              const isSelected = selectedCategory === cat.id;
              const count = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? "bg-background/20 text-primary-foreground" : "bg-muted-foreground/10 text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="py-16 bg-background">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Active Category Banner if filtered */}
          {selectedCategory !== "all" && (
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Selected Category
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.headline}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategorySelect("all")}
                className="shrink-0"
              >
                View All Categories
              </Button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-2xl border bg-card flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative ${
                  prod.featured ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                {prod.featured && (
                  <span className="absolute -top-3 right-6 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                    Recommended Product
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-muted text-muted-foreground">
                      {prod.categoryName}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {prod.billingType === 'monthly' ? 'Subscription' : 'Standard'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-foreground mb-1">
                    {prod.name}
                  </h3>
                  
                  <div className="text-2xl font-black text-primary mb-3">
                    {prod.price}
                  </div>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    "{prod.headline}"
                  </p>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Key Inclusions:
                    </div>
                    {prod.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                  {prod.addons && prod.addons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <PlusCircle className="w-3 h-3 text-primary" />
                        Optional Add-ons:
                      </div>
                      <div className="space-y-1">
                        {prod.addons.map((addon, ai) => (
                          <div key={ai} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{addon.name}</span>
                            <span className="font-semibold text-foreground">{addon.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-border space-y-2">
                  <Button
                    asChild
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md gap-2"
                  >
                    <a
                      href={`https://wa.me/0974399695?text=${encodeURIComponent(prod.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Get Started on WhatsApp
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full text-xs"
                  >
                    <Link to={`/project-consultation?product=${prod.id}`}>
                      Book Consultation for Product
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Complete Business Packages Section */}
          <div className="pt-16 border-t border-border space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                Value Bundles
              </span>
              <h2 className="text-3xl font-extrabold text-foreground">
                Complete Business Package Bundles
              </h2>
              <p className="text-muted-foreground text-sm">
                Combine individual products into integrated solutions to increase business capabilities and save cost.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PACKAGE_BUNDLES.map((bundle) => (
                <div
                  key={bundle.id}
                  className={`p-6 rounded-2xl border bg-card flex flex-col justify-between space-y-6 ${
                    bundle.popular ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
                  }`}
                >
                  <div>
                    {bundle.popular && (
                      <span className="inline-block mb-3 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                        Most Popular Package
                      </span>
                    )}
                    <h3 className="text-xl font-extrabold text-foreground">{bundle.name}</h3>
                    <div className="text-2xl font-black text-primary mt-1">{bundle.price}</div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">{bundle.tagline}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{bundle.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold text-foreground">Includes:</div>
                      {bundle.inclusions.map((inc, ii) => (
                        <div key={ii} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
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

        </div>
      </section>
    </Layout>
  );
}
