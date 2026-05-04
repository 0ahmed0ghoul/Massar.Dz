// features/university/pages/InvitationsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, XCircle, Eye, Loader2 } from "lucide-react";
import { useUniversityInvitations } from "../hooks/useUniversityInvitations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function InvitationsPage() {
  const {
    pending,
    history,
    loading,
    actionLoading,
    acceptInvitation,
    rejectInvitation,
  } = useUniversityInvitations();
  const [selectedInvitation, setSelectedInvitation] = useState<any>('');
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }  // Helper to safely display profile fields
  const getProfileValue = (profile: any, field: string) => {
    if (!profile) return "—";
    const value = profile[field];
    return value && value.trim() !== "" ? value : "—";
  };

  return (
    <div className="relative min-h-screen bg-background">
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
              <Mail className="h-5 w-5 text-[#639922]" /> Pending (
              {pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="text-foreground/40 text-sm">
                No pending invitations.
              </p>
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
                          src={
                            inv.profile?.avatar_url || "/avatar-placeholder.png"
                          }
                          className="h-10 w-10 rounded-full object-cover border border-white/10"
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
                        Speciality: {getProfileValue(inv.profile, "speciality")}{" "}
                        • Department:{" "}
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

          {/* History */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                History
              </h2>
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

      {/* Verify & Accept Modal */}
      {selectedInvitation && (
        <Dialog
          open={!!selectedInvitation}
          onOpenChange={() => setSelectedInvitation(null)}
        >
          <DialogContent className="max-w-2xl p-0 overflow-hidden border border-white/10 bg-[#0b0f14] text-white">
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-white/[0.02]">
              <DialogTitle className="text-lg font-semibold">
                Verify Student Identity
              </DialogTitle>
              <DialogDescription className="text-white/40 text-sm">
                Review student documents before approving connection.
              </DialogDescription>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Top Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <img
                  src={
                    selectedInvitation.profile?.avatar_url ||
                    "/avatar-placeholder.png"
                  }
                  className="h-16 w-16 rounded-full object-cover border border-white/20"
                />

                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {getProfileValue(selectedInvitation.profile, "first_name")}{" "}
                    {getProfileValue(selectedInvitation.profile, "last_name")}
                  </p>

                  <p className="text-sm text-white/50">
                    {getProfileValue(selectedInvitation.profile, "email")}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/10">
                      ID:{" "}
                      {getProfileValue(
                        selectedInvitation.profile,
                        "student_id"
                      )}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-[#639922]/20 text-[#b7ff6a]">
                      {getProfileValue(
                        selectedInvitation.profile,
                        "degree_level"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Speciality"
                  value={selectedInvitation.profile?.speciality}
                />
                <Info
                  label="Department"
                  value={selectedInvitation.profile?.department}
                />
                <Info
                  label="Academic Year"
                  value={selectedInvitation.profile?.academic_year}
                />
                <Info
                  label="Wilaya"
                  value={selectedInvitation.profile?.wilaya}
                />
              </div>

              {/* ID Card + Documents */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/70">
                  Student Documents
                </p>

                {/* Student Card */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-white/40 mb-2">Student ID Card</p>
                  {selectedInvitation.profile?.student_card_url ? (
                    (() => {
                      const url = selectedInvitation.profile.student_card_url;
                      const isPdf = url.toLowerCase().endsWith(".pdf");
                      return isPdf ? (
                        <iframe
                          src={url}
                          className="w-full h-64 rounded-lg bg-black"
                          title="Student ID Card"
                        />
                      ) : (
                        <img
                          src={url}
                          className="w-full h-48 object-contain rounded-lg bg-black"
                          alt="Student ID Card"
                        />
                      );
                    })()
                  ) : (
                    <p className="text-xs text-white/30">No ID card uploaded</p>
                  )}
                </div>

                {/* Optional: Resume */}
                {selectedInvitation.profile?.resume_url && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-xs text-white/40 mb-2">Resume</p>

                    <a
                      href={selectedInvitation.profile.resume_url}
                      target="_blank"
                      className="text-[#639922] text-sm underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-5 border-t border-white/10 bg-white/[0.02]">
              <Button
                variant="outline"
                onClick={() => setSelectedInvitation(null)}
                className="border-white/20 text-white"
              >
                Cancel
              </Button>

              <Button
                onClick={async () => {
                  await acceptInvitation(
                    selectedInvitation.id,
                    selectedInvitation.student_id
                  );
                  setSelectedInvitation(null);
                }}
                disabled={actionLoading === selectedInvitation.id}
                className="bg-[#639922] text-black font-medium"
              >
                {actionLoading === selectedInvitation.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Accept & Connect"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
    <p className="text-xs text-white/40">{label}</p>
    <p className="text-sm text-white/80">
      {value && value.trim() !== "" ? value : "—"}
    </p>
  </div>
);
