import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, MessageSquare, FileText, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useClientApproveProof, useClientRequestRevision } from '@/hooks/useERP';
import type { ERPRevision } from '@/services/erpService';
import { toast } from 'sonner';

interface ClientApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  revision?: ERPRevision | null;
  onSuccess: () => void;
}

export const ClientApprovalModal: React.FC<ClientApprovalModalProps> = ({
  isOpen,
  onClose,
  projectId,
  revision,
  onSuccess
}) => {
  const [feedbackMode, setFeedbackMode] = useState<'view' | 'revision'>('view');
  const [revisionNotes, setRevisionNotes] = useState('');

  const approveProof = useClientApproveProof();
  const requestRevision = useClientRequestRevision();

  const handleApprove = async () => {
    approveProof.mutate({ projectId, revisionId: revision?.id }, {
      onSuccess: () => {
        toast.success('Proof approved! Project status updated to Client Approved.');
        onSuccess();
        onClose();
      }
    });
  };

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) return;

    requestRevision.mutate({ projectId, revisionId: revision?.id || 'r-1', feedback: revisionNotes }, {
      onSuccess: () => {
        toast.success('Revision request sent to the design team.');
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 bg-background border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              Proof Review
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              Version {revision?.version_number || 1}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Review Project Proof
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Inspect the proof document uploaded by the creative team. You can either approve or submit specific revision requests.
          </DialogDescription>
        </DialogHeader>

        {/* Proof Preview Box */}
        <div className="bg-muted/40 rounded-xl p-4 border border-border space-y-3 my-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <FileText className="w-4 h-4 text-primary" />
              <span>Company-Profile-Proof-v{revision?.version_number || 1}.pdf</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(revision?.proof_file_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800', '_blank')}
              className="text-xs h-7 text-primary hover:underline"
            >
              Open Full Proof PDF
            </Button>
          </div>

          {revision?.designer_notes && (
            <p className="text-xs text-muted-foreground bg-background p-2.5 rounded-lg border border-border/60">
              <strong className="text-foreground">Designer Notes:</strong> "{revision.designer_notes}"
            </p>
          )}
        </div>

        {feedbackMode === 'view' ? (
          <div className="space-y-4 pt-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-600 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ready for Final Sign-off?
              </p>
              <p className="text-muted-foreground">
                Approving this proof signals to the Project Manager that the design is accepted and ready for final completion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setFeedbackMode('revision')}
                className="w-full sm:w-auto text-xs border-amber-500/30 text-amber-600 hover:bg-amber-50 gap-1.5"
              >
                <AlertCircle className="w-4 h-4" /> Request Changes / Revision
              </Button>

              <Button
                onClick={handleApprove}
                disabled={approveProof.isPending}
                className="w-full sm:w-auto text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5"
              >
                {approveProof.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve & Sign Off
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Describe Required Changes / Revisions <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Be specific (e.g., Update phone number on page 2, change cover photo, correct CEO name)..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="min-h-[100px] text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setFeedbackMode('view')} className="text-xs">
                Cancel
              </Button>

              <Button
                onClick={handleRequestRevision}
                disabled={requestRevision.isPending || !revisionNotes.trim()}
                className="text-xs font-semibold gap-1.5"
              >
                {requestRevision.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                Send Revision Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
