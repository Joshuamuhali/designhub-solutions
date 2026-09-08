import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { offeringService, OfferingItem } from '@/services/offeringService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExpressInterestModal } from '@/components/ExpressInterestModal';
import {
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Award,
  Layers,
  MessageSquare,
  ChevronLeft,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PublicOfferingLandingProps {
  type: 'service' | 'product';
}

export default function PublicOfferingLanding({ type }: PublicOfferingLandingProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [offering, setOffering] = useState<OfferingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOffering = async () => {
      setLoading(true);
      if (slug) {
        const item = await offeringService.getOfferingBySlug(slug, type);
        if (isMounted) {
          setOffering(item);
          setLoading(false);
        }
      } else {
        if (isMounted) setLoading(false);
      }
    };

    fetchOffering();
    return () => { isMounted = false; };
  }, [slug, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading landing page...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!offering) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-32 px-4 space-y-6">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">404 Not Found</Badge>
          <h1 className="text-3xl font-bold">Offering Not Found</h1>
          <p className="text-muted-foreground text-sm">
            The {type} page you are looking for does not exist or has been archived.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Go Back
            </Button>
            <Button onClick={() => navigate(type === 'service' ? '/solutions' : '/products')}>
              Browse All {type === 'service' ? 'Services' : 'Products'}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedPrice = offering.price ? `K${offering.price.toLocaleString()}` : null;
  const isProduct = type === 'product';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
              <Link to={isProduct ? '/products' : '/solutions'} className="hover:text-primary transition-colors capitalize">
                {isProduct ? 'Products' : 'Services'}
              </Link>
              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-foreground font-medium">{offering.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                {/* Subtle Urgency & Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {offering.intake_status && (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1 text-xs font-semibold gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {offering.intake_status}
                    </Badge>
                  )}

                  {offering.turnaround_time && (
                    <Badge variant="outline" className="text-xs font-medium gap-1.5 border-border bg-background/80 px-3 py-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Turnaround: {offering.turnaround_time}
                    </Badge>
                  )}

                  <Badge variant="outline" className="text-xs font-medium border-border uppercase tracking-wider text-muted-foreground">
                    {offering.category}
                  </Badge>
                </div>

                {/* Hero Headlines */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                    {offering.hero_headline || offering.name}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl">
                    {offering.hero_subheadline || offering.short_description}
                  </p>
                </div>

                {/* Pricing Highlight Pill */}
                {formattedPrice && (
                  <div className="inline-flex items-baseline gap-2 bg-muted/60 border border-border/80 px-4 py-2 rounded-lg">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {offering.price_type === 'starting_at' ? 'Starting from' : offering.price_type === 'fixed' ? 'Investment' : 'Estimated at'}
                    </span>
                    <span className="text-2xl font-bold text-foreground">{formattedPrice}</span>
                    {offering.pricing_details && (
                      <span className="text-xs text-muted-foreground">({offering.pricing_details})</span>
                    )}
                  </div>
                )}

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                    className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20 gap-2 rounded-xl"
                  >
                    {offering.cta_text || 'Express Interest'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const text = encodeURIComponent(`Hi Designhub! I am viewing ${offering.name} on the website and would like to learn more.`);
                      window.open(`https://wa.me/260971234567?text=${text}`, '_blank');
                    }}
                    className="h-12 px-6 border-border text-foreground font-medium gap-2 rounded-xl hover:bg-muted"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    Ask on WhatsApp
                  </Button>
                </div>

                {/* Micro Guarantee Proof */}
                <div className="flex items-center gap-6 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> No prior account required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Satisfaction Guarantee
                  </span>
                </div>
              </div>

              {/* Visual Card / Graphic Mockup */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-gradient-to-b from-card via-card to-background p-6 sm:p-8 border border-border shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{offering.name}</h4>
                        <p className="text-xs text-muted-foreground">Designhub Official Offering</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                      Verified
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {offering.full_description || offering.short_description}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Highlights</p>
                    {offering.benefits && offering.benefits.length > 0 ? (
                      offering.benefits.slice(0, 3).map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span><strong className="text-foreground">{benefit.title}:</strong> {benefit.desc}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Fully customized to your brand requirements
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      variant="secondary"
                      className="w-full text-xs font-semibold h-10 gap-2"
                    >
                      Get Custom Quote for {offering.name}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION SECTION */}
        {(offering.problem_statement || offering.solution_statement) && (
          <section className="py-20 bg-muted/30 border-b border-border/40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {offering.problem_statement && (
                  <Card className="border-destructive/20 bg-background/80 shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">The Common Challenge</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {offering.problem_statement}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {offering.solution_statement && (
                  <Card className="border-primary/30 bg-primary/5 shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">The Designhub Solution</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {offering.solution_statement}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* KEY BENEFITS GRID */}
        {offering.benefits && offering.benefits.length > 0 && (
          <section className="py-20 bg-background border-b border-border/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                  Why Choose This {isProduct ? 'Product' : 'Service'}
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight">Built to Deliver Tangible Value</h2>
                <p className="text-sm text-muted-foreground">
                  Designed around real-world performance, aesthetics, and strategic growth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offering.benefits.map((item, idx) => (
                  <Card key={idx} className="border-border hover:border-primary/40 transition-all duration-200 bg-card/60">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        0{idx + 1}
                      </div>
                      <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURES / WHAT'S INCLUDED */}
        {offering.features && offering.features.length > 0 && (
          <section className="py-20 bg-muted/20 border-b border-border/40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Deliverables & Specs
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight">What’s Included</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offering.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/80">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-sm font-bold text-foreground">{feature.title}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WORKFLOW PROCESS TIMELINE */}
        {offering.process && offering.process.length > 0 && (
          <section className="py-20 bg-background border-b border-border/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                  Transparent Workflow
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight">How It Works</h2>
                <p className="text-sm text-muted-foreground">
                  A smooth, step-by-step path from your initial inquiry to final delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offering.process.map((p, idx) => (
                  <div key={idx} className="relative p-6 rounded-2xl bg-card border border-border space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                      {p.step || idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        {offering.faqs && offering.faqs.length > 0 && (
          <section className="py-20 bg-muted/20 border-b border-border/40">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Got Questions?
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {offering.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border border-border/80 bg-background rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            {offering.intake_status && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs px-3 py-1 font-semibold">
                Status: {offering.intake_status}
              </Badge>
            )}

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to elevate your business with {offering.name}?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Express your interest today without commitment. Our team will review your specifications and follow up promptly with a tailored proposal.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="h-12 px-8 text-base font-semibold shadow-xl shadow-primary/20 gap-2 rounded-xl w-full sm:w-auto"
              >
                {offering.cta_text || 'Express Interest Now'}
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const text = encodeURIComponent(`Hi Designhub! I would like to express interest in ${offering.name}.`);
                  window.open(`https://wa.me/260971234567?text=${text}`, '_blank');
                }}
                className="h-12 px-6 border-border font-medium gap-2 rounded-xl w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Contact via WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Express Interest Lead Modal */}
      {offering && (
        <ExpressInterestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offering={offering}
        />
      )}
    </div>
  );
}
