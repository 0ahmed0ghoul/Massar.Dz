// features/company/components/AnalyticsModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getApplicationAnalytics } from "../service/analytics.service";

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
}

// 👇 force integers everywhere
const toInt = (value: any) => Math.round(Number(value || 0));

// 👇 custom tooltip to avoid floats
const integerTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#1f1f1f] p-2 rounded text-sm border border-white/10">
      <p className="text-white/70">{label}</p>
      <p className="text-[#639922]">
        Count: {toInt(payload[0].value)}
      </p>
    </div>
  );
};

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

  // 👇 normalize data to integers BEFORE rendering
  const normalizedData = data
    ? {
        daily: data.daily.map((d) => ({
          ...d,
          count: toInt(d.count),
        })),
        funnel: data.funnel.map((d) => ({
          ...d,
          count: toInt(d.count),
        })),
      }
    : null;

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
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
          </div>
        ) : normalizedData ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Applications Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={normalizedData.daily}>
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis
                    stroke="#888"
                    allowDecimals={false}   // ✅ key fix
                    tickFormatter={toInt}   // ✅ force integer labels
                  />
                  <Tooltip content={integerTooltip} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#639922"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Funnel</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={normalizedData.funnel}>
                  <XAxis dataKey="stage" stroke="#888" />
                  <YAxis
                    stroke="#888"
                    allowDecimals={false}   // ✅ removes floats
                    tickFormatter={toInt}
                  />
                  <Tooltip content={integerTooltip} />
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