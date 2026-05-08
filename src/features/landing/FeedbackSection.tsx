// components/FeedbackSection.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, StarOff, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useFeedbacks } from '@/features/landing/hooks/useFeedbacks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const FeedbackSection = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { feedbacks, loading, submitting, submitFeedback, refresh } = useFeedbacks();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: 5, message: '', name: '', email: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      setForm({ rating: 5, message: '', name: '', email: '' });
      return;
    }
    if (!user) {
      // Not logged in – show dialog with name/email fields
      setOpen(true);
    } else {
      // Logged in – pre-fill name from profile
      const fullName = profile?.first_name && profile?.last_name
        ? `${profile.first_name} ${profile.last_name}`
        : profile?.first_name || profile?.last_name || 'Anonymous User';
      setForm(prev => ({ ...prev, name: fullName, email: profile?.email || '' }));
      setOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message) return;

    const success = await submitFeedback({
      name: form.name,
      email: user ? profile?.email : form.email,
      rating: form.rating,
      message: form.message,
    });
    if (success) {
      setForm({ rating: 5, message: '', name: '', email: '' });
      setOpen(false);
      refresh();
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">What Our Community Says</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Real stories from students, employers, and universities who found success on Massar.
          </p>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="mt-6 bg-[#639922] text-black hover:bg-[#4f7a1a]">
                Share Your Feedback <Send className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f1117] border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#639922]">We'd love to hear from you</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!user && (
                  <>
                    <div>
                      <label className="block text-sm mb-1 text-foreground/70">Your Name *</label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="bg-white/5 border-white/10"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-foreground/70">Email (optional)</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-white/5 border-white/10"
                        placeholder="you@example.com"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm mb-1 text-foreground/70">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, rating: r })}
                        onMouseEnter={() => setHoverRating(r)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        {(hoverRating || form.rating) >= r ? (
                          <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-6 w-6 text-white/30" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Your message *"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  required
                  className="bg-white/5 border-white/10"
                />
                <Button type="submit" disabled={submitting} className="w-full bg-[#639922] text-black">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Feedback'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-foreground/40">No feedbacks yet. Be the first to share your experience!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition hover:border-[#639922]/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#639922]/10 text-[#639922] font-bold">
                    {fb.name.charAt(0)}
          </div>
                  <div>
                    <p className="font-semibold text-foreground">{fb.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < fb.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/30'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">"{fb.message}"</p>
                <p className="text-xs text-foreground/40 mt-3">
                  {new Date(fb.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;