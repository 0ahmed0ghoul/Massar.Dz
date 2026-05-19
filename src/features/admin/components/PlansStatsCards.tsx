// features/admin/components/PlansStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Crown, DollarSign, Clock, CheckCircle, XCircle, Calendar, AlertTriangle } from "lucide-react";

interface PlansStatsCardsProps {
  stats: {
    totalPremiumUsers: number;
    totalRevenue: number;
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number;
    activePlans: number;
    expiringSoon: number;
    expiredPlans: number;
  };
}

export function PlansStatsCards({ stats }: PlansStatsCardsProps) {
  const statCards = [
    {
      title: "Premium Users",
      value: stats.totalPremiumUsers,
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toLocaleString()} DZD`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Active Plans",
      value: stats.activePlans,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Expired Plans",
      value: stats.expiredPlans,
      icon: Calendar,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/40">{stat.title}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}