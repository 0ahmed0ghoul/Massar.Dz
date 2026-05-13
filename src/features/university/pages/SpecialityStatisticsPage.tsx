// features/university/pages/SpecialityStatisticsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Briefcase, GraduationCap, TrendingUp, Building2,
  Loader2, PieChartIcon, BarChart3, DollarSign, Users, Target
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepartmentStats, DetailedStats, GraduateStatistics, universityService } from '../services/university.analysis.service';

const COLORS = ['#639922', '#e2c245', '#3b82f6', '#ef4444', '#a855f7', '#f97316', '#06b6d4', '#ec489a'];

export default function SpecialityStatisticsPage() {
  const { departmentName, speciality } = useParams();
  const { user } = useAuth();
  const decodedDepartment = decodeURIComponent(departmentName || '');
  const decodedSpeciality = decodeURIComponent(speciality || '');
  
  const [chartsData, setChartsData] = useState<DepartmentStats | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [graduateStats, setGraduateStats] = useState<GraduateStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !decodedDepartment || !decodedSpeciality) return;
    
    const fetchAllStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get university name first
        const universityName = await universityService.getUniversityName(user.id);
        if (!universityName) {
          setError("University not found");
          return;
        }

        // Fetch all stats in parallel
        const [charts, details, gradStats] = await Promise.all([
          universityService.getDepartmentCharts(universityName, decodedSpeciality),
          universityService.getDetailedStatistics(universityName, decodedSpeciality),
          universityService.getGraduateStatistics(user.id, decodedDepartment, decodedSpeciality)
        ]);

        setChartsData(charts);
        setDetailedStats(details);
        setGraduateStats(gradStats);
      } catch (err: any) {
        console.error('Error fetching statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [user, decodedDepartment, decodedSpeciality]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="py-4">
            <p className="text-center text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chartsData && !graduateStats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
            <p className="text-foreground/40">No data available for this speciality</p>
            <p className="text-xs text-foreground/30 mt-1">
              Data will appear once graduates complete the questionnaire
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to={`/university/analytics`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{decodedSpeciality}</h1>
          <p className="text-sm text-muted-foreground">
            {decodedDepartment} • Graduate Statistics
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      {detailedStats && graduateStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#639922]" />
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </div>
              <p className="text-2xl font-bold mt-2">
                {detailedStats.responseRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {detailedStats.totalRespondents} of {detailedStats.totalStudents} graduates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Employed</p>
              </div>
              <p className="text-2xl font-bold mt-2">{detailedStats.employedCount}</p>
              <div className="mt-2">
                <Progress value={graduateStats.employmentRate} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {graduateStats.employmentRate}% employment rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#e2c245]" />
                <p className="text-sm text-muted-foreground">Avg. Salary</p>
              </div>
              <p className="text-2xl font-bold mt-2">
                {detailedStats.averageSalary.toLocaleString()}DZ
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Median: {detailedStats.medianSalary.toLocaleString()}DZ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Job Seeking</p>
              </div>
              <p className="text-2xl font-bold mt-2">{detailedStats.jobSearchingCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {detailedStats.studyingCount} continuing studies
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Professional Situation - Pie Chart */}
      {chartsData && chartsData.situation.length > 0 && (
        <ChartCard 
          title="Professional Situation" 
          subtitle="Current status of graduates in this speciality"
          icon={<PieChartIcon className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                data={chartsData.situation} 
                dataKey="count" 
                nameKey="answer" 
                cx="50%" 
                cy="50%" 
                outerRadius={120} 
                label={({ answer, count, percent }) => 
                  `${answer.split('(')[0].trim()}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartsData.situation.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Sectors of Activity - Bar Chart */}
      {chartsData && chartsData.sectors.length > 0 && (
        <ChartCard 
          title="Sectors of Activity" 
          subtitle="Industry distribution of employed graduates"
          icon={<Briefcase className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartsData.sectors} layout="vertical" margin={{ left: 150 }}>
              <XAxis type="number" />
              <YAxis 
                dataKey="answer" 
                type="category" 
                width={140} 
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#639922" radius={[0, 4, 4, 0]} name="Graduates" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Primary Functions - Bar Chart */}
      {chartsData && chartsData.functions.length > 0 && (
        <ChartCard 
          title="Primary Functions" 
          subtitle="Role distribution of employed graduates"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartsData.functions} layout="vertical" margin={{ left: 200 }}>
              <XAxis type="number" />
              <YAxis 
                dataKey="answer" 
                type="category" 
                width={190} 
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#e2c245" radius={[0, 4, 4, 0]} name="Graduates" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Salary Distribution */}
      {chartsData && chartsData.salaryDistribution.length > 0 && (
        <ChartCard 
          title="Salary Distribution" 
          subtitle="Annual gross salary ranges"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.salaryDistribution}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'count') return [`${value} graduates`, 'Count'];
                    if (name === 'avgSalary') return [`${value.toLocaleString()}DZ`, 'Avg in Range'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#639922" name="Graduates" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Salary Range Details Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-4 font-semibold text-foreground/60">Salary Range</th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground/60">Graduates</th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground/60">Avg. in Range</th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground/60">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartsData.salaryDistribution.map((item, idx) => {
                    const total = chartsData.salaryDistribution.reduce((sum, i) => sum + i.count, 0);
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-2 px-4 font-medium">{item.range}</td>
                        <td className="py-2 px-4">{item.count}</td>
                        <td className="py-2 px-4">{item.avgSalary.toLocaleString()}DZ</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                              <div 
                                className="bg-[#639922] h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-foreground/40">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ChartCard>
      )}

      {/* Top Companies & Experience */}
      {graduateStats && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Companies */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#639922]" />
                Top Employers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {graduateStats.topCompanies.length > 0 ? (
                <div className="space-y-3">
                  {graduateStats.topCompanies.map((company, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground/60">
                          #{idx + 1}
                        </span>
                        <span className="font-medium">{company.company}</span>
                      </div>
                      <span className="text-sm font-semibold">{company.count} graduate{company.count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-foreground/40">No company data available</p>
              )}
            </CardContent>
          </Card>

          {/* Experience & Other Stats */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#e2c245]" />
                Experience & Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground/60">Average Experience</span>
                  <span className="font-semibold">{graduateStats.avgExperience.toFixed(1)} years</span>
                </div>
                <Progress value={Math.min(graduateStats.avgExperience * 10, 100)} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-foreground/40">Total Graduates</p>
                  <p className="text-lg font-bold">{graduateStats.totalGraduates}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-foreground/40">Employed</p>
                  <p className="text-lg font-bold">{graduateStats.employed}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-foreground/40">Employment Rate</p>
                  <p className="text-lg font-bold">{graduateStats.employmentRate}%</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-foreground/40">Other Statuses</p>
                  <p className="text-lg font-bold">
                    {detailedStats ? detailedStats.studyingCount + detailedStats.jobSearchingCount + detailedStats.otherCount : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state for no questionnaire data */}
      {(!chartsData || (chartsData.situation.length === 0 && chartsData.sectors.length === 0)) && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="py-12 text-center">
            <PieChartIcon className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
            <p className="text-foreground/40">No questionnaire responses yet</p>
            <p className="text-xs text-foreground/30 mt-1">
              Charts will appear once graduates complete the profile questionnaire
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function ChartCard({ 
  title, 
  subtitle, 
  icon, 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {icon && <span className="text-[#639922]">{icon}</span>}
          {title}
        </CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}