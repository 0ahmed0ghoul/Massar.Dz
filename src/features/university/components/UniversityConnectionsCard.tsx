// components/university/UniversityConnectionsCard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Invitation, Student } from '../types/university';
import { VerifyMatchModal } from './VerifyMatchModal';


interface Props {
  connectedStudents: Student[];
  pendingRequests: Invitation[];
  onAccept: (invitationId: string, studentId: string) => void;
  onReject: (invitationId: string, studentId: string) => void;
}

export default function UniversityConnectionsCard({ connectedStudents, pendingRequests, onAccept, onReject }: Props) {
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  return (
    <div className="space-y-6">
      {/* Connected Students Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#639922]" />
          <h3 className="font-semibold text-foreground">Connected Students</h3>
          <span className="ml-auto text-sm text-foreground/40">{connectedStudents.length} total</span>
        </div>
        {connectedStudents.length === 0 ? (
          <p className="text-sm text-foreground/40">No connected students yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {connectedStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{student.firstName} {student.lastName}</p>
                  <p className="text-xs text-foreground/40">{student.email} • {student.studentId}</p>
                </div>
                <span className="text-xs text-[#639922] flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#639922]" />
          <h3 className="font-semibold text-foreground">Pending Connection Requests</h3>
          <span className="ml-auto text-sm text-foreground/40">{pendingRequests.length} pending</span>
        </div>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-foreground/40">No pending requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {req.profileData?.firstName} {req.profileData?.lastName}
                    </p>
                    <p className="text-xs text-foreground/40">
                      {req.profileData?.email} • {req.profileData?.speciality}
                    </p>
                    <p className="text-xs text-foreground/30 mt-1">Sent: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedInvitation(req)} className="bg-[#639922] text-foreground">
                      <Eye className="mr-1 h-3 w-3" /> Verify
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(req.id, req.studentId)} className="border-white/20 text-foreground/80">
                      <XCircle className="mr-1 h-3 w-3" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Modal for verification */}
      {selectedInvitation && (
        <VerifyMatchModal
          open={!!selectedInvitation}
          onOpenChange={() => setSelectedInvitation(null)}
          invitation={selectedInvitation}
          students={connectedStudents} // we need the full student list; we could pass from parent or fetch again
          onAccept={() => {
            onAccept(selectedInvitation.id, selectedInvitation.studentId);
            setSelectedInvitation(null);
          }}
          onReject={() => {
            onReject(selectedInvitation.id, selectedInvitation.studentId);
            setSelectedInvitation(null);
          }}
        />
      )}
    </div>
  );
}