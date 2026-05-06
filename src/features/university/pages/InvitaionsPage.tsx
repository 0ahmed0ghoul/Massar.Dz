// features/university/pages/InvitationsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, XCircle, Eye, Loader2 } from "lucide-react";
import { useUniversityInvitations } from "../hooks/useUniversityInvitations";
import { useUniversityStudentConnection } from "../hooks/useUniversityStudentConnection";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { VerifyMatchModal } from "../components/VerifyMatchModal";

export default function InvitationsPage() {
  const { profile } = useAuth();
  const universityId = profile?.id;

  const { pending, history, loading, actionLoading, acceptInvitation, rejectInvitation } =
    useUniversityInvitations();
  const { officialStudents, loading: studentsLoading } = useUniversityStudentConnection(universityId);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);

  if (loading || studentsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  const getProfileValue = (profile: any, field: string) => {
    if (!profile) return "—";
    const value = profile[field];
    return value && value.trim() !== "" ? value : "—";
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background (same as before) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Connection Invitations
            </h1>
            <p className="text-sm text-foreground/40">
              Review and accept student connection requests.
            </p>
          </div>

          {/* Pending Invitations */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#639922]" /> Pending ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="text-foreground/40 text-sm">No pending invitations.</p>
            ) : (
              <div className="space-y-4">
                {pending.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={inv.profile?.avatar_url || "/avatar-placeholder.png"}
                          className="h-10 w-10 rounded-full object-cover border border-white/10"
                          alt="avatar"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {getProfileValue(inv.profile, "first_name")}{" "}
                            {getProfileValue(inv.profile, "last_name")}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/40">
                        {getProfileValue(inv.profile, "email")} •{" "}
                        {getProfileValue(inv.profile, "student_id")}
                      </p>
                      <p className="text-xs text-foreground/30 mt-1">
                        Speciality: {getProfileValue(inv.profile, "speciality")} • Department:{" "}
                        {getProfileValue(inv.profile, "department")}
                      </p>
                      <p className="text-xs text-foreground/30">
                        Sent: {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedInvitation(inv)}
                        className="bg-[#639922] text-black"
                      >
                        <Eye className="mr-1 h-3 w-3" /> Verify & Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectInvitation(inv.id, inv.student_id)}
                        disabled={actionLoading === inv.id}
                        className="border-white/20 text-foreground/80"
                      >
                        {actionLoading === inv.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History (unchanged) */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">History</h2>
              <div className="space-y-3">
                {history.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.08] p-3"
                  >
                    <div>
                      <p className="text-foreground text-sm">
                        {getProfileValue(inv.profile, "first_name")}{" "}
                        {getProfileValue(inv.profile, "last_name")}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {getProfileValue(inv.profile, "email")}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        inv.status === "accepted"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }
                    >
                      {inv.status === "accepted" ? "Accepted" : "Rejected"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto‑Comparison Modal */}
      <VerifyMatchModal
        open={!!selectedInvitation}
        onOpenChange={() => setSelectedInvitation(null)}
        invitation={selectedInvitation}
        students={officialStudents} // official records from university_students
        onAccept={() => {
          if (selectedInvitation) {
            acceptInvitation(selectedInvitation.id, selectedInvitation.student_id);
            setSelectedInvitation(null);
          }
        }}
        onReject={() => {
          if (selectedInvitation) {
            rejectInvitation(selectedInvitation.id, selectedInvitation.student_id);
            setSelectedInvitation(null);
          }
        }}
      />
    </div>
  );
}