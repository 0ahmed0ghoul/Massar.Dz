import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, User, IdCard, MapPin, GraduationCap, BookOpen, Layers } from "lucide-react";
import idcard from "@/assets/studentidcard.jpg";
// Helper: normalize strings for comparison
const normalize = (str: any) => (str?.toString().trim().toLowerCase() || "");

const isMatch = (val1: any, val2: any) => {
  const norm1 = normalize(val1);
  const norm2 = normalize(val2);
  // Both empty → treat as match
  if (norm1 === "" && norm2 === "") return true;
  return norm1 === norm2;
};

export function VerifyMatchModal({ open, onOpenChange, invitation, students, onAccept, onReject }) {
  // Find matching student in imported data by email or studentId
  const importedStudent = students.find(s => 
    s.email === invitation.profileData.email || s.studentId === invitation.profileData.studentId
  );

  if (!importedStudent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0f1012] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Student Not Found in Imported Data</DialogTitle>
            <DialogDescription className="text-white/60">
              No matching student found with email {invitation.profileData.email} or student ID {invitation.profileData.studentId}.
              Please check the imported student list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="bg-[#639922]">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const profile = invitation.profileData;

  // Pre‑compute match status for each field
  const nameMatch = isMatch(
    `${importedStudent.firstName} ${importedStudent.lastName}`,
    `${profile.firstName} ${profile.lastName}`
  );
  const studentIdMatch = isMatch(importedStudent.studentId, profile.studentId);
  const emailMatch = isMatch(importedStudent.email, profile.email);
  const wilayaMatch = isMatch(importedStudent.wilaya, profile.wilaya);
  const specialityMatch = isMatch(importedStudent.speciality, profile.speciality);
  const specialtyTypeMatch = isMatch(importedStudent.specialtyType, profile.specialtyType);
  const academicYearsMatch = isMatch(importedStudent.academicYears, profile.academicYears);
  const degreeLevelMatch = isMatch(importedStudent.degreeLevel, profile.degreeLevel);

  // Helper to get background class
  const getBgClass = (match: boolean) => match ? "bg-green-500/20" : "bg-red-500/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1012] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Verify Student Identity & Data</DialogTitle>
          <DialogDescription className="text-white/60">
            Compare the university's imported record (left) with the student's filled profile (right).
            <span className="block mt-1 text-xs">
              ✅ Green = matched &nbsp;|&nbsp; ❌ Red = mismatched
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* LEFT: Imported University Data */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h3 className="font-semibold text-[#639922] mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> University Record (XLSX)
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50 flex items-center gap-1"><User className="h-3 w-3" /> Full Name</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(nameMatch)}`}>
                  {importedStudent.firstName} {importedStudent.lastName}
                </dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50 flex items-center gap-1"><IdCard className="h-3 w-3" /> Student ID</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(studentIdMatch)}`}>{importedStudent.studentId}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Email</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(emailMatch)}`}>{importedStudent.email}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50 flex items-center gap-1"><MapPin className="h-3 w-3" /> Wilaya</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(wilayaMatch)}`}>{importedStudent.wilaya || '—'}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50 flex items-center gap-1"><BookOpen className="h-3 w-3" /> Speciality</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(specialityMatch)}`}>{importedStudent.speciality}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Specialty Type</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(specialtyTypeMatch)}`}>{importedStudent.specialtyType || '—'}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Academic Years</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(academicYearsMatch)}`}>{importedStudent.academicYears || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Degree Level</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(degreeLevelMatch)}`}>{importedStudent.degreeLevel || '—'}</dd>
              </div>
            </dl>
          </div>

          {/* RIGHT: Student Filled Profile */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h3 className="font-semibold text-[#639922] mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Student Profile (from account)
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Full Name</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(nameMatch)}`}>
                  {profile.firstName} {profile.lastName}
                </dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Student ID</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(studentIdMatch)}`}>{profile.studentId}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Email</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(emailMatch)}`}>{profile.email || '—'}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Wilaya</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(wilayaMatch)}`}>{profile.wilaya}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Speciality</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(specialityMatch)}`}>{profile.speciality}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Specialty Type</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(specialtyTypeMatch)}`}>{profile.specialtyType}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <dt className="text-white/50">Academic Years</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(academicYearsMatch)}`}>{profile.academicYears}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Degree Level</dt>
                <dd className={`rounded px-2 py-0.5 ${getBgClass(degreeLevelMatch)}`}>{profile.degreeLevel}</dd>
              </div>
            </dl>
            {profile.studentIdCardImage && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <dt className="text-white/50 text-xs mb-1">ID Card Image</dt>
                <img src={idcard} alt="Student ID Card" className="max-h-32 rounded border border-white/20" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onReject} className="border-white/20 text-white/80 hover:bg-white/10">
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button onClick={onAccept} className="bg-[#639922] text-white hover:bg-[#4f7a1a]">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Accept & Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}