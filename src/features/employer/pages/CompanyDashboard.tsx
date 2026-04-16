import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Eye, TrendingUp } from "lucide-react";

const CompanyDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground">Manage your jobs and candidates.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Briefcase, label: "Active Jobs", value: "3", desc: "2 drafts" },
          { icon: Users, label: "Applications", value: "47", desc: "12 new this week" },
          { icon: Eye, label: "Job Views", value: "1,240", desc: "Last 30 days" },
          { icon: TrendingUp, label: "Conversion", value: "3.8%", desc: "View → apply" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Jane Doe", job: "Frontend Developer", status: "pending", score: 87 },
              { name: "John Smith", job: "Backend Engineer", status: "reviewing", score: 72 },
              { name: "Alice Chen", job: "Frontend Developer", status: "shortlisted", score: 94 },
            ].map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">Applied for {a.job}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Match: {a.score}%</span>
                  <Badge variant={a.status === "shortlisted" ? "default" : "secondary"}>
                    {a.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
