import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  Building2,
  FileText,
  MapPin,
  Globe,
  GraduationCap,
  CheckCircle,
  XCircle,
  Building,
  Shield,
  Award,
  ArrowRight,
} from "lucide-react";

import { useUniversityCompleteProfile } from "@/features/auth/hooks/useUniversityCompleteProfile";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { SearchableSelect } from "@/features/auth/components/searchable-select";
import {
  ALGERIAN_UNIVERSITIES,
  ALGERIAN_WILAYAS,
} from "@/constants/algeria.constants";
import {
  ACADEMIC_POSITIONS,
  UNIVERSITY_DEPARTMENTS,
} from "@/constants/university.constants";

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

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

export default function UniversityCompleteProfilePage() {
  const { user, profile } = useAuth();
  const {
    loading,
    form,
    docs,
    previewUrls,
    updateForm,
    updateTaxId,
    handleFileChange,
    removeFile,
    handleSubmit,
  } = useUniversityCompleteProfile(user, profile);

  const [universityOpen, setUniversityOpen] = useState(false);

  const isFilled = (value: string) => value && value.trim().length > 0;

  const isRectorate = form.position === "rectorate";
  const isHeadOfDepartment = form.position === "head_of_department";

  return (
    <div className="relative min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Complete University Profile</CardTitle>
            <CardDescription>
              Provide your details and upload required documents.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("logo", e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="logo-upload"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  Upload Logo
                </Button>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  required
                />
              </div>

              {/* Wilaya */}
              <div>
                <Label>Wilaya (State) *</Label>
                <SearchableSelect
                  options={ALGERIAN_WILAYAS}
                  value={form.wilaya || ""}
                  onChange={(v) => updateForm("wilaya", v)}
                  placeholder="Select wilaya"
                />
              </div>

              {/* University Selection */}
              <div>
                <Label>University *</Label>
                <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between bg-white/10 border-white/20 text-foreground hover:bg-white/10"
                    >
                      {form.university_name ? (
                        <span className="truncate">{form.university_name}</span>
                      ) : (
                        "Select university..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0 bg-background border-white/20">
                    <Command>
                      <CommandInput placeholder="Search university..." />
                      <CommandList>
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup>
                          {ALGERIAN_UNIVERSITIES.map((uni) => (
                            <CommandItem
                              key={uni}
                              value={uni}
                              onSelect={(currentValue) => {
                                updateForm("university_name", currentValue);
                                setUniversityOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  form.university_name === uni
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {uni}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Position */}
              <div>
                <Label>Position *</Label>
                <SearchableSelect
                  options={ACADEMIC_POSITIONS.map((p) => p.label)}
                  value={
                    ACADEMIC_POSITIONS.find((p) => p.value === form.position)
                      ?.label || ""
                  }
                  onChange={(label) => {
                    const selected = ACADEMIC_POSITIONS.find(
                      (p) => p.label === label
                    );
                    const value = selected?.value || "";
                    updateForm("position", value);
                    if (value === "rectorate") {
                      updateForm("department", "");
                    }
                  }}
                  placeholder="Select position"
                />
              </div>

              {/* Department (if head of department) */}
              {!isRectorate && (
                <div>
                  <Label>Department *</Label>
                  <SearchableSelect
                    options={UNIVERSITY_DEPARTMENTS}
                    value={form.department || ""}
                    onChange={(v) => updateForm("department", v)}
                    placeholder="Select department"
                  />
                </div>
              )}

              {/* Website */}
              <div>
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) => updateForm("website", e.target.value)}
                />
              </div>

              {/* Proof Documents Section */}
              {(isRectorate || isHeadOfDepartment) && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isRectorate
                      ? "Rectorate Proof Document"
                      : "Head of Department Proof Document"}
                  </h3>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#639922]" />

                        <div>
                          <p className="text-sm font-medium">
                            {isRectorate
                              ? "Official Appointment Decree"
                              : "Department Head Appointment Letter"}
                          </p>

                          <p className="text-xs text-white/40">
                            PDF, JPG, PNG (max 5MB)
                          </p>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) =>
                          handleFileChange(
                            isRectorate ? "rectorateProof" : "headOfDeptProof",
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id="proof-upload"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("proof-upload")?.click()
                        }
                      >
                        Upload
                      </Button>
                    </div>

                    {docs[
                      isRectorate ? "rectorateProof" : "headOfDeptProof"
                    ] && (
                      <div className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />

                        <span className="flex-1 truncate text-sm text-white/70">
                          {
                            docs[
                              isRectorate ? "rectorateProof" : "headOfDeptProof"
                            ]?.name
                          }
                        </span>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            removeFile(
                              isRectorate ? "rectorateProof" : "headOfDeptProof"
                            )
                          }
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit for Approval"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
