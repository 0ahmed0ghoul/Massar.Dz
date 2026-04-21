import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, XCircle, Eye } from "lucide-react";
import { useUniversityData } from "../hooks/useUniversityData";
import { VerifyMatchModal } from "../components/VerifyMatchModal";

export default function InvitationsPage() {
  const { invitations, students, acceptInvitation, rejectInvitation, getPendingInvitations } = useUniversityData();
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);

  const pending = getPendingInvitations();
  const history = invitations.filter(inv => inv.status !== 'pending');

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Connection Invitations</h1>
            <p className="text-sm text-foreground/40">Review, verify, and accept student connection requests.</p>
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
                  <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {inv.profileData?.firstName} {inv.profileData?.lastName}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {inv.profileData?.email || inv.profileData?.studentId} • {inv.profileData?.speciality}
                      </p>
                      <p className="text-xs text-foreground/30 mt-1">Sent: {new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setSelectedInvitation(inv)} className="bg-[#639922] text-foreground">
                        <Eye className="mr-1 h-3 w-3" /> Verify & Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectInvitation(inv.id, inv.studentId)} className="border-white/20 text-foreground/80">
                        <XCircle className="mr-1 h-3 w-3" /> Reject
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
              <h2 className="mb-4 text-lg font-semibold text-foreground">History</h2>
              <div className="space-y-3">
                {history.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/[0.08] p-3">
                    <div>
                      <p className="text-foreground text-sm">
                        {inv.profileData?.firstName} {inv.profileData?.lastName}
                      </p>
                      <p className="text-xs text-foreground/40">{inv.profileData?.email || inv.profileData?.studentId}</p>
                    </div>
                    <span className={`text-xs ${inv.status === 'accepted' ? 'text-[#639922]' : 'text-red-400'}`}>
                      {inv.status === 'accepted' ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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