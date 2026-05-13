// components/university/UniversityProfileForm.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, X, Save, Landmark, GraduationCap, Building2, 
  Globe, Mail, MapPin, User, FileText 
} from "lucide-react";
import { UniversityProfile } from "../services/universityProfile.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { ACADEMIC_POSITIONS, UNIVERSITY_DEPARTMENTS } from "@/constants/university.constants";
import { ALGERIAN_UNIVERSITIES } from "@/constants/algeria.constants";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/contexts/AuthContext";

interface Props {
  university: UniversityProfile;
  saving: boolean;
  uploadingLogo: boolean;
  updateUniversity: (updates: Partial<UniversityProfile>) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  deleteLogo: () => void;
}

export default function UniversityProfileForm({
  university,
  saving,
  uploadingLogo,
  updateUniversity,
  uploadLogo,
  deleteLogo,
}: Props) {
  const { profile } = useAuth();
  const adminType = profile?.univ_admin_type; // 'head_of_department' or 'rectorate'
  const isRectorate = adminType === 'rectorate';
  const isDepartmentHead = adminType === 'head_of_department';

  const [formData, setFormData] = useState({
    university_name: university.university_name || "",
    first_name: university.first_name || "",
    last_name: university.last_name || "",
    department: university.department || "",
    position: university.position || "",
    wilaya: university.wilaya || "",
    email: university.email || "",
    website: university.website || "",
    description: university.company_description || "",
  });

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);
  const [universityOpen, setUniversityOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUniversity({
      university_name: formData.university_name,
      first_name: formData.first_name,
      last_name: formData.last_name,
      department: isDepartmentHead ? formData.department : undefined,
      position: formData.position,
      wilaya: formData.wilaya,
      email: formData.email,
      website: isRectorate ? formData.website : undefined,
      company_description: formData.description,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Badge */}
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-[#639922]/20 bg-[#639922]/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
          {isRectorate ? (
            <Landmark className="h-5 w-5 text-[#639922]" />
          ) : (
            <GraduationCap className="h-5 w-5 text-[#639922]" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {isRectorate ? 'Rectorate Profile' : 'Department Head Profile'}
          </h3>
          <p className="text-sm text-foreground/40">
            {isRectorate 
              ? 'Managing university-wide information' 
              : `Managing ${formData.department || 'department'} information`
            }
          </p>
        </div>
        <Badge variant="outline" className="ml-auto border-[#639922]/30 text-[#639922]">
          {isRectorate ? 'Rectorate' : 'Head of Department'}
        </Badge>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Logo section - Only for Rectorate */}
        {isRectorate && (
          <div className="flex flex-col items-center gap-3 md:w-1/3">
            <Label className="text-sm font-medium text-foreground/60">University Logo</Label>
            <div className="relative">
              {university.avatar_url ? (
                <div className="relative">
                  <img
                    src={university.avatar_url}
                    alt="University Logo"
                    className="h-24 w-24 rounded-full object-cover border-2 border-[#639922]/30"
                  />
                  <button
                    type="button"
                    onClick={deleteLogo}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.03] border-2 border-dashed border-white/10">
                  <Building2 className="h-8 w-8 text-foreground/20" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingLogo}
                  size="sm"
                  className="border-white/10 bg-white/[0.03] text-foreground/70 hover:bg-white/[0.06]"
                >
                  <Upload className="mr-2 h-3 w-3" />
                  {uploadingLogo ? "Uploading..." : "Upload Logo"}
                </Button>
              </label>
            </div>
          </div>
        )}

        {/* Form fields */}
        <div className={`flex-1 space-y-4 ${isRectorate ? '' : 'w-full'}`}>
          {/* University Name - Both roles need this */}
          <div>
            <Label className="text-foreground/80 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#639922]" />
              University Name *
            </Label>
            <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={universityOpen}
                  className="mt-1.5 w-full justify-between bg-white/[0.03] border-white/10 text-foreground hover:bg-white/[0.06] h-11 rounded-xl"
                >
                  {formData.university_name || "Select university..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 bg-background border-white/10">
                <Command>
                  <CommandInput placeholder="Search university..." />
                  <CommandList>
                    <CommandEmpty>No university found.</CommandEmpty>
                    <CommandGroup>
                      {ALGERIAN_UNIVERSITIES.map((university) => (
                        <CommandItem
                          key={university}
                          value={university}
                          onSelect={(currentValue) => {
                            setFormData({
                              ...formData,
                              university_name: currentValue,
                            });
                            setUniversityOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.university_name === university
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {university}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Rector Name - Only for Rectorate */}
          {isRectorate && (
            <div>
              <Label className="text-foreground/80 flex items-center gap-2">
                <User className="h-4 w-4 text-[#639922]" />
                Rector / President
              </Label>
              <Input
                name="first_name"
                value={formData.first_name+ " " + formData.last_name}
                onChange={handleChange}
                placeholder="Full name of the rector"
                className="mt-1.5 h-11 rounded-xl bg-white/[0.03] border-white/10 text-foreground placeholder:text-foreground/20"
              />
            </div>
          )}

          {/* Department - Only for Department Head */}
          {isDepartmentHead && (
            <div>
              <Label className="text-foreground/80 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#639922]" />
                Department *
              </Label>
              <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={departmentOpen}
                    className="mt-1.5 w-full justify-between bg-white/[0.03] border-white/10 text-foreground hover:bg-white/[0.06] h-11 rounded-xl"
                  >
                    {formData.department || "Select department..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 bg-background border-white/10">
                  <Command>
                    <CommandInput placeholder="Search department..." />
                    <CommandList>
                      <CommandEmpty>No department found.</CommandEmpty>
                      <CommandGroup>
                        {UNIVERSITY_DEPARTMENTS.map((department) => (
                          <CommandItem
                            key={department}
                            value={department}
                            onSelect={(currentValue) => {
                              setFormData({
                                ...formData,
                                department: currentValue,
                              });
                              setDepartmentOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.department === department
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {department}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Contact Info - Both roles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-foreground/80 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#639922]" />
                Email
              </Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@university.dz"
                className="mt-1.5 h-11 rounded-xl bg-white/[0.03] border-white/10 text-foreground placeholder:text-foreground/20"
              />
            </div>

            {/* Website - Only for Rectorate */}
            {isRectorate && (
              <div>
                <Label className="text-foreground/80 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#639922]" />
                  Website
                </Label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://university.edu.dz"
                  className="mt-1.5 h-11 rounded-xl bg-white/[0.03] border-white/10 text-foreground placeholder:text-foreground/20"
                />
              </div>
            )}

            {/* Wilaya - Department Head gets full width if no website */}
            <div className={isDepartmentHead ? "sm:col-span-2" : ""}>
              <Label className="text-foreground/80 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#639922]" />
                Wilaya
              </Label>
              <Input
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                placeholder="Wilaya location"
                className="mt-1.5 h-11 rounded-xl bg-white/[0.03] border-white/10 text-foreground placeholder:text-foreground/20"
              />
            </div>
          </div>

          {/* Description - Both roles */}
          <div>
            <Label className="text-foreground/80 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#639922]" />
              {isRectorate ? 'University Description' : 'Department Description'}
            </Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder={isRectorate 
                ? "Describe your university..." 
                : "Describe your department..."
              }
              className="mt-1.5 rounded-xl bg-white/[0.03] border-white/10 text-foreground placeholder:text-foreground/20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-[#639922] text-black hover:bg-[#4f7a1a] transition-all shadow-lg shadow-[#639922]/20"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}