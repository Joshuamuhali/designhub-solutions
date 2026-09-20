import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getServiceBySlug, ServiceWithSlug, BundleWithSlug } from '@/data/services';
import { PRODUCT_CATEGORIES } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, MessageCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceLanding() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [service, setService] = useState<ServiceWithSlug | BundleWithSlug | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  useEffect(() => {
    if (slug) {
      const foundService = getServiceBySlug(slug);
      setService(foundService);
      setLoading(false);
    }
  }, [slug]);

  // Update document title and meta tags
  useEffect(() => {
    if (service) {
      const serviceHeadline = isBundle ? service.tagline : service.headline;
      document.title = `${service.name} | Designhub Solutions`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `${serviceHeadline || service.name} - ${service.description.substring(0, 160)}...`);
      }
      
      // Update OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${service.name} | Designhub Solutions`);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', `${serviceHeadline || service.name} - ${service.description.substring(0, 160)}...`);
      }
      
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', window.location.href);
      }
      
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', window.location.href);
      }
    }
  }, [service, isBundle]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInquiryModalOpen) {
        handleModalClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isInquiryModalOpen]);

  useEffect(() => {
    if (isInquiryModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isInquiryModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading service...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-32 px-4 space-y-6">
          <h1 className="text-3xl font-bold">Service Not Found</h1>
          <p className="text-muted-foreground text-sm">The service page you are looking for does not exist.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Go Back
            </Button>
            <Button onClick={() => navigate('/solutions')}>Browse All Services</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isBundle = 'isBundle' in service;
  const serviceType: 'Standard' | 'Subscription' | 'Bundle' = isBundle ? 'Bundle' : 
    (service.billingType === 'monthly' ? 'Subscription' : 'Standard');
  
  const category = isBundle ? null : PRODUCT_CATEGORIES.find(c => c.id === service.categoryId);
  const categoryName = isBundle ? 'Bundle' : (category?.name || service.categoryName || 'General');
  const headline = isBundle ? service.tagline : service.headline;
  const addons = isBundle ? undefined : service.addons;
  const targetAudience = isBundle ? undefined : service.targetAudience;

  const handleWhatsAppClick = () => {
    const phone = "260974399695";
    const message = `Hi Designhub! I'm interested in the ${service.name} (${service.price}).`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleInquiryClick = () => {
    setSelectedAddons([]);
    setInquiryForm({ name: '', email: '', phone: '', company: '', message: '' });
    setIsInquiryModalOpen(true);
  };

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  const handleModalClose = () => {
    setIsInquiryModalOpen(false);
    setInquirySubmitted(false);
    setInquiryError(null);
    setSelectedAddons([]);
    setInquiryForm({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInquiryError(null);

    try {
      const { data, error } = await supabase
        .from('service_inquiries')
        .insert({
          service_category: categoryName,
          service_type: serviceType,
          service_title: service.name,
          service_price: service.price,
          selected_addons: selectedAddons,
          client_name: inquiryForm.name,
          client_phone: inquiryForm.phone,
          client_email: inquiryForm.email || null,
          business_name: inquiryForm.company || null,
          message: inquiryForm.message || null,
          status: 'new',
          source_page: window.location.pathname,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/solutions" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Services
            </Link>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{categoryName}</span>
                <span className="text-xs uppercase tracking-wider font-bold text-primary">{serviceType}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">{service.name}</h1>
              {headline && <p className="text-xl text-muted-foreground italic">"{headline}"</p>}
              <div className="text-3xl font-black text-primary">{service.price}</div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{service.description}</p>
            </div>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleWhatsAppClick} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md gap-2 text-lg py-6">
                <MessageCircle className="w-5 h-5" />
                Immediate WhatsApp
              </Button>
              <Button onClick={handleInquiryClick} variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-semibold gap-2 text-lg py-6">
                Send Inquiry to Our Team
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
            <div className="grid gap-3">
              {service.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!isBundle && addons && addons.length > 0 && (
          <section className="py-16 bg-accent/30">
            <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Optional Add-ons</h2>
              <div className="grid gap-3">
                {addons.map((addon, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                    <span className="text-sm text-foreground">{addon.name}</span>
                    <span className="text-sm font-semibold text-primary">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {targetAudience && (
          <section className="py-16">
            <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Who This Is For</h2>
              <p className="text-base text-muted-foreground leading-relaxed">{targetAudience}</p>
            </div>
          </section>
        )}
      </main>
      <Footer />

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
                  <h3 className="text-xl font-bold text-foreground">Send Inquiry</h3>
                  <Button variant="ghost" size="icon" onClick={handleModalClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 space-y-2">
                  <div className="text-lg font-bold text-foreground">{service.name}</div>
                  <div className="text-xl font-black text-primary">{service.price}</div>
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
                    <Button onClick={handleModalClose} className="w-full">Close</Button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{inquiryError}</p>
                      </div>
                    )}

                    {!isBundle && service.addons && service.addons.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider">Optional Add-ons</div>
                        <div className="space-y-2">
                          {service.addons.map((addon, index) => (
                            <label key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedAddons.includes(addon.name)}
                                  onChange={() => handleAddonToggle(addon.name)}
                                  className="w-4 h-4"
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
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Full Name *</label>
                      <input type="text" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="John Doe" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Phone Number *</label>
                      <input type="tel" required value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="+260 XXX XXX XXX" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Email Address (optional)</label>
                      <input type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Business Name (optional)</label>
                      <input type="text" value={inquiryForm.company} onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="Your Company Ltd" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Message / Notes (optional)</label>
                      <textarea rows={4} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none" placeholder="Tell us more about your requirements..." />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={handleModalClose} className="flex-1">Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground font-bold">
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
    </div>
  );
}
