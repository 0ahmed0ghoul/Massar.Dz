// components/university/UniversityConnectionsCard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { ConnectedStudent, PendingRequest } from '../services/universityProfile.service';
import { VerifyMatchModal } from './VerifyMatchModal'; // assume it expects old types – we'll adapt

// Map PendingRequest to the shape expected by VerifyMatchModal
const mapToInvitation = (req: PendingRequest) => ({
  id: req.id,
  studentId: req.student_id,
  profileData: {
    firstName: req.first_name,
    lastName: req.last_name,
    email: req.email,
    studentId: req.student_id_number,
    speciality: req.speciality,
    department: req.department,
    degreeLevel: req.degree_level,
    academicYears: req.academic_year,
    wilaya: req.wilaya,
    avatarUrl: req.avatar_url,
    studentCardUrl: req.student_card_url,
    resumeUrl: req.resume_url,
  },
  createdAt: req.created_at,
  status: 'pending',
});

interface Props {
  connectedStudents: ConnectedStudent[];
  pendingRequests: PendingRequest[];
  onAccept: (requestId: string, studentId: string) => void;
  onReject: (requestId: string, studentId: string) => void;
}

export default function UniversityConnectionsCard({ connectedStudents, pendingRequests, onAccept, onReject }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);

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
                  <p className="text-sm font-medium text-foreground">{student.first_name} {student.last_name}</p>
                  <p className="text-xs text-foreground/40">{student.email} • {student.student_id}</p>
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
                      {req.first_name} {req.last_name}
                    </p>
                    <p className="text-xs text-foreground/40">
                      {req.email} • {req.speciality}
                    </p>
                    <p className="text-xs text-foreground/30 mt-1">Sent: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedRequest(req)} className="bg-[#639922] text-foreground">
                      <Eye className="mr-1 h-3 w-3" /> Verify
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(req.id, req.student_id)} className="border-white/20 text-foreground/80">
                      <XCircle className="mr-1 h-3 w-3" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedRequest && (
        <VerifyMatchModal
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
          invitation={mapToInvitation(selectedRequest)}
          students={connectedStudents.map(s => ({
            id: s.id,
            firstName: s.first_name,
            lastName: s.last_name,
            email: s.email,
            studentId: s.student_id,
            speciality: s.speciality,
            department: s.department,
            degreeLevel: s.degree_level,
            academicYears: s.academic_year,
            wilaya: s.wilaya,
            avatarUrl: s.avatar_url,
          }))}
          onAccept={() => {
            onAccept(selectedRequest.id, selectedRequest.student_id);
            setSelectedRequest(null);
          }}
          onReject={() => {
            onReject(selectedRequest.id, selectedRequest.student_id);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}