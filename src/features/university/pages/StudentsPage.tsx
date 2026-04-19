import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Award, Users, CheckCircle2, ShieldCheck, Send } from "lucide-react";
import { useUniversityData } from "../hooks/useUniversityData";
import { GraduationCertificateModal } from "../components/GraduationCertificateModal";

export default function StudentsPage() {
  const { students, addStudents, verifyStudentProfile, claimCertificate, mockSendInvitation } = useUniversityData();
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await addStudents(file);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleClaimCertificate = (studentId: string, fullName: string) => {
    const token = claimCertificate(studentId);
    setGeneratedToken(token);
    setSelectedStudent({ id: studentId, name: fullName });
  };

  return (
    <div className="relative min-h-screen bg-[#0b0c0e]">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Students</h1>
              <p className="text-sm text-white/40 sm:text-base">Manage student records, verify profiles, and issue certificates.</p>
            </div>
            <div>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" />
              <label htmlFor="excel-upload">
                <Button variant="outline" disabled={uploading} className="border-white/[0.15] bg-white/[0.03] text-white hover:bg-white/[0.08]">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Importing..." : "Import XLSX"}
                </Button>
              </label>
            </div>
          </div>

          {/* Student List */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-white">Student List</h2>
                <span className="ml-auto text-sm text-white/40">{students.length} total</span>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-left text-xs font-medium text-white/50">
                      <th className="pb-3 pr-4">Student ID</th>
                      <th className="pb-3 pr-4">Full Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Speciality</th>
                      <th className="pb-3 pr-4">Profile Verified</th>
                      <th className="pb-3 pr-4">Connection</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4 text-sm text-white/60">{student.studentId}</td>
                        <td className="py-3 pr-4 font-medium text-white">{student.firstName} {student.lastName}</td>
                        <td className="py-3 pr-4 text-sm text-white/60">{student.email}</td>
                        <td className="py-3 pr-4 text-sm text-white/60">{student.speciality}</td>
                        <td className="py-3 pr-4">
                          {student.isProfileVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#639922]/10 px-2 py-0.5 text-xs text-[#639922]">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => verifyStudentProfile(student.id)} className="border-white/20 text-xs">
                              <ShieldCheck className="mr-1 h-3 w-3" /> Verify
                            </Button>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs">
                          {student.connectionStatus === 'connected' ? (
                            <span className="text-[#639922]">✓ Connected</span>
                          ) : student.connectionStatus === 'pending' ? (
                            <span className="text-yellow-500">Pending</span>
                          ) : (
                            <span className="text-white/40">Not connected</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {student.isProfileVerified && student.connectionStatus === 'none' && (
                              <Button size="sm" variant="outline" onClick={() => mockSendInvitation(student.id)} className="text-xs border-white/20">
                                <Send className="mr-1 h-3 w-3" /> Mock Invite
                              </Button>
                            )}
                            {student.graduationEligible && student.status !== 'graduated' && (
                              <Button size="sm" onClick={() => handleClaimCertificate(student.id, `${student.firstName} ${student.lastName}`)} className="bg-[#639922] text-white text-xs">
                                <Award className="mr-1 h-3 w-3" /> Claim
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-white/40">No students yet. Import an XLSX file.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile card view */}
              <div className="space-y-3 sm:hidden">
                {students.map((student) => (
                  <div key={student.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-white/40">{student.email}</p>
                        <p className="text-xs text-white/40 mt-1">ID: {student.studentId}</p>
                      </div>
                      {!student.isProfileVerified && (
                        <Button size="sm" variant="outline" onClick={() => verifyStudentProfile(student.id)} className="h-7 text-xs">Verify</Button>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-white/60">Speciality: {student.speciality}</div>
                    <div className="mt-2 flex flex-wrap gap-2 justify-between items-center">
                      <span className={`text-xs ${student.connectionStatus === 'connected' ? 'text-[#639922]' : 'text-white/40'}`}>
                        {student.connectionStatus === 'connected' ? 'Connected' : student.connectionStatus === 'pending' ? 'Pending' : 'Not connected'}
                      </span>
                      <div className="flex gap-2">
                        {student.isProfileVerified && student.connectionStatus === 'none' && (
                          <Button size="sm" variant="outline" onClick={() => mockSendInvitation(student.id)} className="text-xs">Invite</Button>
                        )}
                        {student.graduationEligible && student.status !== 'graduated' && (
                          <Button size="sm" onClick={() => handleClaimCertificate(student.id, `${student.firstName} ${student.lastName}`)} className="bg-[#639922] text-xs">Claim</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedStudent && generatedToken && (
        <GraduationCertificateModal open={!!selectedStudent} onOpenChange={() => { setSelectedStudent(null); setGeneratedToken(null); }} token={generatedToken} studentName={selectedStudent.name} />
      )}
    </div>
  );
}