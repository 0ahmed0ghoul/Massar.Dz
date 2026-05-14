// features/university/pages/InvitationsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, XCircle, Eye, Loader2, CheckCircle2 } from "lucide-react";
import { useUniversityStudentConnection } from "../hooks/useUniversityStudentConnection";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { VerifyMatchModal } from "../../university/components/VerifyMatchModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function InvitationsPage() {
  const { profile } = useAuth();

  const {
    officialStudents,
    registeredStudents,
    matchResults,
    loading,
    acceptStudent,
    rejectStudent,
  } = useUniversityStudentConnection(profile);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [reviewStudent, setReviewStudent] = useState<any>(null);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  console.log("🚀 [InvitationsPage] registeredStudents:", registeredStudents);

  // ✅ Fix: Use optional chaining and ensure array exists
  const pending = registeredStudents.filter(
    (s) => s?.university_connection_status === "pending"
  );

  console.log("✅ Pending count:", pending.length);
  console.log("✅ Pending students:", pending);

  const history = registeredStudents.filter(
    (s) =>
      s?.university_connection_status === "connected" ||
      s?.university_connection_status === "rejected"
  );
  console.log(pending);

  const getValue = (val: any) => {
    if (!val) return "—";
    return val.toString().trim() || "—";
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background */}
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
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Connection Invitations
            </h1>
            <p className="text-sm text-foreground/40">
              Review and manage student connection requests.
            </p>
          </div>

          {/* ───────── PENDING ───────── */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#639922]" />
              Pending ({pending.length})
            </h2>

            {pending.length === 0 ? (
              <p className="text-foreground/40 text-sm">
                No pending invitations.
              </p>
            ) : (
              <div className="space-y-4">
                {pending.map((student) => {
                  const match = matchResults.get(student.id);

                  return (
                    <div
                      key={student.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                    >
                      {/* INFO */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.avatar_url || "/avatar-placeholder.png"
                            }
                            className="h-10 w-10 rounded-full object-cover border border-white/10"
                          />

                          <div>
                            <p className="font-medium text-foreground">
                              {getValue(student.first_name)}{" "}
                              {getValue(student.last_name)}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-foreground/40">
                          {getValue(student.email)} •{" "}
                          {getValue(student.student_id)}
                        </p>

                        <p className="text-xs text-foreground/30 mt-1">
                          Speciality: {getValue(student.speciality)} • Type:{" "}
                          {getValue(student.speciality_type)}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewStudent(student)}
                          className="border-white/15 bg-white/[0.03] hover:bg-white/[0.06]"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Review Card
                        </Button>
                        {/* <Button
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          className="bg-[#639922] text-black"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Verify
                        </Button> */}

                        <Button
                          className="bg-[#639922]"
                          onClick={() => acceptStudent(student)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            rejectStudent(student, "Rejected by university")
                          }
                          className="border-white/20 text-foreground/80"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ───────── HISTORY ───────── */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                History
              </h2>

              <div className="space-y-3">
                {history.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.08] p-3"
                  >
                    <div>
                      <p className="text-sm text-foreground">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {student.email}
                      </p>
                    </div>

                    <Badge
                      className={
                        student.university_connection_status === "connected"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }
                    >
                      {student.university_connection_status === "connected"
                        ? "Connected"
                        : "Rejected"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────── MODAL ───────── */}
      {/* <VerifyMatchModal
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
        student={selectedStudent} // ✅ FIXED
        match={selectedStudent ? matchResults.get(selectedStudent.id) : null} // ✅ FIXED
        onAccept={() => {
          if (selectedStudent) {
            const match = matchResults.get(selectedStudent.id);
            acceptStudent(selectedStudent, match);
            setSelectedStudent(null);
          }
        }}
        onReject={() => {
          if (selectedStudent) {
            rejectStudent(selectedStudent, "Rejected via modal");
            setSelectedStudent(null);
          }
        }} 
        
      /> 
      */}

      <Dialog
        open={!!reviewStudent}
        onOpenChange={() => setReviewStudent(null)}
      >
        <DialogContent className="max-w-3xl border-white/10 bg-[#0f1115] text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Student Card Review
            </DialogTitle>
          </DialogHeader>

          {reviewStudent && (
            <div className="space-y-5">
              {/* STUDENT INFO */}
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <img
                  src={reviewStudent.avatar_url || "/avatar-placeholder.png"}
                  className="h-16 w-16 rounded-xl object-cover border border-white/10"
                />

                <div>
                  <h3 className="text-base font-semibold">
                    {reviewStudent.first_name} {reviewStudent.last_name}
                  </h3>

                  <p className="text-sm text-white/50">{reviewStudent.email}</p>

                  <p className="text-xs text-white/35 mt-1">
                    {reviewStudent.speciality} • {reviewStudent.speciality_type}
                  </p>
                </div>
              </div>

              {/* STUDENT CARD */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-black">
                {reviewStudent.student_card_url ? (
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black">
                    {reviewStudent.student_card_url.endsWith(".pdf") ? (
                      <object
                        data={reviewStudent.student_card_url}
                        type="application/pdf"
                        className="w-full h-[600px]"
                      >
                        <p className="text-white/40 p-4 text-center">
                          PDF cannot be displayed.
                          <a
                            href={reviewStudent.student_card_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#639922] ml-2 underline"
                          >
                            Download PDF
                          </a>
                        </p>
                      </object>
                    ) : (
                      <img
                        src={reviewStudent.student_card_url}
                        alt="Student Card"
                        className="w-full max-h-[600px] object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60 text-white/40">
                    No student card uploaded
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewStudent(null)}
                  className="border-white/10"
                >
                  Close
                </Button>

                <Button
                  onClick={() => {
                    acceptStudent(reviewStudent);
                    setReviewStudent(null);
                  }}
                  className="bg-[#639922] text-black hover:bg-[#7db82d]"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
