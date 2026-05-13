// features/university/pages/Dashboard.tsx
import { Users, UserCheck, UserPlus, UserX, Send, CheckCircle2, Clock, BarChart3, School, TrendingUp, Building2 } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUniversityStudentConnection } from "@/features/department/hooks/useUniversityStudentConnection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { profile } = useAuth();
  const universityId = profile?.id;
  const univAdminType = profile?.univ_admin_type; // 'head_of_department' or 'rectorate'
  const universityName = profile?.university_name;
  const departmentName = profile?.department;

  const {
    registeredStudents,
    officialStudents,
    loading: connectionLoading,
  } = useUniversityStudentConnection(profile);
  console.log("🚀 [Dashboard] registeredStudents:", registeredStudents);
  console.log("🚀 [Dashboard] officialStudents:", officialStudents);
  // Fetch university statistics for rectorate
  const { 
    stats: universityStats, 
    loading: statsLoading 
  } = useUniversityStatistics(univAdminType === 'rectorate' ? universityName || '' : '');

  // Fetch department overview for department head
  const { 
    overview: departmentOverview, 
    loading: deptOverviewLoading 
  } = useDepartmentOverview(
    univAdminType === 'head_of_department' ? universityId || '' : '',
    univAdminType === 'head_of_department' ? departmentName || '' : ''
  );

  // Stats based on registered students (for head_of_department)
  const totalRegistered = registeredStudents.length;
  const connected = registeredStudents.filter(s => s.connection_status === "accepted").length;
  const pendingInvitations = registeredStudents.filter(s => s.connection_status === "pending").length;
  const pendingReview = registeredStudents.filter(s => s.connection_status === "none").length;

  const departmentStats = [
    {
      icon: Users,
      label: "Registered Students",
      value: totalRegistered,
      desc: "With completed profiles",
      color: "text-[#639922]",
    },
    {
      icon: Send,
      label: "Pending Invitations",
      value: pendingInvitations,
      desc: "Awaiting student response",
      color: "text-yellow-500",
    },
    {
      icon: Clock,
      label: "Pending Review",
      value: pendingReview,
      desc: "Waiting for admin action",
      color: "text-purple-500",
    },
  ];

  // Recent connection activities
  const recentActivity = registeredStudents
    .filter(s => s.connection_status !== "none")
    .slice(0, 5);

  // Calculate rectorate statistics
  const totalSpecialities = universityStats?.specialitiesCount || 0;
  const totalGraduates = universityStats?.totalGraduates || 0;
  const totalEmployed = universityStats?.aggregatedDetails?.employedCount || 0;
  const overallAvgSalary = universityStats?.aggregatedDetails?.averageSalary || 0;
  const responseRate = universityStats?.overallResponseRate || 0;

  const isLoading = univAdminType === 'rectorate' ? statsLoading : connectionLoading || deptOverviewLoading;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {univAdminType === 'rectorate' ? 'University Dashboard' : 'Department Dashboard'}
            </h1>
            <p className="text-sm text-foreground/40 sm:text-base">
              {univAdminType === 'rectorate' 
                ? `Overview of all departments in ${universityName}`
                : `Manage ${departmentName} - Student registrations and connections`
              }
            </p>
          </div>

          {/* DEPARTMENT HEAD VIEW */}
          {univAdminType === 'head_of_department' && (
            <>
              {/* Stats Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {departmentStats.map((s) => (
                  <div
                    key={s.label}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium uppercase tracking-wider text-foreground/50">
                        {s.label}
                      </p>
                      <s.icon className="h-4 w-4 text-foreground/40 group-hover:text-[#639922] transition-colors" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-foreground">
                        {connectionLoading ? "..." : s.value}
                      </div>
                      <p className="text-xs text-foreground/40">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Overview Cards */}
              {departmentOverview && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <p className="text-sm text-muted-foreground">Total Graduates</p>
                      </div>
                      <p className="text-2xl font-bold mt-2">{departmentOverview.totalGraduates}</p>
                      <p className="text-xs text-muted-foreground mt-1">In {departmentName}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-[#639922]" />
                        <p className="text-sm text-muted-foreground">Connected Students</p>
                      </div>
                      <p className="text-2xl font-bold mt-2">{connected}</p>
                      <p className="text-xs text-muted-foreground mt-1">Active connections</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/department/dashboard/invitations">
                  <Card className="cursor-pointer hover:bg-white/[0.05] transition-all border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Send className="h-8 w-8 text-[#639922]" />
                        <div>
                          <p className="font-semibold">Manage Invitations</p>
                          <p className="text-sm text-foreground/40">
                            {pendingInvitations} pending invitations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/university/analytics">
                  <Card className="cursor-pointer hover:bg-white/[0.05] transition-all border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-[#e2c245]" />
                        <div>
                          <p className="font-semibold">Department Statistics</p>
                          <p className="text-sm text-foreground/40">View graduate outcomes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </>
          )}

          {/* RECTORATE VIEW */}
          {univAdminType === 'rectorate' && (
            <>
              {statsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
                </div>
              ) : universityStats && universityStats.totalGraduates > 0 ? (
                <>
                  {/* Overview Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-white/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-[#639922]" />
                          <p className="text-sm text-muted-foreground">Departments</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">{totalSpecialities}</p>
                        <p className="text-xs text-muted-foreground mt-1">Active specialities</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <p className="text-sm text-muted-foreground">Total Graduates</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">{totalGraduates}</p>
                        <p className="text-xs text-muted-foreground mt-1">Registered on platform</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#e2c245]" />
                          <p className="text-sm text-muted-foreground">Employed</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">{totalEmployed}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {responseRate.toFixed(1)}% response rate
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-500" />
                          <p className="text-sm text-muted-foreground">Avg. Salary</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">{overallAvgSalary.toLocaleString()}DZ</p>
                        <p className="text-xs text-muted-foreground mt-1">Annual gross</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Specialities Summary */}
                  <Card className="border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#639922]" />
                        Specialities Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {universityStats.specialities.length === 0 ? (
                        <p className="text-center py-8 text-foreground/40">
                          No specialities with graduates yet
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Speciality</th>
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Graduates</th>
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Response Rate</th>
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Employed</th>
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Avg. Salary</th>
                                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {universityStats.specialities
                                .sort((a, b) => b.totalGraduates - a.totalGraduates)
                                .slice(0, 10) // Show top 10
                                .map((speciality) => (
                                  <tr key={speciality.speciality} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3 px-4 font-medium">{speciality.speciality}</td>
                                    <td className="py-3 px-4">{speciality.totalGraduates}</td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[60px]">
                                          <div 
                                            className="bg-[#639922] h-2 rounded-full" 
                                            style={{ width: `${Math.min(speciality.responseRate, 100)}%` }}
                                          />
                                        </div>
                                        <span className="text-xs">{speciality.responseRate.toFixed(0)}%</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">{speciality.employedCount}</td>
                                    <td className="py-3 px-4">{speciality.averageSalary.toLocaleString()}DZ</td>
                                    <td className="py-3 px-4">
                                      <Link
                                        to={`/university/analytics/${encodeURIComponent(universityName || '')}/${encodeURIComponent(speciality.speciality)}`}
                                      >
                                        <Button variant="ghost" size="sm" className="text-[#639922] hover:text-[#4f7a1a]">
                                          View Stats
                                        </Button>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link to={`/university/analytics`}>
                      <Card className="cursor-pointer hover:bg-white/[0.05] transition-all border-white/10">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-[#639922]" />
                            <div>
                              <p className="font-semibold">View Detailed Analytics</p>
                              <p className="text-sm text-foreground/40">See all department statistics</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Card className="border-white/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <School className="h-8 w-8 text-[#e2c245]" />
                          <div>
                            <p className="font-semibold">{totalSpecialities} Departments Active</p>
                            <p className="text-sm text-foreground/40">
                              {totalGraduates} graduates registered
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="border-white/10">
                  <CardContent className="py-12 text-center">
                    <School className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
                    <p className="text-foreground/40">No statistics available yet</p>
                    <p className="text-xs text-foreground/30 mt-1">
                      Data will appear once graduates complete the questionnaire
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing GraduationCap import
import { GraduationCap } from "lucide-react";
import { useDepartmentOverview, useUniversityStatistics } from "@/features/university/hooks/useUniversityStats";
