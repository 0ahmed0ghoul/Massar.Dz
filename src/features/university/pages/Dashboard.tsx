// pages/university/UniversityDashboard.tsx
import { Users, UserCheck, UserPlus, UserX, Send, CheckCircle2, Clock } from "lucide-react";
import { useUniversityStudentConnection } from "../hooks/useUniversityStudentConnection";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export default function UniversityDashboard() {
    const { profile } = useAuth(); 
    const universityId = profile?.id; 

  const {
    registeredStudents,
    officialStudents,
    loading,
  } = useUniversityStudentConnection(universityId);

  // Stats based on registered students
  const totalRegistered = registeredStudents.length;
  const connected = registeredStudents.filter(s => s.connection_status === "connected").length;
  const pendingInvitations = registeredStudents.filter(s => s.connection_status === "pending").length;
  const rejected = registeredStudents.filter(s => s.connection_status === "rejected").length;
  const pendingReview = registeredStudents.filter(s => s.connection_status === "none").length;

  const officialCount = officialStudents.length;

  const stats = [
    {
      icon: Users,
      label: "Registered Students",
      value: totalRegistered,
      desc: "With completed profiles",
    },
    {
      icon: UserCheck,
      label: "Connected",
      value: connected,
      desc: "Successfully linked",
    },
    {
      icon: Send,
      label: "Pending Invitations",
      value: pendingInvitations,
      desc: "Awaiting student response",
    },
    {
      icon: Clock,
      label: "Pending Review",
      value: pendingReview,
      desc: "Waiting for admin action",
    },
  ];

  // Recent connection activities (last 5, sorted by most recent? - we need a date field)
  // For simplicity, we'll show the first 5 students with non‑none status
  const recentActivity = registeredStudents
    .filter(s => s.connection_status !== "none")
    .slice(0, 5);

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
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Department Dashboard</h1>
            <p className="text-sm text-foreground/40 sm:text-base">
              Overview of student registrations and connection status.
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
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
                    {loading ? "..." : s.value}
                  </div>
                  <p className="text-xs text-foreground/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Official Database Info */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Official Student Database</h2>
              </div>
              <p className="text-sm text-foreground/80">
                {officialStudents.length} official records uploaded.
                {officialStudents.length === 0 && " Please upload an XLSX file from the Students page."}
              </p>
            </div>
          </div>

          {/* Recent Connection Activity */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Recent Connection Activity</h2>
              </div>
              {loading ? (
                <p className="text-sm text-foreground/40">Loading...</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-foreground/40">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-foreground/40">
                          {student.student_id} • {student.speciality}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.connection_status === "connected" && (
                          <span className="rounded-full bg-[#639922]/10 px-2.5 py-0.5 text-xs font-medium text-[#639922]">
                            Connected
                          </span>
                        )}
                        {student.connection_status === "pending" && (
                          <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-500">
                            Invitation Sent
                          </span>
                        )}
                        {student.connection_status === "rejected" && (
                          <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary of Rejected Students (optional) */}
          {rejected > 0 && (
            <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
              <div className="p-5 sm:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <UserX className="h-5 w-5 text-red-400" />
                  <h2 className="text-lg font-semibold text-foreground">Rejected Requests</h2>
                </div>
                <p className="text-sm text-foreground/60">
                  {rejected} student{rejected !== 1 ? "s" : ""} need to update their profile before requesting again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}