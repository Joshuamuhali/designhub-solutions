import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, CheckCircle2, Heart, Sparkles, Loader2 } from 'lucide-react';
import { erpService } from '@/services/erpService';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await erpService.submitFeedback({
      project_id: projectId,
      rating,
      comments,
      would_recommend: wouldRecommend,
      testimonial
    });

    setIsSubmitting(false);

    if (success) {
      toast.success('Thank you! Your feedback has been recorded.');
      setSubmitted(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-background border-border">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> How Was Your Experience?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Your project has been successfully completed. Please share your thoughts to help us maintain top service quality.
              </DialogDescription>
            </DialogHeader>

            {/* Star Rating */}
            <div className="space-y-1.5 text-center py-2 bg-muted/30 rounded-xl border border-border/60">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Satisfaction</label>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">What did you like best about our service?</label>
              <Textarea
                placeholder="Share your thoughts on speed, communication, quality..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[70px] text-xs resize-none"
              />
            </div>

            {/* Public Testimonial Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Optional Public Testimonial</label>
              <Textarea
                placeholder="Can we feature a quote from you on our website case studies?"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                className="min-h-[60px] text-xs resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="recommend"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="recommend" className="text-xs text-muted-foreground cursor-pointer">
                I would recommend Designhub to other businesses.
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Skip
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs font-semibold gap-1.5">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />}
                Submit Feedback
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Feedback Recorded!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Thank you for trusting Designhub. We look forward to working with your team on future projects!
            </p>
            <Button onClick={onClose} size="sm" className="text-xs font-semibold">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
