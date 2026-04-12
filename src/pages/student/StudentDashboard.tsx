import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, FileText, Heart, Bell, User, ArrowRight, 
  TrendingUp, Calendar, Clock, Award, Star, Eye, Activity,
  Zap, Sparkles, CheckCircle2, Target, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { profile } = useAuth();
  const completeness = 45;

  // Data
  const stats = [
    { value: "12", label: "Applications", icon: FileText, trend: "+2 this week", color: "#639922" },
    { value: "5", label: "Interviews", icon: Calendar, trend: "Upcoming: 2", color: "#639922" },
    { value: "94%", label: "Match Rate", icon: Target, trend: "Top 15%", color: "#639922" },
    { value: "1,284", label: "Opportunities", icon: Activity, trend: "+23% vs last week", color: "#639922" },
  ];

  const recentApplications = [
    { title: "Product Manager", company: "Sonatrach Digital", status: "reviewing", date: "2024-01-15", match: 94 },
    { title: "Data Analyst", company: "Algerie Telecom", status: "shortlisted", date: "2024-01-14", match: 88 },
    { title: "UX Designer", company: "Yassir DZ", status: "pending", date: "2024-01-12", match: 76 },
  ];

  const recommendedJobs = [
    { title: "Full Stack Developer", company: "InnovateTech", salary: "80k - 120k", match: 95, tags: ["Remote", "Full-time"] },
    { title: "Product Manager", company: "Sonatrach Digital", salary: "90k - 130k", match: 94, tags: ["Hybrid", "Strategy"] },
    { title: "Data Scientist", company: "Ooredoo", salary: "85k - 115k", match: 88, tags: ["AI/ML", "Big Data"] },
  ];

  const activities = [
    { action: "Profile viewed by", company: "Sonatrach Digital", time: "2 hours ago", icon: Eye },
    { action: "Application shortlisted", company: "Algerie Telecom", time: "1 day ago", icon: CheckCircle2 },
    { action: "New job match", company: "Product Manager at Sonatrach", time: "2 days ago", icon: Zap },
    { action: "Skill assessment completed", company: "Python Expert", time: "3 days ago", icon: Award },
  ];

  const upcomingInterviews = [
    { role: "Product Manager", company: "Sonatrach Digital", date: "Tomorrow", time: "2:00 PM", type: "Technical" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted": return "bg-[#639922]/20 text-[#639922] border-[#639922]/30";
      case "reviewing": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-white/10 text-white/40 border-white/10";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "shortlisted": return "Shortlisted";
      case "reviewing": return "Under Review";
      case "pending": return "Pending";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Stats */}
      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border border-white/[0.09] bg-white/[0.04] backdrop-blur-md hover:border-[#639922]/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#639922]/15">
                    <stat.icon className="h-4 w-4 text-[#639922]" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
                <TrendingUp className="h-3 w-3 text-[#639922]" />
              </div>
              <p className="mt-2 text-[10px] text-[#639922]">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Completeness Card - FIXED */}
      <Card className="border border-white/[0.09] bg-gradient-to-r from-[#639922]/5 to-transparent backdrop-blur-md">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-[#639922]" />
              <p className="font-medium text-white">Profile Completeness</p>
            </div>
            <p className="text-sm text-white/40">Complete your profile to unlock more features and get better job matches.</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={completeness} className="h-2 flex-1 bg-white/10" />
              <span className="text-xs font-medium text-[#639922]">{completeness}%</span>
            </div>
          </div>
          <Button 
            size="sm" 
            asChild 
            className="bg-[#639922] text-white hover:bg-[#4f7a1a] transition-all duration-300 group"
          >
            <Link to="/dashboard/student/profile">
              Complete Profile 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card className="border border-white/[0.09] bg-white/[0.04] backdrop-blur-md">
          <CardHeader className="border-b border-white/[0.07] pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-white/40 hover:text-white">
                <Link to="/dashboard/student/applications">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.title} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.06] p-3 hover:border-[#639922]/30 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-white">{app.title}</p>
                      <Badge className={`${getStatusColor(app.status)} border text-[10px]`}>
                        {getStatusText(app.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-white/40">{app.company}</p>
                      <div className="flex items-center gap-1 text-xs text-white/30">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(app.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#639922]">{app.match}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Match for You - FIXED */}
        <Card className="border border-white/[0.09] bg-gradient-to-br from-[#639922]/5 to-transparent backdrop-blur-md">
          <CardHeader className="border-b border-white/[0.07] pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#639922]" />
              <CardTitle className="text-base text-white">Top Match for You</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {recommendedJobs.slice(0, 1).map((job) => (
              <div key={job.title} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{job.title}</p>
                    <p className="text-sm text-white/40 mt-1">{job.company}</p>
                  </div>
                  <Badge className="bg-[#639922]/15 text-[#639922] border-[#639922]/30 text-sm px-3 py-1">
                    {job.match}% Match
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-0.5 text-xs text-white/55">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full rounded-full bg-[#639922]" style={{ width: `${job.match}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-[#639922]">{job.match}%</span>
                </div>
                <Button className="w-full bg-[#639922] text-white hover:bg-[#4f7a1a] mt-2">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* More Recommendations */}
      <Card className="border border-white/[0.09] bg-white/[0.04] backdrop-blur-md">
        <CardHeader className="border-b border-white/[0.07] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#639922]" />
              <CardTitle className="text-base text-white">Recommended for You</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-white/40 hover:text-white">
              <Link to="/dashboard/student/jobs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {recommendedJobs.slice(1).map((job) => (
              <div key={job.title} className="group rounded-lg border border-white/[0.08] bg-white/[0.06] p-3 hover:border-[#639922]/30 transition-all hover:bg-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-white">{job.title}</p>
                    <p className="text-xs text-white/40 mt-1">{job.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-emerald-400">{job.salary}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-[#639922]" />
                        <span className="text-xs text-white/60">{job.match}% match</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white/40 hover:text-[#639922] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline & Upcoming Interviews */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border border-white/[0.09] bg-white/[0.04] backdrop-blur-md">
          <CardHeader className="border-b border-white/[0.07] pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#639922]" />
              <CardTitle className="text-base text-white">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#639922]/15 p-1.5">
                    <activity.icon className="h-3 w-3 text-[#639922]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-white/40">{activity.company}</p>
                  </div>
                  <span className="text-xs text-white/30">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="border border-white/[0.09] bg-gradient-to-r from-[#639922]/5 to-transparent backdrop-blur-md">
          <CardHeader className="border-b border-white/[0.07] pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#639922]" />
              <CardTitle className="text-base text-white">Upcoming Interviews</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{interview.role}</p>
                      <p className="text-sm text-white/40">{interview.company}</p>
                    </div>
                    <Badge className="bg-[#639922]/15 text-[#639922] border-[#639922]/30">
                      {interview.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/60">📅 {interview.date}</span>
                    <span className="text-white/60">⏰ {interview.time}</span>
                  </div>
                  <Button variant="outline" className="w-full border-white/15 text-white hover:bg-white/10 hover:border-white/30">
                    Prepare for Interview
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-white/40">No upcoming interviews</p>
                <Button variant="link" className="text-[#639922] mt-2">
                  Browse jobs instead
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">Top 15%</div>
          <div className="text-xs text-white/40 mt-1">Candidate Rank</div>
          <BarChart3 className="h-3 w-3 text-[#639922] mx-auto mt-2" />
        </div>
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">3.2K</div>
          <div className="text-xs text-white/40 mt-1">Job Matches</div>
        </div>
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">92%</div>
          <div className="text-xs text-white/40 mt-1">Profile Views</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;