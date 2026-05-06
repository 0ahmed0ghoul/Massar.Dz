// components/profile/ProfileForm.tsx (updated)
import { useEffect, useState, useRef } from "react";
import {
  Camera,
  X,
  User,
  Mail,
  GraduationCap,
  BookOpen,
  MapPin,
  Save,
  FileText,
  Upload,
  Trash2,
  CreditCard,
  Hash,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { studentService } from "@/features/student/services/student.service";
import { toast } from "sonner";
import { SearchableSelect } from "@/features/auth/components/searchable-select";
import { Label } from "@/components/ui/label";
import { ProfileFormProps } from "@/types/profile.types";

const parseSkills = (skills: any): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    try {
      return JSON.parse(skills);
    } catch {
      return [];
    }
  }
  return [];
};


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

  // Determine student subtype
  const candidateType = profile?.role === "student" ? profile.candidate_type : null;
  const isStudying = candidateType === "studying";
  const isGraduated = candidateType === "graduated";
  const isSelfTaught = candidateType === "self_taught";

  const [localForm, setLocalForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    // Common for studying & graduated
    degree_level: profile?.degree_level || "",
    university_name: profile?.university_name || "",
    speciality: profile?.speciality || "",
    wilaya: profile?.wilaya || "",
    skills: parseSkills(profile?.skills),
    // Studying only
    academic_year: profile?.academic_year || "",
    speciality_type: profile?.speciality_type || "",
    student_id: profile?.student_id || "",
    // Graduated only
    graduation_year: profile?.graduation_year || "",
  });

  useEffect(() => {
    setLocalForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      degree_level: profile?.degree_level || "",
      university_name: profile?.university_name || "",
      speciality: profile?.speciality || "",
      wilaya: profile?.wilaya || "",
      academic_year: profile?.academic_year || "",
      speciality_type: profile?.speciality_type || "",
      student_id: profile?.student_id || "",
      graduation_year: profile?.graduation_year || "",
      skills: parseSkills(profile?.skills),
    });
  }, [profile]);

  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUnis(true);
      try {
        const list = await studentService.getVerifiedUniversities();
        setUniversities(list);
      } catch (err) {
        console.error("Failed to load universities:", err);
      } finally {
        setLoadingUnis(false);
      }
    };
    fetchUniversities();
  }, []);

  const updateField = (field: string, value: any) => {
    setLocalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const changedFields: any = {};
    for (const key in localForm) {
      const currentValue = localForm[key as keyof typeof localForm];
      const originalValue = profile?.[key];
      if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
        if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
          changedFields[key] = currentValue;
        }
      } else if (currentValue !== originalValue) {
        changedFields[key] = currentValue;
      }
    }
    if (Object.keys(changedFields).length === 0) return;
    const wasComplete = await studentService.isProfileComplete(profile.id);
    await updateProfile(changedFields);

    if (profile?.role === "student") {
      const isNowComplete = await studentService.ensureProfileCompleted(profile.id);
      if (!wasComplete && isNowComplete) {
        toast.success(
          "✅ Profile completed! Massar team will verify your account. If legit, a connection invitation will be sent to your university.",
          { duration: 8000, position: "top-center" }
        );
      }
    }
  };

  // File handlers (unchanged)
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
  const isFilled = (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    return value && String(value).trim().length > 0;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#639922]/10 blur-3xl group-hover:bg-[#639922]/15 transition-all duration-700" />

      <div className="relative z-10 space-y-8 p-6 md:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Save className="h-6 w-6 text-[#639922]" />
          Complete Your Profile
        </h2>

        {/* Upload sections – only show student card for studying */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Avatar (always) */}
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
                  <Camera className="h-8 w-8 text-foreground/40" />
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-foreground shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              {profile?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-foreground shadow-lg transition hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Profile Picture</p>
              <p className="text-xs text-foreground/40">JPG, PNG. Max 2MB</p>
              {uploadingAvatar && <p className="mt-1 text-xs text-[#639922]">Uploading...</p>}
            </div>
          </div>

          {/* CV – for all students (studying, graduated, self‑taught) */}
          {isStudent && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-[#639922]/30">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <FileText className="h-8 w-8 text-foreground/40" />
                </div>
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-foreground shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {profile?.resume_url && (
                  <button
                    type="button"
                    onClick={handleRemoveCV}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-foreground shadow-lg transition hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <input ref={cvInputRef} type="file" accept="application/pdf" onChange={handleCVChange} className="hidden" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">CV / Resume</p>
                <p className="text-xs text-foreground/40">
                  {profile?.resume_url ? (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-[#639922] hover:underline">
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

          {/* Student Card – only for studying students */}
          {isStudent && isStudying && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-[#639922]/30">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <CreditCard className="h-8 w-8 text-foreground/40" />
                </div>
                <button
                  type="button"
                  onClick={() => studentCardInputRef.current?.click()}
                  disabled={uploadingStudentCard}
                  className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-2 text-foreground shadow-lg shadow-[#639922]/30 transition hover:bg-[#4f7a1a] disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {profile?.student_card_url && (
                  <button
                    type="button"
                    onClick={handleRemoveStudentCard}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-foreground shadow-lg transition hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <input ref={studentCardInputRef} type="file" accept="image/*,application/pdf" onChange={handleStudentCardChange} className="hidden" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Student Card</p>
                <p className="text-xs text-foreground/40">
                  {profile?.student_card_url ? (
                    <a href={profile.student_card_url} target="_blank" rel="noopener noreferrer" className="text-[#639922] hover:underline">
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

        {/* Personal Information */}
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
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
              isFilled={isFilled(localForm.first_name)}
            />
            <InputField
              label="Last name"
              icon={<User className="h-4 w-4" />}
              value={localForm.last_name}
              onChange={(value) => updateField("last_name", value)}
              placeholder="Doe"
              isFilled={isFilled(localForm.last_name)}
            />
            <div className="md:col-span-2">
              <InputField
                label="Email address"
                icon={<Mail className="h-4 w-4" />}
                value={localForm.email}
                onChange={(value) => updateField("email", value)}
                placeholder="you@example.com"
                type="email"
                isFilled={isFilled(localForm.email)}
              />
            </div>
          </div>
        </div>

        {/* Academic / Professional Information (conditional) */}
        {isStudent && (
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
              <GraduationCap className="h-5 w-5 text-[#639922]" />
              {isSelfTaught ? "Skills & Portfolio" : "Academic Information"}
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {isStudying && (
                <>
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
                    isFilled={isFilled(localForm.degree_level)}
                  />
                  <SelectField
                    label="Speciality type"
                    icon={<Award className="h-4 w-4" />}
                    value={localForm.speciality_type}
                    onChange={(value) => updateField("speciality_type", value)}
                    options={[
                      { value: "", label: "Select type" },
                      { value: "LMD", label: "LMD (Licence-Master-Doctorat)" },
                      { value: "ING", label: "Ingénieur (Engineer)" },
                      { value: "PRO", label: "Professionnel" },
                    ]}
                    isFilled={isFilled(localForm.speciality_type)}
                  />
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">University</Label>
                      {isFilled(localForm.university_name) ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                    </div>
                    <div className="mt-1.5">
                      <SearchableSelect
                        options={universities.map((u) => u.name)}
                        value={localForm.university_name || ""}
                        onChange={(val) => updateField("university_name", val)}
                        placeholder="Select your university..."
                        emptyMessage={loadingUnis ? "Loading..." : "No verified universities found"}
                      />
                    </div>
                  </div>
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
                    isFilled={isFilled(localForm.academic_year)}
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Speciality / Major"
                      icon={<BookOpen className="h-4 w-4" />}
                      value={localForm.speciality}
                      onChange={(value) => updateField("speciality", value)}
                      placeholder="Computer Science, Business, etc."
                      isFilled={isFilled(localForm.speciality)}
                    />
                  </div>
                  <InputField
                    label="Student ID"
                    icon={<Hash className="h-4 w-4" />}
                    value={localForm.student_id}
                    onChange={(value) => updateField("student_id", value)}
                    placeholder="202301234"
                    isFilled={isFilled(localForm.student_id)}
                  />
                  <InputField
                    label="Wilaya (State)"
                    icon={<MapPin className="h-4 w-4" />}
                    value={localForm.wilaya}
                    onChange={(value) => updateField("wilaya", value)}
                    placeholder="Algiers, Oran, etc."
                    isFilled={isFilled(localForm.wilaya)}
                  />
                </>
              )}

              {isGraduated && (
                <>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">University</Label>
                      {isFilled(localForm.university_name) ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                    </div>
                    <div className="mt-1.5">
                      <SearchableSelect
                        options={universities.map((u) => u.name)}
                        value={localForm.university_name || ""}
                        onChange={(val) => updateField("university_name", val)}
                        placeholder="Select your university..."
                        emptyMessage={loadingUnis ? "Loading..." : "No verified universities found"}
                      />
                    </div>
                  </div>
                  <InputField
                    label="Degree title"
                    icon={<GraduationCap className="h-4 w-4" />}
                    value={localForm.degree_level}
                    onChange={(value) => updateField("degree_level", value)}
                    placeholder="Bachelor's in Computer Science"
                    isFilled={isFilled(localForm.degree_level)}
                  />
                  <InputField
                    label="Speciality / Field"
                    icon={<BookOpen className="h-4 w-4" />}
                    value={localForm.speciality}
                    onChange={(value) => updateField("speciality", value)}
                    placeholder="Artificial Intelligence"
                    isFilled={isFilled(localForm.speciality)}
                  />
                  <InputField
                    label="Graduation Year"
                    icon={<Calendar className="h-4 w-4" />}
                    value={localForm.graduation_year}
                    onChange={(value) => updateField("graduation_year", value)}
                    placeholder="2023"
                    isFilled={isFilled(localForm.graduation_year)}
                  />
                  <InputField
                    label="Wilaya (State)"
                    icon={<MapPin className="h-4 w-4" />}
                    value={localForm.wilaya}
                    onChange={(value) => updateField("wilaya", value)}
                    placeholder="Algiers, Oran, etc."
                    isFilled={isFilled(localForm.wilaya)}
                  />
                </>
              )}

              {isSelfTaught && (
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                    <p className="text-sm text-foreground/70">
                      As a self‑taught learner, your academic background is not required.
                      Focus on showcasing your skills below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group flex items-center gap-2 rounded-lg bg-[#639922] px-8 py-3 font-semibold text-foreground shadow-lg shadow-[#639922]/30 transition-all hover:bg-[#4f7a1a] hover:shadow-xl disabled:opacity-50"
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
const InputField = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  isFilled,
}) => (
  <div>
    <label className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-foreground/50">
      <span>{label}</span>
      {isFilled ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-500" />
      )}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/[0.12] bg-transparent py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/30 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50 transition-all"
      />
    </div>
  </div>
);

const SelectField = ({ label, icon, value, onChange, options, isFilled }) => (
  <div>
    <label className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-foreground/50">
      <span>{label}</span>
      {isFilled ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-500" />
      )}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">{icon}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-white/[0.12] bg-transparent py-3 pl-10 pr-10 text-foreground focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1c1e]">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="h-4 w-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export default ProfileForm;