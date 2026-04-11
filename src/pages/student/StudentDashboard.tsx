import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Heart, Bell, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const completeness = 45;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">Here's your career overview.</p>
      </div>

      {/* Profile completeness */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-medium">Profile Completeness</p>
            <p className="text-sm text-muted-foreground">Complete your profile to unlock more features.</p>
            <Progress value={completeness} className="mt-3 h-2" />
            <p className="mt-1 text-xs text-muted-foreground">{completeness}% complete</p>
          </div>
          <Button size="sm" asChild>
            <Link to="/dashboard/student/profile">Complete Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FileText, label: "Applications", value: "3", desc: "This month" },
          { icon: Heart, label: "Saved Jobs", value: "12", desc: "Active listings" },
          { icon: Briefcase, label: "Interviews", value: "1", desc: "Upcoming" },
          { icon: Bell, label: "Notifications", value: "5", desc: "Unread" },
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

      {/* Recent applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Frontend Developer", company: "TechCorp", status: "reviewing" },
              { title: "Data Analyst Intern", company: "DataViz", status: "pending" },
              { title: "UX Designer", company: "DesignStudio", status: "shortlisted" },
            ].map((a) => (
              <div key={a.title} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.company}</p>
                </div>
                <Badge variant={a.status === "shortlisted" ? "default" : "secondary"}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
