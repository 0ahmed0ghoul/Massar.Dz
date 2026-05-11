// features/university/pages/SpecialityStatisticsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Briefcase, GraduationCap, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { universityAnalyticsService } from '../services/university.analysis.service';

export default function SpecialityStatisticsPage() {
  const { departmentName, speciality } = useParams();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !departmentName || !speciality) return;
    const fetch = async () => {
      try {
        const data = await universityAnalyticsService.getGraduateStatistics(
          user.id,
          decodeURIComponent(departmentName),
          decodeURIComponent(speciality)
        );
        setStats(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user, departmentName, speciality]);

  if (loading) return <div>Loading graduate statistics...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/university/analytics/departments/${encodeURIComponent(departmentName!)}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{decodeURIComponent(speciality!)}</h1>
          <p className="text-muted-foreground">{decodeURIComponent(departmentName!)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Graduates</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.totalGraduates}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employed</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employed}</div>
            <Progress value={stats.employmentRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.employmentRate.toFixed(1)}% employed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.avgExperience.toFixed(1)} years</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Employers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.topCompanies.length ? (
              <div className="text-sm space-y-1">
                {stats.topCompanies.slice(0, 3).map(c => (
                  <div key={c.company}>{c.company} ({c.count})</div>
                ))}
              </div>
            ) : <span className="text-sm text-muted-foreground">—</span>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Companies</CardTitle></CardHeader>
          <CardContent>
            {stats.topCompanies.length ? (
              <div className="space-y-2">
                {stats.topCompanies.map(c => (
                  <div key={c.company} className="flex justify-between">
                    <span>{c.company}</span>
                    <span className="font-semibold">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground">No company data</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Experience Distribution</CardTitle></CardHeader>
          <CardContent>
            {/* Mock distribution, you can expand later */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>0–2 years</span><span>—</span></div>
              <div className="flex justify-between text-sm"><span>2–5 years</span><span>—</span></div>
              <div className="flex justify-between text-sm"><span>5+ years</span><span>—</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}