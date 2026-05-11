import { Users, TrendingUp, Target, GraduationCap, Newspaper, Mail, MessageCircle } from "lucide-react";
import { useUniversityData } from "../hooks/useUniversityData";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VerifyMatchModal } from "../components/VerifyMatchModal";
import { useMessaging } from "@/features/messaging/hooks/useMessaging";

export default function UniversityDashboard() {
  const { students, invitations, acceptInvitation, rejectInvitation, getPendingInvitations } = useUniversityData();
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const navigate = useNavigate();
  const { startConversation } = useMessaging();

  const pendingInvitations = getPendingInvitations();
  const recentPlacements = students
    .filter((s) => s.outcome && new Date(s.outcome.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map((s) => ({
      name: `${s.firstName} ${s.lastName}`,
      field: s.speciality,
      outcome: s.outcome!.outcome,
      company: s.outcome!.company,
    }));

  const totalStudents = students.length;
  const employed = students.filter((s) => s.outcome?.outcome === "Employed").length;
  const employmentRate = totalStudents ? Math.round((employed / totalStudents) * 100) : 0;

  const stats = [
    { icon: Users, label: "Total Students", value: totalStudents, desc: "All enrolled" },
    { icon: TrendingUp, label: "Employment Rate", value: `${employmentRate}%`, desc: "Graduates employed" },
    { icon: Target, label: "Field Match Rate", value: "64%", desc: "In field of study" },
    { icon: GraduationCap, label: "Ranking Score", value: "72.4", desc: "Top 15%" },
  ];

  const handleMessageStudent = async (studentId: string) => {
    const universityId = "uni_001"; // replace with actual university ID from auth
    const conversation = await startConversation(studentId, universityId);
    navigate(`/messages/${conversation.id}`);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background elements unchanged */}
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Department Dashboard</h1>
            <p className="text-sm text-foreground/40 sm:text-base">Manage connections, track student outcomes.</p>
          </div>

          {/* Stats Grid unchanged */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-[#639922]/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium uppercase tracking-wider text-foreground/50">{s.label}</p>
                  <s.icon className="h-4 w-4 text-foreground/40 group-hover:text-[#639922] transition-colors" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <p className="text-xs text-foreground/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Invitations Section unchanged */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Pending Connection Requests</h2>
                {pendingInvitations.length > 0 && (
                  <span className="ml-auto rounded-full bg-[#639922]/20 px-2 py-0.5 text-xs text-[#639922]">
                    {pendingInvitations.length} new
                  </span>
                )}
              </div>
              {pendingInvitations.length === 0 ? (
                <p className="text-sm text-foreground/40">No pending invitations.</p>
              ) : (
                <div className="space-y-3">
                  {pendingInvitations.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{inv.profileData?.firstName} {inv.profileData?.lastName}</p>
                        <p className="text-xs text-foreground/40">{inv.profileData?.email} • {inv.profileData?.speciality}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setSelectedInvitation(inv)} className="bg-[#639922] text-foreground hover:bg-[#4f7a1a] text-xs">
                          Verify & Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rejectInvitation(inv.id, inv.studentId)} className="border-white/20 text-foreground/80 hover:bg-white/10">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingInvitations.length > 3 && (
                    <p className="text-center text-xs text-foreground/40">+ {pendingInvitations.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Placements unchanged */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Recent Placements & Internships</h2>
              </div>
              {recentPlacements.length === 0 ? (
                <p className="text-sm text-foreground/40">No recent placements to show.</p>
              ) : (
                <div className="space-y-3">
                  {recentPlacements.map((p) => (
                    <div key={p.name} className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-foreground/40">{p.field} → {p.outcome} at {p.company}</p>
                      </div>
                      <span className="self-start rounded-full bg-[#639922]/10 px-2.5 py-0.5 text-xs font-medium text-[#639922] sm:self-center">Just landed!</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Student Outcomes – with Message button */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
            <div className="p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Student Outcomes</h2>
              <div className="space-y-3">
                {students.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-foreground/40">
                        {s.speciality} → {s.outcome?.company || "Still studying"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium sm:self-center ${
                        s.outcome?.outcome === "Employed"
                          ? "bg-[#639922]/10 text-[#639922]"
                          : "bg-white/10 text-foreground/60"
                      }`}>
                        {s.outcome?.outcome || "Enrolled"}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMessageStudent(s.id)}
                        className="text-foreground/60 hover:text-[#639922]"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedInvitation && (
        <VerifyMatchModal
          open={!!selectedInvitation}
          onOpenChange={() => setSelectedInvitation(null)}
          invitation={selectedInvitation}
          students={students}
          onAccept={() => {
            acceptInvitation(selectedInvitation.id, selectedInvitation.studentId);
            setSelectedInvitation(null);
          }}
          onReject={() => {
            rejectInvitation(selectedInvitation.id, selectedInvitation.studentId);
            setSelectedInvitation(null);
          }}
        />
      )}
    </div>
  );
}