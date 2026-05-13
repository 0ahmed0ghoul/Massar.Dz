// features/university/pages/UnifiedAnalyticsPage.tsx (SIMPLIFIED)
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Loader2, Users, Briefcase, GraduationCap,
  Search, TrendingUp, BarChart3, PieChartIcon, DollarSign,
  Target, Building2, School, CheckCircle2, XCircle, Eye,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

import { supabase } from "@/lib/supabaseClient";
import { DepartmentStats, DetailedStats, universityService } from "../services/university.analysis.service";
import { useUniversitySpecialities } from "../hooks/useUniversityStats";
import { useUniversityStudentConnection } from "@/features/department/hooks/useUniversityStudentConnection";

const COLORS = ["#639922", "#e2c245", "#3b82f6", "#ef4444", "#a855f7", "#f97316", "#06b6d4", "#ec489a"];
type ConnectionFilter = "all" | "connected" | "not_connected";

export default function UnifiedAnalyticsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const adminType = profile?.univ_admin_type;
  const universityName = profile?.university_name || decodeURIComponent(params.universityName || "");
  const departmentName = profile?.department;
  const specialityParam = decodeURIComponent(params.speciality || "");

  const isRectorate = adminType === "rectorate";
  const isDepartmentHead = adminType === "head_of_department";
  const viewingSpeciality = !!specialityParam;

  // ============== STATE ==============
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalGraduates, setTotalGraduates] = useState(0);
  const [allDepartments, setAllDepartments] = useState<{ department: string; count: number; hasConnection: boolean }[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<typeof allDepartments>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>("all");
  const [loading, setLoading] = useState(true);

  // Charts data
  const [charts, setCharts] = useState<DepartmentStats | null>(null);
  const [details, setDetails] = useState<DetailedStats | null>(null);

  const {
    registeredStudents,
  } = useUniversityStudentConnection(profile);
  const { specialities } = useUniversitySpecialities(isRectorate ? universityName : "");
  const connected = registeredStudents.filter(s => s.connection_status === "accepted").length;

  // ============== MAIN DATA FETCH ==============
  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isRectorate) {
          const [students, graduates, depts] = await Promise.all([
            universityService.getTotalConnectedStudents(profile.university_name),
            universityService.getTotalGraduates(profile.id),
            universityService.getAllDepartmentsWithStats(profile.id),
          ]);
          setTotalStudents(students);
          setTotalGraduates(graduates);
          setAllDepartments(depts);
          setFilteredDepartments(depts);
        } 
        else if (isDepartmentHead && departmentName) {
          // Get department overview
          const overview = await universityService.getDepartmentOverview(profile.id, departmentName);
          setTotalStudents(overview.totalStudents);
          setTotalGraduates(overview.totalGraduates);

          // Fetch responses for ALL graduated students in this university with matching speciality
          const { data: gradStudents } = await supabase
            .from('profiles')
            .select('id, speciality')
            .eq('university_name', universityName)
            .eq('department', departmentName)
            .eq('candidate_type', 'graduated');

          console.log("🎓 Graduated students in department:", gradStudents?.length);

          if (gradStudents && gradStudents.length > 0) {
            const studentIds = gradStudents.map(s => s.id);
            const responses = await universityService.getStudentResponses(studentIds);
            console.log("📊 Responses:", responses.length, responses.slice(0, 3));
            
            const chartData = universityService.calculateStats(responses);
            const detailData = universityService.calculateDetailedStats(responses, studentIds.length);
            
            console.log("📈 Chart data:", chartData);
            setCharts(chartData);
            setDetails(detailData);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, isRectorate, isDepartmentHead, departmentName, universityName]);

  // Also fetch when viewing a specific speciality
  useEffect(() => {
    if (!viewingSpeciality || !universityName || !specialityParam) return;
    
    const fetchSpecialityStats = async () => {
      setLoading(true);
      try {
        const [chartData, detailData] = await Promise.all([
          universityService.getDepartmentCharts(universityName, specialityParam),
          universityService.getDetailedStatistics(universityName, specialityParam),
        ]);
        setCharts(chartData);
        setDetails(detailData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialityStats();
  }, [viewingSpeciality, universityName, specialityParam]);

  // Filters
  useEffect(() => {
    let filtered = [...allDepartments];
    if (searchTerm.trim()) {
      filtered = filtered.filter(d => d.department.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (connectionFilter === "connected") filtered = filtered.filter(d => d.hasConnection);
    if (connectionFilter === "not_connected") filtered = filtered.filter(d => !d.hasConnection);
    setFilteredDepartments(filtered);
  }, [searchTerm, connectionFilter, allDepartments]);

  // ============== LOADING ==============
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  // ============== RENDER CHARTS ==============
  const renderCharts = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      {details && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4 text-[#639922]" />} label="Response Rate" value={`${details.responseRate.toFixed(1)}%`} sub={`${details.totalRespondents} of ${details.totalStudents}`} />
          <StatCard icon={<Briefcase className="h-4 w-4 text-blue-500" />} label="Employed" value={details.employedCount.toString()} sub={details.totalRespondents > 0 ? `${((details.employedCount/details.totalRespondents)*100).toFixed(1)}%` : "No data"} />
          <StatCard icon={<DollarSign className="h-4 w-4 text-[#e2c245]" />} label="Avg. Salary" value={`${details.averageSalary.toLocaleString()}DZ`} sub={`Median: ${details.medianSalary.toLocaleString()}DZ`} />
          <StatCard icon={<Target className="h-4 w-4 text-purple-500" />} label="Job Seeking" value={details.jobSearchingCount.toString()} sub={`${details.studyingCount} studying`} />
        </div>
      )}
      {/* Professional Situation Pie */}
      {charts && charts.situation.length > 0 && (
        <ChartCard title="Professional Situation" subtitle="Current status of graduates" icon={<PieChartIcon className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={charts.situation} dataKey="count" nameKey="answer" cx="50%" cy="50%" outerRadius={100} label={({ answer, count }) => `${answer.split('(')[0].trim()}: ${count}`}>
                {charts.situation.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Sectors Bar */}
      {charts && charts.sectors.length > 0 && (
        <ChartCard title="Sectors of Activity" icon={<Briefcase className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={Math.max(200, charts.sectors.length * 40)}>
            <BarChart data={charts.sectors} layout="vertical" margin={{ left: 150 }}>
              <XAxis type="number" />
              <YAxis dataKey="answer" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#639922" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Functions Bar */}
      {charts && charts.functions.length > 0 && (
        <ChartCard title="Primary Functions" icon={<BarChart3 className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={Math.max(200, charts.functions.length * 40)}>
            <BarChart data={charts.functions} layout="vertical" margin={{ left: 200 }}>
              <XAxis type="number" />
              <YAxis dataKey="answer" type="category" width={190} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#e2c245" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Salary */}
      {charts && charts.salaryDistribution.length > 0 && (
        <ChartCard title="Salary Distribution" icon={<DollarSign className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={charts.salaryDistribution}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#639922" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <SalaryTable data={charts.salaryDistribution} />
        </ChartCard>
      )}

      {/* Empty State */}
      {(!charts || (charts.situation.length === 0 && charts.sectors.length === 0)) && (
        <Card><CardContent className="py-12 text-center"><GraduationCap className="h-12 w-12 mx-auto text-foreground/20 mb-3" /><p className="text-foreground/40">No questionnaire responses yet</p></CardContent></Card>
      )}
    </div>
  );

  // ============== SPECIALITY VIEW ==============
  if (viewingSpeciality) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <div><h1 className="text-2xl font-bold">{specialityParam}</h1><p className="text-sm text-muted-foreground">{universityName}</p></div>
        </div>
        {renderCharts()}
      </div>
    );
  }

  // ============== RECTORATE VIEW ==============
  if (isRectorate) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">University Analytics</h1><p className="text-muted-foreground">{universityName}</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Connected Students</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Graduates</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalGraduates}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Specialities</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{allDepartments.length}</div></CardContent></Card>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative w-72"><Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" /></div>
          <Button variant={connectionFilter==="all"?"default":"outline"} size="sm" onClick={()=>setConnectionFilter("all")}>All</Button>
          <Button variant={connectionFilter==="connected"?"default":"outline"} size="sm" onClick={()=>setConnectionFilter("connected")}><CheckCircle2 className="h-4 w-4 mr-1"/>Connected</Button>
          <Button variant={connectionFilter==="not_connected"?"default":"outline"} size="sm" onClick={()=>setConnectionFilter("not_connected")}><XCircle className="h-4 w-4 mr-1"/>Not Connected</Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Specialities</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left py-2 px-4">Speciality</th><th className="text-left py-2 px-4">Students</th><th className="text-left py-2 px-4">Connection</th><th className="text-left py-2 px-4">Employed</th><th className="text-left py-2 px-4">Avg Salary</th><th className="text-left py-2 px-4">Actions</th></tr></thead>
              <tbody>
                {filteredDepartments.map(dept => {
                  const s = specialities.find(sp => sp.speciality === dept.department);
                  return (
                    <tr key={dept.department} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-2 px-4 font-medium">{dept.department}</td>
                      <td className="py-2 px-4">{dept.count}</td>
                      <td className="py-2 px-4"><Badge variant="outline" className={dept.hasConnection?"border-green-500/30 text-green-400":"border-red-500/30 text-red-400"}>{dept.hasConnection?"Connected":"Not Connected"}</Badge></td>
                      <td className="py-2 px-4">{s?.employedCount||"-"}</td>
                      <td className="py-2 px-4">{s?`${s.averageSalary.toLocaleString()}DZ`:"-"}</td>
                      <td className="py-2 px-4"><Button variant="ghost" size="sm" className="text-[#639922]" onClick={()=>navigate(`/university/analytics/${encodeURIComponent(universityName)}/${encodeURIComponent(dept.department)}`)}><Eye className="h-4 w-4 mr-1"/>View</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============== DEPARTMENT HEAD VIEW ==============
  if (isDepartmentHead) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Department Analytics</h1><p className="text-muted-foreground">{departmentName} • {universityName}</p></div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4 text-[#639922]" />} label="Connected Students" value={connected.toString()} />
          <StatCard icon={<GraduationCap className="h-4 w-4 text-blue-500" />} label="Total Graduates" value={totalGraduates.toString()} />
          <StatCard icon={<Briefcase className="h-4 w-4 text-[#e2c245]" />} label="Employed" value={details?.employedCount?.toString() || "-"} />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-purple-500" />} label="Response Rate" value={details ? `${details.responseRate.toFixed(1)}%` : "-"} />
        </div>


        <div className="grid gap-4 md:grid-cols-2">
          <Link to={`/university/analytics/${encodeURIComponent(universityName)}/${encodeURIComponent(departmentName||"")}`}>
            <Card className="cursor-pointer hover:bg-white/[0.05]"><CardContent className="pt-6 flex items-center gap-3"><BarChart3 className="h-8 w-8 text-[#639922]" /><div><p className="font-semibold">View Speciality Details</p><p className="text-sm text-foreground/40">Individual speciality statistics</p></div></CardContent></Card>
          </Link>
          <Card><CardContent className="pt-6 flex items-center gap-3"><School className="h-8 w-8 text-[#e2c245]" /><div><p className="font-semibold">{departmentName}</p><p className="text-sm text-foreground/40">{totalStudents} connected • {totalGraduates} graduates</p></div></CardContent></Card>
        </div>
      </div>
    );
  }

  return null;
}

// ============== HELPER COMPONENTS ==============

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <Card><CardContent className="pt-6"><div className="flex items-center gap-2">{icon}<p className="text-sm text-muted-foreground">{label}</p></div><p className="text-2xl font-bold mt-2">{value}</p>{sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}</CardContent></Card>
  );
}

function ChartCard({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="text-lg flex items-center gap-2">{icon && <span className="text-[#639922]">{icon}</span>}{title}</CardTitle>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</CardHeader><CardContent>{children}</CardContent></Card>
  );
}

function SalaryTable({ data }: { data: { range: string; count: number; avgSalary: number }[] }) {
  const total = data.reduce((s, i) => s + i.count, 0);
  return (
    <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="border-b border-white/10"><th className="text-left py-2 px-4">Range</th><th className="text-left py-2 px-4">Count</th><th className="text-left py-2 px-4">Avg</th><th className="text-left py-2 px-4">%</th></tr></thead><tbody>{data.map((item, idx) => { const pct = total>0?((item.count/total)*100).toFixed(1):0; return (<tr key={idx} className="border-b border-white/5"><td className="py-2 px-4">{item.range}</td><td className="py-2 px-4">{item.count}</td><td className="py-2 px-4">{item.avgSalary.toLocaleString()}DZ</td><td className="py-2 px-4"><div className="flex items-center gap-2"><div className="bg-white/10 rounded-full h-2 w-20"><div className="bg-[#639922] h-2 rounded-full" style={{width:`${pct}%`}}/></div><span className="text-xs">{pct}%</span></div></td></tr>); })}</tbody></table></div>
  );
}