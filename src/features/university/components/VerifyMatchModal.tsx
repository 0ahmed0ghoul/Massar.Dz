import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, User, IdCard, MapPin, GraduationCap, BookOpen, Layers } from "lucide-react";

const normalize = (str: any) => (str?.toString().trim().toLowerCase() || "");
const isMatch = (val1: any, val2: any) => {
  const norm1 = normalize(val1);
  const norm2 = normalize(val2);
  if (norm1 === "" && norm2 === "") return true;
  return norm1 === norm2;
};

export function VerifyMatchModal({ open, onOpenChange, invitation, students, onAccept, onReject }) {
  if (!invitation) return null;
  const profile = invitation.profile;
  if (!profile) return null;

  // Find matching student in imported data by student_id (only reliable field)
  const importedStudent = students?.find(s => s.student_id === profile.student_id);

  if (!importedStudent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0f1012] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Student Not Found in Imported Data</DialogTitle>
            <DialogDescription className="text-foreground/60">
              No matching student found with student ID <strong>{profile.student_id}</strong>.
              Please check the uploaded XLSX file.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="bg-[#639922]">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Pre‑compute match status using actual field names
  const nameMatch = isMatch(
    `${importedStudent.first_name} ${importedStudent.last_name}`,
    `${profile.first_name} ${profile.last_name}`
  );
  const studentIdMatch = isMatch(importedStudent.student_id, profile.student_id);
  const wilayaMatch = isMatch(importedStudent.wilaya, profile.wilaya);
  const specialityMatch = isMatch(importedStudent.speciality, profile.speciality);
  const specialityTypeMatch = isMatch(importedStudent.speciality_type, profile.speciality_type);
  const academicYearsMatch = isMatch(importedStudent.academic_year, profile.academic_year);
  const degreeLevelMatch = isMatch(importedStudent.degree_level, profile.degree_level);

  const getBgClass = (match: boolean) => match ? "bg-green-500/20" : "bg-red-500/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1012] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle>Verify Student Identity & Data</DialogTitle>
          <DialogDescription className="text-foreground/60">
            Compare the university's imported record (left) with the student's filled profile (right).
            <span className="block mt-1 text-xs">✅ Green = matched &nbsp;|&nbsp; ❌ Red = mismatched</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* LEFT: Imported University Data */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h3 className="font-semibold text-[#639922] mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> University Record (from XLSX)
            </h3>
            <dl className="space-y-3 text-sm">
              <FieldRow label="Full Name" value={`${importedStudent.first_name} ${importedStudent.last_name}`} isMatch={nameMatch} />
              <FieldRow label="Student ID" value={importedStudent.student_id} isMatch={studentIdMatch} />
              <FieldRow label="Wilaya" value={importedStudent.wilaya || "—"} isMatch={wilayaMatch} />
              <FieldRow label="Speciality" value={importedStudent.speciality} isMatch={specialityMatch} />
              <FieldRow label="Speciality Type" value={importedStudent.speciality_type || "—"} isMatch={specialityTypeMatch} />
              <FieldRow label="Academic Year" value={importedStudent.academic_year || "—"} isMatch={academicYearsMatch} />
              <FieldRow label="Degree Level" value={importedStudent.degree_level || "—"} isMatch={degreeLevelMatch} />
            </dl>
          </div>

          {/* RIGHT: Student Filled Profile */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h3 className="font-semibold text-[#639922] mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Student Profile (from registration)
            </h3>
            <dl className="space-y-3 text-sm">
              <FieldRow label="Full Name" value={`${profile.first_name} ${profile.last_name}`} isMatch={nameMatch} />
              <FieldRow label="Student ID" value={profile.student_id || "—"} isMatch={studentIdMatch} />
              <FieldRow label="Wilaya" value={profile.wilaya || "—"} isMatch={wilayaMatch} />
              <FieldRow label="Speciality" value={profile.speciality || "—"} isMatch={specialityMatch} />
              <FieldRow label="Speciality Type" value={profile.speciality_type || "—"} isMatch={specialityTypeMatch} />
              <FieldRow label="Academic Year" value={profile.academic_year || "—"} isMatch={academicYearsMatch} />
              <FieldRow label="Degree Level" value={profile.degree_level || "—"} isMatch={degreeLevelMatch} />
            </dl>
            {profile.student_card_url && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <dt className="text-foreground/50 text-xs mb-1">Student ID Card</dt>
                <img src={profile.student_card_url} alt="Student ID Card" className="max-h-32 rounded border border-white/20" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onReject} className="border-white/20 text-foreground/80 hover:bg-white/10">
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button onClick={onAccept} className="bg-[#639922] text-foreground hover:bg-[#4f7a1a]">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Accept & Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable field row component
function FieldRow({ label, value, isMatch }: { label: string; value: string | number; isMatch: boolean }) {
  // Choose icon based on label
  let icon = null;
  if (label === "Full Name") icon = <User className="h-3 w-3" />;
  else if (label === "Student ID") icon = <IdCard className="h-3 w-3" />;
  else if (label === "Wilaya") icon = <MapPin className="h-3 w-3" />;
  else if (label === "Speciality") icon = <BookOpen className="h-3 w-3" />;
  else if (label === "Speciality Type") icon = <Layers className="h-3 w-3" />;
  else if (label === "Academic Year") icon = <GraduationCap className="h-3 w-3" />;
  else if (label === "Degree Level") icon = <GraduationCap className="h-3 w-3" />;

  return (
    <div className="flex justify-between border-b border-white/10 pb-1">
      <dt className="text-foreground/50 flex items-center gap-1">
        {icon} {label}
      </dt>
      <dd className={`rounded px-2 py-0.5 ${isMatch ? "bg-green-500/20" : "bg-red-500/20"}`}>
        {value}
      </dd>
    </div>
  );
}