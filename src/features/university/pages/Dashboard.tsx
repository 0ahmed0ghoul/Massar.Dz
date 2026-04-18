import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Target, Users, Newspaper } from "lucide-react";
import { useUniversityData } from "../hooks/useUniversityData";

export default function UniversityDashboard() {
  const { students } = useUniversityData();

  // News: students who have an outcome (job/internship) in the last 30 days
  const recentPlacements = students
    .filter((s) => s.outcome && new Date(s.outcome.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map((s) => ({
      name: s.name,
      field: s.field,
      outcome: s.outcome!.outcome,
      company: s.outcome!.company,
    }));

  const totalStudents = students.length;
  const employed = students.filter((s) => s.outcome?.outcome === "Employed").length;
  const employmentRate = totalStudents ? Math.round((employed / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">University Dashboard</h1>
        <p className="text-muted-foreground">Track student outcomes and program performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Students", value: totalStudents, desc: "All enrolled" },
          { icon: TrendingUp, label: "Employment Rate", value: `${employmentRate}%`, desc: "Graduates employed" },
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

      {/* News Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4" /> Recent Placements & Internships
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPlacements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent placements to show.</p>
          ) : (
            <div className="space-y-3">
              {recentPlacements.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.field} → {p.outcome} at {p.company}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-green-600">Just landed!</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Student Outcomes (unchanged) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Student Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.field} → {s.outcome?.company || "Still studying"}
                  </p>
                </div>
                <span className="text-xs font-medium text-success">{s.outcome?.outcome || "Enrolled"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}