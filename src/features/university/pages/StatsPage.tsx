// pages/university/dashboard/StatsPage.tsx
import { useUniversityStats } from '@/features/university/hooks/useUniversityStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, GraduationCap, Award, Briefcase, TrendingUp, 
  BarChart3, PieChart, Loader2, Star, FileText, CheckCircle2 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#639922', '#3B6D11', '#8CBA4A', '#2B4F0E', '#A8D85A', '#4F7A1A'];

export default function UniversityStatsPage() {
  const { stats, loading } = useUniversityStats();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  const pieData = Object.entries(stats.studentsByStatus).map(([name, value]) => ({ name, value }));
  const specialityData = Object.entries(stats.studentsBySpeciality).slice(0, 5).map(([name, value]) => ({ name, value }));
  const certData = Object.entries(stats.certificatesByType).map(([name, value]) => ({ name, value }));
  const appStatusData = Object.entries(stats.applicationsByStatus).map(([name, value]) => ({ name, value }));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Department Analytics</h1>
          <p className="text-sm text-foreground/40">Comprehensive statistics about your students, skills, and outcomes.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#639922]/10">
                <Users className="h-6 w-6 text-[#639922]" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Award className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Certificates Issued</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalCertificates}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Briefcase className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Employment Rate</p>
                <p className="text-3xl font-bold text-foreground">{stats.employmentRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <Star className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Stars Certificate</p>
                <p className="text-3xl font-bold text-foreground">{stats.starsCertificateHolders}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 rounded-full p-1">
            <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-[#639922]">Overview</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-full data-[state=active]:bg-[#639922]">Skills & Certificates</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-full data-[state=active]:bg-[#639922]">Applications & Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Student Status Distribution */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Student Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Specialities */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Top Specialities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={specialityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#fff' }} />
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Bar dataKey="value" fill="#639922" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Academic Year Distribution */}
            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Students by Academic Year</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(stats.studentsByYear).map(([year, count]) => ({ year, count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="year" tick={{ fill: '#fff' }} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                    <Bar dataKey="count" fill="#8CBA4A" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Skills */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Most Popular Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.topSkills} layout="vertical" margin={{ left: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis type="number" tick={{ fill: '#fff' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#fff' }} width={100} />
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Bar dataKey="count" fill="#639922" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Certificates Distribution */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Certificates Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie data={certData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {certData.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Applications by Status */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Application Statuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie data={appStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {appStatusData.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Application Trend */}
              <Card className="border-white/[0.07] bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Applications Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.applicationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                      <YAxis tick={{ fill: '#fff' }} />
                      <Tooltip contentStyle={{ background: '#1a1c22', border: 'none' }} />
                      <Line type="monotone" dataKey="count" stroke="#639922" strokeWidth={2} dot={{ fill: '#639922' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}