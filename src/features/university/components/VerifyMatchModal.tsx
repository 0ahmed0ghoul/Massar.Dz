import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, User, IdCard, MapPin, GraduationCap, BookOpen, Layers } from "lucide-react";

export function VerifyMatchModal({
  open,
  onOpenChange,
  student,
  match,
  onAccept,
  onReject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: any;
  match: any;
  onAccept: () => void;
  onReject: () => void;
}) {
  if (!student) return null;

  const getColor = (ok: boolean) =>
    ok ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";

  const Field = ({
    label,
    value,
    ok,
    icon,
  }: {
    label: string;
    value: any;
    ok: boolean;
    icon: any;
  }) => (
    <div className="flex justify-between border-b border-white/10 py-1 text-sm">
      <div className="flex items-center gap-1 text-white/50">
        {icon}
        {label}
      </div>
      <div className={`px-2 py-0.5 rounded ${getColor(ok)}`}>
        {value || "—"}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#0f1012] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Verify Student</DialogTitle>
          <DialogDescription className="text-white/50">
            Compare official record with registered student data
          </DialogDescription>
        </DialogHeader>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          {/* Student */}
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-[#639922] font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Student Profile
            </h3>

            <Field
              label="Full Name"
              value={`${student.first_name} ${student.last_name}`}
              ok={match?.nameMatch}
              icon={<User className="h-3 w-3" />}
            />

            <Field
              label="Student ID"
              value={student.student_id}
              ok={match?.studentIdMatch}
              icon={<IdCard className="h-3 w-3" />}
            />

            <Field
              label="Speciality"
              value={student.speciality}
              ok={match?.specialityMatch}
              icon={<BookOpen className="h-3 w-3" />}
            />

            <Field
              label="Type"
              value={student.speciality_type}
              ok={match?.specialityTypeMatch}
              icon={<Layers className="h-3 w-3" />}
            />
          </div>

          {/* Official */}
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-[#639922] font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> University Record
            </h3>

            <Field
              label="Full Name"
              value={`${student.first_name} ${student.last_name}`}
              ok={match?.nameMatch}
              icon={<User className="h-3 w-3" />}
            />

            <Field
              label="Student ID"
              value={student.student_id}
              ok={match?.studentIdMatch}
              icon={<IdCard className="h-3 w-3" />}
            />

            <Field
              label="Speciality"
              value={student.speciality}
              ok={match?.specialityMatch}
              icon={<BookOpen className="h-3 w-3" />}
            />

            <Field
              label="Type"
              value={student.speciality_type}
              ok={match?.specialityTypeMatch}
              icon={<Layers className="h-3 w-3" />}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-1" /> Reject
          </Button>

          <Button className="bg-[#639922]" onClick={onAccept}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}