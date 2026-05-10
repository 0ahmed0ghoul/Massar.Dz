// features/company/components/AnalyticsModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { getApplicationAnalytics } from "../service/analytics.service";

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
}

export function AnalyticsModal({ open, onOpenChange, jobId }: AnalyticsModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ daily: any[]; funnel: any[] } | null>(null);

  useEffect(() => {
    if (open && jobId) {
      setLoading(true);
      getApplicationAnalytics(jobId)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, jobId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/10 bg-[#0f1117] text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#639922]" />
            Advanced Analytics (Premium)
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#639922]" /></div>
        ) : data ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Applications Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.daily}>
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1f1f1f", border: "none" }} />
                  <Line type="monotone" dataKey="count" stroke="#639922" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Funnel</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.funnel}>
                  <XAxis dataKey="stage" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1f1f1f", border: "none" }} />
                  <Bar dataKey="count" fill="#639922" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-center text-white/40 py-8">No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}