// features/student/components/profile/ProfileForm.tsx
import { useEffect, useState, useRef } from "react";
import { Camera, X, User, Mail, GraduationCap, Building2, BookOpen, MapPin, Save, FileText, Upload, Trash2 } from "lucide-react";

interface ProfileFormProps {
  profile: any;
  saving: boolean;
  uploadingAvatar?: boolean;
  uploadingCV?: boolean;
  updateProfile: (updates: any) => Promise<void>;
  uploadAvatar?: (file: File) => Promise<string | null>;
  deleteAvatar?: () => Promise<void>;
  uploadCV?: (file: File) => Promise<string | null>;
  deleteCV?: () => Promise<void>;
}

const ProfileForm = ({
  profile,
  saving,
  uploadingAvatar = false,
  uploadingCV = false,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  uploadCV,
  deleteCV,
}: ProfileFormProps) => {
  // ✅ Define refs correctly
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [localForm, setLocalForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    degree_level: profile?.degree_level || "",
    university_name: profile?.university_name || "",
    company_name: profile?.company_name || "",
    specialty: profile?.specialty || "",
    wilaya: profile?.wilaya || "",
  });

  useEffect(() => {
    setLocalForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      degree_level: profile?.degree_level || "",
      university_name: profile?.university_name || "",
      company_name: profile?.company_name || "",
      specialty: profile?.specialty || "",
      wilaya: profile?.wilaya || "",
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

  const isStudent = profile?.role === "student";
  const isEmployer = profile?.role === "employer";
  const isUniversity = profile?.role === "university";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:border-white/[0.15]">
      {/* Glow effect */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <Save className="h-5 w-5 text-[#639922]" />
          Edit Profile
        </h2>

        {/* Avatar Upload Section - redesigned */}
        <div className="flex items-center gap-5 rounded-xl border border-white/[0.08] bg-black/20 p-4">
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover ring-2 ring-[#639922]/30"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#3B6D11]/20">
                <Camera className="h-8 w-8 text-white/40" />
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-1.5 text-white shadow-lg transition hover:bg-[#7ab93e] disabled:opacity-50"
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
              ref={cvInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profile picture</p>
            <p className="text-xs text-white/40">JPG, PNG or GIF. Max 2MB.</p>
            {uploadingAvatar && (
              <p className="mt-1 text-xs text-[#639922]">Uploading...</p>
            )}
          </div>
        </div>
                {/* CV Upload Section (only for students) */}
                {isStudent && (
          <div className="flex items-center gap-5 rounded-xl border border-white/[0.08] bg-black/20 p-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#639922]/20 to-[#3B6D11]/20">
                <FileText className="h-8 w-8 text-white/40" />
              </div>
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={uploadingCV}
                className="absolute bottom-0 right-0 rounded-full bg-[#639922] p-1.5 text-white shadow-lg transition hover:bg-[#7ab93e] disabled:opacity-50"
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
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Curriculum Vitae (CV)</p>
              <p className="text-xs text-white/40">
                {profile?.resume_url ? (
                  <a 
                    href={profile.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#639922] hover:underline"
                  >
                    View uploaded CV
                  </a>
                ) : (
                  "PDF only. Max 5MB."
                )}
              </p>
              {uploadingCV && (
                <p className="mt-1 text-xs text-[#639922]">Uploading...</p>
              )}
            </div>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
          <div className="group relative">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              First name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={localForm.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                placeholder="First name"
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="group relative">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Last name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={localForm.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                placeholder="Last name"
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={localForm.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
              />
            </div>
          </div>

          {/* Student-specific fields */}
          {isStudent && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Degree level
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <select
                    value={localForm.degree_level}
                    onChange={(e) => updateField("degree_level", e.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-8 text-white focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
                  >
                    <option value="">Select degree</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="License">License</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                  University
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    value={localForm.university_name}
                    onChange={(e) => updateField("university_name", e.target.value)}
                    placeholder="University name"
                    className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Specialty / Major
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    value={localForm.specialty}
                    onChange={(e) => updateField("specialty", e.target.value)}
                    placeholder="e.g., Computer Science, Business"
                    className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Employer fields */}
          {isEmployer && (
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                Company name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  value={localForm.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
                />
              </div>
            </div>
          )}

          {/* University fields */}
          {isUniversity && (
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                University name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  value={localForm.university_name}
                  onChange={(e) => updateField("university_name", e.target.value)}
                  placeholder="University name"
                  className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
                />
              </div>
            </div>
          )}

          {/* Wilaya (common) */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Wilaya (State)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={localForm.wilaya}
                onChange={(e) => updateField("wilaya", e.target.value)}
                placeholder="e.g., Algiers, Oran"
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2.5 pl-9 pr-3 text-white placeholder:text-white/20 focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]/50"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group flex items-center gap-2 rounded-lg bg-[#639922] px-6 py-2.5 font-medium text-white transition-all hover:bg-[#7ab93e] hover:shadow-lg disabled:opacity-50"
          >
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;