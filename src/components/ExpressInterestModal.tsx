import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { useSubmitExpressInterest } from '@/hooks/useOffering';
import type { OfferingItem } from '@/services/offeringService';
import { useNavigate } from 'react-router-dom';

interface ExpressInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  offering: OfferingItem;
}

export const ExpressInterestModal: React.FC<ExpressInterestModalProps> = ({
  isOpen,
  onClose,
  offering
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState<number>(offering.type === 'product' ? 20 : 1);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');

  const submitInterest = useSubmitExpressInterest();
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    submitInterest.mutate({
      name,
      email,
      phone,
      company,
      message,
      offering_type: offering.type,
      offering_id: offering.id,
      offering_slug: offering.slug,
      offering_name: offering.name,
      quantity: offering.type === 'product' ? quantity : undefined,
      estimatedBudget: budget || (offering.price ? `K${offering.price.toLocaleString()}` : undefined)
    }, {
      onSuccess: (result) => {
        if (result.success && result.leadId) {
          setSubmittedLeadId(result.leadId);
        }
      }
    });
  };

  const handleReset = () => {
    setSubmittedLeadId(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleReset(); }}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-background border-border shadow-2xl">
        {!submittedLeadId ? (
          <div>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5">
                  No Registration Required
                </Badge>
                {offering.turnaround_time && (
                  <Badge variant="secondary" className="text-xs font-medium gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {offering.turnaround_time}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Express Interest: {offering.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Tell us about your project requirements. Our team will review your inquiry and follow up within 24 hours.
              </DialogDescription>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Banda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">
                    Phone / WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. +260 971 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-medium">
                    Company / Organization
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g. ABC Logistics"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {offering.type === 'product' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity" className="text-xs font-medium">
                      Estimated Quantity (Units)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="budget" className="text-xs font-medium">
                      Target Budget Range
                    </Label>
                    <Input
                      id="budget"
                      placeholder="e.g. K2,000 - K5,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="budget" className="text-xs font-medium">
                    Estimated Budget / Timeline
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g. Starting ASAP / Budget K5,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-medium">
                  Project Notes & Requirements
                </Label>
                <Textarea
                  id="message"
                  placeholder="Share any specific goals, references, or features you require..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border mt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Your info is private and protected.
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitInterest.isPending} className="w-full sm:w-auto font-semibold gap-2">
                    {submitInterest.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation & Progressive Registration Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1 font-mono">
                Ref ID: {submittedLeadId}
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Inquiry Successfully Received!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Thank you <span className="font-semibold text-foreground">{name}</span>. Your request regarding <span className="font-semibold text-primary">{offering.name}</span> has been logged into our CRM.
              </p>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 text-left border border-border/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Sparkles className="w-4 h-4 text-primary" /> What happens next?
              </div>
              <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                <li>A Designhub sales specialist will contact you on <strong className="text-foreground">{phone}</strong>.</li>
                <li>You will receive a formal quotation tailored to your specifications.</li>
                <li>Current intake availability: <span className="text-foreground font-medium">{offering.intake_status}</span>.</li>
              </ul>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 text-xs"
                  onClick={() => {
                    const text = encodeURIComponent(`Hi Designhub! I just submitted inquiry ${submittedLeadId} for ${offering.name}.`);
                    window.open(`https://wa.me/260971234567?text=${text}`, '_blank');
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp Now
                </Button>

                <Button
                  className="gap-2 text-xs"
                  onClick={() => {
                    handleReset();
                    navigate(`/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
                  }}
                >
                  Create Account to Track Quotation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Continue browsing website without account
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
