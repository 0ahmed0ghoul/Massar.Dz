import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, School, Briefcase, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Users, label: "Total Users", value: "48,200" },
          { icon: Building2, label: "Companies", value: "850" },
          { icon: School, label: "Universities", value: "124" },
          { icon: Briefcase, label: "Active Jobs", value: "2,410" },
          { icon: DollarSign, label: "MRR", value: "$24,500" },
          { icon: TrendingUp, label: "Growth", value: "+12%" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
