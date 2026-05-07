// pages/admin/FeedbacksPage.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminFeedbacks } from '@/features/landing/hooks/useAdminFeedbacks';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-600' },
  approved: { label: 'Approved', color: 'bg-green-600' },
  rejected: { label: 'Rejected', color: 'bg-red-600' },
};

export default function FeedbacksPage() {
  const { feedbacks, loading, actionLoading, updateStatus, deleteFeedback } = useAdminFeedbacks();
  const [filter, setFilter] = useState<string>('all');

  const filtered = feedbacks.filter(f => filter === 'all' ? true : f.status === filter);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#639922]" /></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Feedback Management</h1>

      <div className="flex gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pending</Button>
        <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>Approved</Button>
        <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>Rejected</Button>
      </div>

      <div className="grid gap-4">
        {filtered.map((fb) => (
          <Card key={fb.id} className="border-white/10 bg-white/[0.02]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground">{fb.name}</CardTitle>
                  <p className="text-sm text-foreground/60">{fb.email || 'No email'}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(fb.id, 'approved', true)}
                    disabled={actionLoading === fb.id}
                    className="border-green-500/30 text-green-400"
                  >
                    {actionLoading === fb.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(fb.id, 'rejected', false)}
                    disabled={actionLoading === fb.id}
                    className="border-red-500/30 text-red-400"
                  >
                    {actionLoading === fb.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFeedback(fb.id)}
                    disabled={actionLoading === fb.id}
                    className="border-white/20 text-red-400"
                  >
                    {actionLoading === fb.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < fb.rating ? 'text-yellow-500' : 'text-white/30'}>★</span>
                  ))}
                </div>
                <Badge className={statusConfig[fb.status].color}>{statusConfig[fb.status].label}</Badge>
                {fb.is_visible && <Eye className="h-3 w-3 text-green-500" />}
              </div>
              <p className="text-foreground/80">{fb.message}</p>
              <p className="text-xs text-foreground/40 mt-2">{format(new Date(fb.created_at), 'PPP p')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}