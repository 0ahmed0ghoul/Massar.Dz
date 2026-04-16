import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Target, Users } from "lucide-react";

const UniversityDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">University Dashboard</h1>
        <p className="text-muted-foreground">Track student outcomes and program performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Students", value: "1,240", desc: "180 new this semester" },
          { icon: TrendingUp, label: "Employment Rate", value: "78%", desc: "+3% vs last year" },
          { icon: Target, label: "Field Match Rate", value: "64%", desc: "In field of study" },
          { icon: GraduationCap, label: "Ranking Score", value: "72.4", desc: "Top 15%" },
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
          <CardTitle className="text-base">Recent Student Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Sarah Wilson", field: "Computer Science", outcome: "Employed", company: "Google", inField: true },
              { name: "Mike Johnson", field: "Marketing", outcome: "Further Study", company: "MBA Program", inField: true },
              { name: "Lisa Park", field: "Engineering", outcome: "Employed", company: "Tesla", inField: true },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.field} → {s.company}</p>
                </div>
                <span className="text-xs font-medium text-success">{s.outcome}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityDashboard;
