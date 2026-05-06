// components/ApplyModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { useApplyToJob } from '@/features/jobs/hooks/useApplyToJob';

interface ApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  onSubmit: (coverLetter: string, cvFile?: File) => Promise<void>;
  loading?: boolean;
}

export function ApplyModal({ open, onOpenChange, jobTitle, companyName, onSubmit, loading: externalLoading }: ApplyModalProps) {
  const { apply, getCV } = useApplyToJob();
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCV, setExistingCV] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  useEffect(() => {
    if (open) {
      getCV().then(url => setExistingCV(url));
    }
  }, [open]);

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max 5MB.');
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    try {
      await onSubmit(coverLetter, cvFile || undefined);
      onOpenChange(false);
      setCoverLetter('');
      setCvFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/10 bg-[#0f1117] text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#639922]">Apply for {jobTitle}</DialogTitle>
          <DialogDescription className="text-foreground/60">
            at {companyName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div>
            <Label className="text-foreground/80">Cover letter (optional)</Label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Why are you a great fit for this role? (Optional but recommended)"
              className="mt-1.5 bg-white/5 border-white/10 text-foreground placeholder:text-foreground/30"
            />
          </div>

          <div>
            <Label className="text-foreground/80">CV / Resume</Label>
            <div className="mt-1.5 flex flex-col gap-2">
              {existingCV && !cvFile && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 p-2 text-sm">
                  <FileText className="h-4 w-4 text-[#639922]" />
                  <a href={existingCV} target="_blank" rel="noopener noreferrer" className="text-[#639922] hover:underline">
                    View current CV
                  </a>
                  <span className="ml-auto text-foreground/40">(will be used)</span>
                </div>
              )}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-foreground/60 hover:bg-white/10 transition">
                <Upload className="h-4 w-4" />
                {cvFile ? cvFile.name : (existingCV ? 'Upload new CV' : 'Upload CV (PDF, DOC)')}
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVChange} className="hidden" />
              </label>
              {cvFile && (
                <button
                  type="button"
                  onClick={() => setCvFile(null)}
                  className="self-start text-xs text-red-400 flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
              <p className="text-xs text-foreground/30">Max 5MB. PDF, DOC, DOCX</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#639922] text-black hover:bg-[#4f7a1a]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}