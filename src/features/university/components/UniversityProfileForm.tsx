// components/university/UniversityProfileForm.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Save } from "lucide-react";
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
import {
  ACADEMIC_POSITIONS,
  UNIVERSITY_DEPARTMENTS,
} from "@/constants/university.constants";
import { ALGERIAN_UNIVERSITIES } from "@/constants/algeria.constants";
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
  const [formData, setFormData] = useState({
    university_name: university.university_name || "",
    rector_name: university.rector_name || "",
    department: university.department || "",
    position: university.position || "",
    wilaya: university.wilaya || "",
    email: university.email || "",
    website: university.website || "",
    description: university.company_description || "", // store description in company_description
  });
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);
  const [universityOpen, setUniversityOpen] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUniversity({
      university_name: formData.university_name,
      rector_name: formData.rector_name,
      department: formData.department,
      position: formData.position,
      wilaya: formData.wilaya,
      email: formData.email,
      website: formData.website,
      company_description: formData.description,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Logo section */}
        <div className="flex flex-col items-center gap-3 md:w-1/3">
          <div className="relative">
            {university.avatar_url ? (
              <div className="relative">
                <img
                  src={university.avatar_url}
                  alt="Logo"
                  className="h-24 w-24 rounded-full object-cover border border-white/20"
                />
                <button
                  type="button"
                  onClick={deleteLogo}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-foreground hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border border-white/20">
                <Upload className="h-6 w-6 text-foreground/40" />
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
                className="border-white/20 text-foreground"
              >
                {uploadingLogo ? "Uploading..." : "Upload Logo"}
              </Button>
            </label>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex-1 space-y-4">
          <div>
            <Label className="text-foreground/80">University Name *</Label>

            <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={universityOpen}
                  className="w-full justify-between bg-white/10 border-white/20 text-foreground hover:bg-white/10"
                >
                  {formData.university_name || "Select university..."}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] p-0 bg-background border-white/20">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-foreground/80">Rector / President</Label>
              <Input
                name="rector_name"
                value={formData.rector_name}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-foreground"
              />
            </div>

            <div>
              <Label className="text-foreground/80">Department</Label>

              <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={departmentOpen}
                    className="w-full justify-between bg-white/10 border-white/20 text-foreground hover:bg-white/10"
                  >
                    {formData.department || "Select department..."}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[350px] p-0 bg-background border-white/20">
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
          </div>

          <div>
            <Label className="text-foreground/80">Your Position</Label>

            <Popover open={positionOpen} onOpenChange={setPositionOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={positionOpen}
                  className="w-full justify-between bg-white/10 border-white/20 text-foreground hover:bg-white/10"
                >
                  {formData.position || "Select position..."}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[350px] p-0 bg-background border-white/20">
                <Command>
                  <CommandInput placeholder="Search position..." />

                  <CommandList>
                    <CommandEmpty>No position found.</CommandEmpty>

                    <CommandGroup>
                      {ACADEMIC_POSITIONS.map((position) => (
                        <CommandItem
                          key={position}
                          value={position}
                          onSelect={(currentValue) => {
                            setFormData({
                              ...formData,
                              position: currentValue,
                            });

                            setPositionOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.position === position
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />

                          {position}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-foreground/80">Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-foreground"
              />
            </div>
            <div>
              <Label className="text-foreground/80">Website</Label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-foreground"
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground/80">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="bg-white/10 border-white/20 text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#639922] text-foreground hover:bg-[#4f7a1a]"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
