// components/profile/ProfileForm.tsx
import { useEffect, useState, useRef } from "react";
import {
  Camera, X, User, Mail, GraduationCap, Building2, BookOpen, MapPin, Save,
  FileText, Upload, Trash2, CreditCard, Hash, Calendar, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { studentService } from "@/features/student/services/student.service";

interface ProfileFormProps {
  profile: any;
  saving: boolean;
  uploadingAvatar?: boolean;
  uploadingCV?: boolean;
  uploadingStudentCard?: boolean;
  updateProfile: (updates: any) => Promise<void>;
  uploadAvatar?: (file: File) => Promise<string | null>;
  deleteAvatar?: () => Promise<void>;
  uploadCV?: (file: File) => Promise<string | null>;
  deleteCV?: () => Promise<void>;
  uploadStudentCard?: (file: File) => Promise<string | null>;
  deleteStudentCard?: () => Promise<void>;
}

const ProfileForm = ({
  profile,
  saving,
  uploadingAvatar = false,
  uploadingCV = false,
  uploadingStudentCard = false,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  uploadCV,
  deleteCV,
  uploadStudentCard,
  deleteStudentCard,
}: ProfileFormProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const studentCardInputRef = useRef<HTMLInputElement>(null);

  const [localForm, setLocalForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    degree_level: profile?.degree_level || "",
    university_name: profile?.university_name || "",
    specialty: profile?.specialty || "",
    wilaya: profile?.wilaya || "",
    academic_year: profile?.academic_year || "",
    specialty_type: profile?.specialty_type || "",
    student_id: profile?.student_id || "",
  });

  useEffect(() => {
    setLocalForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      degree_level: profile?.degree_level || "",
      university_name: profile?.university_name || "",
      specialty: profile?.specialty || "",
      wilaya: profile?.wilaya || "",
      academic_year: profile?.academic_year || "",
      specialty_type: profile?.specialty_type || "",
      student_id: profile?.student_id || "",
    });
  }, [profile]);

  const updateField = (field: string, value: string) => {
    setLocalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const changedFields: any = {};
    for (const key in localForm) {
      if (localForm[key as keyof typeof localForm] !== profile?.[key]) {
        changedFields[key] = localForm[key as keyof typeof localForm];
      }
    }
    if (Object.keys(changedFields).length === 0) return;
    await updateProfile(changedFields);

    // Automatically mark profile as completed if all required fields are filled
    if (profile?.role === "student") {
      await studentService.ensureProfileCompleted(profile.id);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadAvatar) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }
    await uploadAvatar(file);
  };

  const handleRemoveAvatar = async () => {
    if (deleteAvatar && confirm("Remove your profile picture?")) {
      await deleteAvatar();
    }
  };

  const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadCV) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    await uploadCV(file);
  };

  const handleRemoveCV = async () => {
    if (deleteCV && confirm("Remove your CV?")) {
      await deleteCV();
    }
  };

  const handleStudentCardChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadStudentCard) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Please upload an image or PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    await uploadStudentCard(file);
  };

  const handleRemoveStudentCard = async () => {
    if (deleteStudentCard && confirm("Remove your student card?")) {
      await deleteStudentCard();
    }
  };

  const isStudent = profile?.role === "student";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
      {/* Green glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#639922]/10 blur-3xl group-hover:bg-[#639922]/15 transition-all duration-700" />

      <div className="relative z-10 space-y-8 p-6 md:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Save className="h-6 w-6 text-[#639922]" />
          Complete Your Profile
        </h2>

        {/* Upload sections */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-[#639922]/30">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-[#639922]/50"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <Camera className="h-8 w-8 text-white/40" />
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-white shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              {profile?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">Profile Picture</p>
              <p className="text-xs text-white/40">JPG, PNG. Max 2MB</p>
              {uploadingAvatar && <p className="mt-1 text-xs text-[#639922]">Uploading...</p>}
            </div>
          </div>

          {/* CV */}
          {isStudent && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-[#639922]/30">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <FileText className="h-8 w-8 text-white/40" />
                </div>
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-white shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {profile?.resume_url && (
                  <button
                    type="button"
                    onClick={handleRemoveCV}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleCVChange}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">CV / Resume</p>
                <p className="text-xs text-white/40">
                  {profile?.resume_url ? (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#639922] hover:underline"
                    >
                      View uploaded
                    </a>
                  ) : (
                    "PDF only. Max 5MB"
                  )}
                </p>
                {uploadingCV && <p className="mt-1 text-xs text-[#639922]">Uploading...</p>}
              </div>
            </div>
          )}

          {/* Student Card */}
          {isStudent && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-[#639922]/30">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <CreditCard className="h-8 w-8 text-white/40" />
                </div>
                <button
                  type="button"
                  onClick={() => studentCardInputRef.current?.click()}
                  disabled={uploadingStudentCard}
                  className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-white shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {profile?.student_card_url && (
                  <button
                    type="button"
                    onClick={handleRemoveStudentCard}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <input
                  ref={studentCardInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleStudentCardChange}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Student Card</p>
                <p className="text-xs text-white/40">
                  {profile?.student_card_url ? (
                    <a
                      href={profile.student_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#639922] hover:underline"
                    >
                      View uploaded
                    </a>
                  ) : (
                    "Image/PDF. Max 5MB"
                  )}
                </p>
                {uploadingStudentCard && <p className="mt-1 text-xs text-[#639922]">Uploading...</p>}
              </div>
            </div>
          )}
        </div>

        {/* Form sections */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <User className="h-5 w-5 text-[#639922]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="First name"
                icon={<User className="h-4 w-4" />}
                value={localForm.first_name}
                onChange={(value) => updateField("first_name", value)}
                placeholder="John"
              />
              <InputField
                label="Last name"
                icon={<User className="h-4 w-4" />}
                value={localForm.last_name}
                onChange={(value) => updateField("last_name", value)}
                placeholder="Doe"
              />
              <div className="md:col-span-2">
                <InputField
                  label="Email address"
                  icon={<Mail className="h-4 w-4" />}
                  value={localForm.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          {isStudent && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <GraduationCap className="h-5 w-5 text-[#639922]" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SelectField
                  label="Degree level"
                  icon={<GraduationCap className="h-4 w-4" />}
                  value={localForm.degree_level}
                  onChange={(value) => updateField("degree_level", value)}
                  options={[
                    { value: "", label: "Select degree" },
                    { value: "bachelor", label: "Bachelor's" },
                    { value: "master", label: "Master's" },
                    { value: "phd", label: "PhD" },
                    { value: "license", label: "License" },
                  ]}
                />
                <SelectField
                  label="Specialty type"
                  icon={<Award className="h-4 w-4" />}
                  value={localForm.specialty_type}
                  onChange={(value) => updateField("specialty_type", value)}
                  options={[
                    { value: "", label: "Select type" },
                    { value: "LMD", label: "LMD (Licence-Master-Doctorat)" },
                    { value: "ING", label: "Ingénieur (Engineer)" },
                    { value: "PRO", label: "Professionnel" },
                  ]}
                />
                <InputField
                  label="University"
                  icon={<Building2 className="h-4 w-4" />}
                  value={localForm.university_name}
                  onChange={(value) => updateField("university_name", value)}
                  placeholder="University of Science"
                />
                <SelectField
                  label="Academic year"
                  icon={<Calendar className="h-4 w-4" />}
                  value={localForm.academic_year}
                  onChange={(value) => updateField("academic_year", value)}
                  options={[
                    { value: "", label: "Select year" },
                    { value: "1", label: "1st Year" },
                    { value: "2", label: "2nd Year" },
                    { value: "3", label: "3rd Year" },
                    { value: "4", label: "4th Year" },
                    { value: "5", label: "5th Year" },
                    { value: "graduate", label: "Graduate" },
                  ]}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Specialty / Major"
                    icon={<BookOpen className="h-4 w-4" />}
                    value={localForm.specialty}
                    onChange={(value) => updateField("specialty", value)}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>
                <InputField
                  label="Student ID"
                  icon={<Hash className="h-4 w-4" />}
                  value={localForm.student_id}
                  onChange={(value) => updateField("student_id", value)}
                  placeholder="202301234"
                />
                <InputField
                  label="Wilaya (State)"
                  icon={<MapPin className="h-4 w-4" />}
                  value={localForm.wilaya}
                  onChange={(value) => updateField("wilaya", value)}
                  placeholder="Algiers, Oran, etc."
                />
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group flex items-center gap-2 rounded-lg bg-[#639922] px-8 py-3 font-semibold text-white shadow-lg shadow-[#639922]/30 transition-all hover:bg-[#4f7a1a] hover:shadow-xl disabled:opacity-50"
          >
            <Save className="h-5 w-5 transition-transform group-hover:scale-110" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper components (unchanged)
const InputField = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/[0.12] bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50 transition-all"
      />
    </div>
  </div>
);

const SelectField = ({ label, icon, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-white/[0.12] bg-transparent py-3 pl-10 pr-10 text-white focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1c1e]">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export default ProfileForm;