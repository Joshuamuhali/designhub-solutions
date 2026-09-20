import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, ArrowRight, Rocket, Palette, Globe, Cpu, Megaphone, TrendingUp, BarChart3, PlusCircle, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_CATEGORIES, PRODUCTS, PACKAGE_BUNDLES, Product } from "@/data/products";
import { supabase } from "@/lib/supabase";

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
  const navigate = useNavigate();
  const activeCategoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryParam || "all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBundle, setIsBundle] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCategoryParam) {
      setSelectedCategory(activeCategoryParam);
    }
  }, [activeCategoryParam]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInquiryModalOpen) {
        handleModalClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isInquiryModalOpen]);

  // Focus trap in modal
  useEffect(() => {
    if (isInquiryModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      firstElement?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isInquiryModalOpen]);

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

  const handleWhatsAppClick = (product: Product) => {
    const phone = "260974399695";
    const message = product.whatsappMessage;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleInquiryClick = (product: Product | any) => {
    setInquiryProduct(product);
    setIsBundle(product.categoryId === 'bundle' || !product.categoryId);
    setSelectedAddons([]);
    setInquiryForm({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      message: '' 
    });
    setIsInquiryModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInquiryError(null);

    try {
      // Determine service type
      let serviceType: 'Standard' | 'Subscription' | 'Bundle' = 'Standard';
      if (isBundle) {
        serviceType = 'Bundle';
      } else if (inquiryProduct?.billingType === 'monthly') {
        serviceType = 'Subscription';
      }

      // Get category name
      const category = PRODUCT_CATEGORIES.find(c => c.id === inquiryProduct?.categoryId);
      const serviceCategory = category?.name || inquiryProduct?.categoryName || 'General';

      // Send inquiry to Supabase service_inquiries table
      const { data, error } = await supabase
        .from('service_inquiries')
        .insert({
          service_category: serviceCategory,
          service_type: serviceType,
          service_title: inquiryProduct?.name || 'Unknown Service',
          service_price: inquiryProduct?.price || 'Contact for pricing',
          selected_addons: selectedAddons,
          client_name: inquiryForm.name,
          client_phone: inquiryForm.phone,
          client_email: inquiryForm.email || null,
          business_name: inquiryForm.company || null,
          message: inquiryForm.message || null,
          status: 'new',
          source_page: window.location.pathname
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Inquiry submission failed:', error);
        setInquiryError('Failed to submit inquiry. Please try again or contact us via WhatsApp.');
        return;
      }

      console.log('Inquiry submitted successfully:', data);
      setInquirySubmitted(true);
    } catch (error) {
      console.error('Inquiry submission exception:', error);
      setInquiryError('An unexpected error occurred. Please try again or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = () => {
    setIsInquiryModalOpen(false);
    setInquirySubmitted(false);
    setInquiryError(null);
    setSelectedAddons([]);
    setInquiryForm({ name: '', email: '', phone: '', company: '', message: '' });
    // Navigate to signup page
    window.location.href = '/signup';
  };

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  const handleModalClose = () => {
    setIsInquiryModalOpen(false);
    setInquirySubmitted(false);
    setInquiryError(null);
    setSelectedAddons([]);
    setInquiryForm({ name: '', email: '', phone: '', company: '', message: '' });
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

      {/* Category Filter Bar - horizontal scroll chips, mobile-first */}
      <section className="py-3 bg-card border-b border-border sticky top-16 z-30 backdrop-blur-md bg-card/90">
        <div className="relative">
          {/* Edge fade gradients (purely visual, hidden on desktop where it's less needed) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-card to-transparent z-10 sm:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card to-transparent z-10 sm:hidden" />

          <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => handleCategorySelect("all")}
                className={`snap-start shrink-0 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground active:bg-accent"
                }`}
              >
                <span>All</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === "all" ? "bg-background/20" : "bg-background/60"
                }`}>
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
                    className={`snap-start shrink-0 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground active:bg-accent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? "bg-background/20" : "bg-background/60"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
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
                className={`p-6 rounded-2xl border bg-card flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative cursor-pointer ${
                  prod.featured ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
                onClick={() => navigate(`/services/${prod.id}`)}
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
                    onClick={() => handleWhatsAppClick(prod)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Immediate WhatsApp
                  </Button>

                  <Button
                    onClick={() => handleInquiryClick(prod)}
                    variant="outline"
                    className="w-full text-xs border-primary/30 text-primary hover:bg-primary/5 font-semibold gap-1.5"
                  >
                    Send Inquiry to Our Team
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
                  className={`p-6 rounded-2xl border bg-card flex flex-col justify-between space-y-6 cursor-pointer hover:shadow-xl transition-all ${
                    bundle.popular ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
                  }`}
                  onClick={() => navigate(`/services/${bundle.id}`)}
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

                  <div className="space-y-2">
                    <Button
                      onClick={() => window.open(`https://wa.me/260974399695?text=${encodeURIComponent(`Hi Designhub! I'm interested in the ${bundle.name} package (${bundle.price}).`)}`, '_blank')}
                      className="w-full bg-primary text-primary-foreground font-bold gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{bundle.ctaText}</span>
                    </Button>
                    <Button
                      onClick={() => handleInquiryClick({ 
                        id: bundle.id, 
                        name: bundle.name, 
                        categoryId: 'bundle' as any, 
                        categoryName: 'Bundle', 
                        headline: bundle.tagline, 
                        description: bundle.description, 
                        price: bundle.price, 
                        billingType: 'custom', 
                        inclusions: bundle.inclusions, 
                        targetAudience: '', 
                        whatsappMessage: `Hi Designhub! I'm interested in the ${bundle.name} package (${bundle.price}).` 
                      })}
                      variant="outline"
                      className="w-full text-xs border-primary/30 text-primary hover:bg-primary/5 font-semibold"
                    >
                      Send Inquiry to Our Team
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Send Inquiry</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleModalClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Service Details */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service</span>
                    <span className="text-xs font-bold text-primary uppercase">{inquiryProduct?.categoryName || 'Bundle'}</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">{inquiryProduct?.name}</div>
                  <div className="text-xl font-black text-primary">{inquiryProduct?.price}</div>
                  {inquiryProduct?.headline && (
                    <p className="text-xs text-muted-foreground italic">"{inquiryProduct.headline}"</p>
                  )}
                </div>

                {inquirySubmitted ? (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">Inquiry Submitted!</h4>
                      <p className="text-sm text-muted-foreground mb-6">
                        Thank you for your inquiry. Designhub will follow up on WhatsApp/email within 24 hours.
                      </p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left space-y-3">
                      <p className="text-sm font-semibold text-foreground">
                        Create an account to track your inquiry status
                      </p>
                      <p className="text-xs text-muted-foreground">
                        With an account, you can view your inquiry details, track progress, and manage all your interactions with Designhub in one place.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleModalClose}
                        variant="outline"
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={handleCreateAccount}
                        className="flex-1 bg-primary text-primary-foreground font-bold"
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{inquiryError}</p>
                      </div>
                    )}

                    {/* Add-ons Section */}
                    {!isBundle && inquiryProduct?.addons && inquiryProduct.addons.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Optional Add-ons
                        </div>
                        <div className="space-y-2">
                          {inquiryProduct.addons.map((addon, index) => (
                            <label key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedAddons.includes(addon.name)}
                                  onChange={() => handleAddonToggle(addon.name)}
                                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">{addon.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-primary">{addon.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Phone Number * (for WhatsApp follow-up)
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+260 XXX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Business Name (optional)
                      </label>
                      <input
                        type="text"
                        value={inquiryForm.company}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your Company Ltd"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Message / Notes (optional)
                      </label>
                      <textarea
                        rows={4}
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Tell us more about your requirements..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleModalClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary text-primary-foreground font-bold"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
