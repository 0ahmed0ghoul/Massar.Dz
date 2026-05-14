// pages/university/complete-profile.tsx

import { useState, useEffect } from "react";

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
  CheckCircle,
  ArrowRight,
  Loader2,
  Landmark,
  GraduationCap,
  ShieldCheck,
  X,
  Globe,
  Eye,
  Download,
} from "lucide-react";

import { useUniversityCompleteProfile } from "@/features/auth/hooks/useUniversityCompleteProfile";
import { useAuth } from "@/features/auth/contexts/AuthContext";

import { SearchableSelect } from "@/features/auth/components/searchable-select";

import {
  ALGERIAN_UNIVERSITIES,
  ALGERIAN_WILAYAS,
} from "@/constants/algeria.constants";

import { UNIVERSITY_DEPARTMENTS } from "@/constants/university.constants";

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

export default function UniversityCompleteProfilePage() {
  const { user, profile } = useAuth();

  const {
    loading,
    form,
    docs,
    previewUrls,
    updateForm,
    handleFileChange,
    removeFile,
    handleSubmit,
  } = useUniversityCompleteProfile(user, profile);

  const [universityOpen, setUniversityOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const adminType = profile?.univ_admin_type || form.univ_admin_type;

  const isRectorate = adminType === "rectorate";
  const isHeadOfDepartment = adminType === "head_of_department";

  const inputCls =
    "mt-1.5 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/80 placeholder:text-white/20 focus:border-[#639922]/35 focus:bg-[#639922]/[0.03] focus:ring-2 focus:ring-[#639922]/10 transition-all";

  const labelCls =
    "text-[11px] font-medium uppercase tracking-wider text-white/45";

  // Preview document/logo
  const handlePreview = (file: File, title: string) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith("image/") ? "image" : "pdf");
    setPreviewTitle(title);
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewType(null);
    setPreviewTitle("");
  };

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const proofDocKey = isRectorate ? "rectorateProof" : "headOfDeptProof";
  const proofDoc = docs[proofDocKey as keyof typeof docs];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />

      <div
        className="pointer-events-none fixed -top-48 left-1/2 h-[500px] w-[700px]
                   -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[130px]"
      />

      <div
        className="pointer-events-none fixed bottom-0 right-0 h-72 w-72
                   rounded-full bg-[#639922]/[0.04] blur-[90px]
                   translate-x-1/3 translate-y-1/3"
      />

      <div
        className="pointer-events-none fixed top-0 left-0 right-0 h-px
                   bg-gradient-to-r from-transparent via-[#639922]/35 to-transparent"
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-10">
        <Card className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
          <CardHeader className="border-b border-white/[0.06]">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl
                           border border-[#639922]/20 bg-[#639922]/10"
              >
                {isRectorate ? (
                  <Landmark className="h-6 w-6 text-[#639922]" />
                ) : (
                  <GraduationCap className="h-6 w-6 text-[#639922]" />
                )}
              </div>

              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-white/90">
                  Complete University Profile
                </CardTitle>

                <CardDescription className="mt-2 text-sm text-white/35">
                  Fill in your institution information and upload the required
                  verification documents.
                </CardDescription>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#639922]/20 bg-[#639922]/10 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#639922]" />

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#639922]">
                    {isRectorate
                      ? "Rectorate Account"
                      : "Head of Department"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ===================================================== */}
              {/* PROOF DOCUMENT FIRST */}
              {/* ===================================================== */}

              <div
                className="rounded-2xl border border-[#639922]/15
                           bg-[#639922]/[0.04] p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    <FileText className="h-5 w-5 text-[#639922]" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white/85">
                      {isRectorate
                        ? "Rectorate Verification Document"
                        : "Department Head Verification Document"}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-white/35">
                      {isRectorate
                        ? "Upload an official rectorate appointment or authorization document signed by the rector."
                        : "Upload an official department head appointment document signed by the rector or dean."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,image/jpeg,image/png"
                        onChange={(e) =>
                          handleFileChange(
                            proofDocKey as "rectorateProof" | "headOfDeptProof",
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id="proof-upload"
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          document.getElementById("proof-upload")?.click()
                        }
                        className="rounded-xl border border-[#639922]/30 bg-[#639922]/15 text-[#639922]
                                   hover:bg-[#639922]/25 hover:border-[#639922]/50"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>

                      <span className="text-[11px] text-white/25">
                        PDF, PNG or JPG • Max 5MB
                      </span>
                    </div>

                    {proofDoc && (
                      <div
                        className="mt-5 flex items-center gap-3 rounded-xl
                                   border border-white/[0.08] bg-white/[0.03]
                                   px-4 py-3"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/75">
                            {proofDoc.name}
                          </p>
                          <p className="text-[10px] text-white/30">
                            {(proofDoc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => 
                              handlePreview(
                                proofDoc,
                                isRectorate
                                  ? "Rectorate Verification Document"
                                  : "Department Head Verification Document"
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg
                                       text-[#639922] transition-all hover:bg-[#639922]/10"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFile(proofDocKey as "rectorateProof" | "headOfDeptProof")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg
                                       text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* LOGO/AVATAR - ONLY RECTORATE */}
              {/* ===================================================== */}

              {isRectorate && (
                <div>
                  <Label className={labelCls}>University Logo / Avatar</Label>

                  <div
                    className="mt-2 flex items-center gap-4 rounded-2xl
                               border border-white/[0.08] bg-white/[0.03]
                               p-4"
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={(e) =>
                        handleFileChange(
                          "avatar_url",
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                      id="logo-upload"
                    />

                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl
                                 border border-white/[0.08] bg-white/[0.04] overflow-hidden"
                    >
                      {previewUrls.avatar_url ? (
                        <img
                          src={previewUrls.avatar_url}
                          alt="Logo preview"
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : docs.avatar_url ? (
                        <img
                          src={URL.createObjectURL(docs.avatar_url)}
                          alt="Logo preview"
                          className="h-full w-full rounded-xl object-cover"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-white/30" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white/75">
                        Upload university logo
                      </p>

                      <p className="mt-1 text-[11px] text-white/25">
                        Recommended: PNG with transparent background, 200x200px minimum
                      </p>
                    </div>

                    {docs.avatar_url ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => docs.avatar_url && handlePreview(docs.avatar_url, "University Logo")}
                          className="flex h-9 w-9 items-center justify-center rounded-lg
                                     text-[#639922] transition-all hover:bg-[#639922]/10"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile("avatar_url")}
                          className="flex h-9 w-9 items-center justify-center rounded-lg
                                     text-red-400 transition-all hover:bg-red-500/10"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                        className="border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* PERSONAL INFO */}
              {/* ===================================================== */}

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#639922]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white/85">
                      Personal Information
                    </h3>

                    <p className="text-sm text-white/30">
                      Administrator details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <Label className={labelCls}>First Name *</Label>

                    <Input
                      value={form.firstName}
                      onChange={(e) =>
                        updateForm("firstName", e.target.value)
                      }
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <Label className={labelCls}>Last Name *</Label>

                    <Input
                      value={form.lastName}
                      onChange={(e) =>
                        updateForm("lastName", e.target.value)
                      }
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className={labelCls}>Institutional Email *</Label>

                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateForm("email", e.target.value)
                    }
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* ===================================================== */}
              {/* UNIVERSITY INFO */}
              {/* ===================================================== */}

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    <Building2 className="h-5 w-5 text-[#639922]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white/85">
                      University Information
                    </h3>

                    <p className="text-sm text-white/30">
                      Institution details
                    </p>
                  </div>
                </div>

                {/* Wilaya */}
                <div>
                  <Label className={labelCls}>Wilaya *</Label>

                  <div className="mt-1.5">
                    <SearchableSelect
                      options={ALGERIAN_WILAYAS}
                      value={form.wilaya || ""}
                      onChange={(v) => updateForm("wilaya", v)}
                      placeholder="Select wilaya"
                    />
                  </div>
                </div>

                {/* University */}
                <div>
                  <Label className={labelCls}>University *</Label>

                  <Popover
                    open={universityOpen}
                    onOpenChange={setUniversityOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1.5 h-11 w-full justify-between rounded-xl border-white/[0.08]
                                   bg-white/[0.03] text-white/75 hover:bg-white/[0.05]"
                      >
                        {form.university_name ? (
                          <span className="truncate">
                            {form.university_name}
                          </span>
                        ) : (
                          "Select university..."
                        )}

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[400px] border-white/[0.08] bg-background p-0">
                      <Command>
                        <CommandInput placeholder="Search university..." />

                        <CommandList>
                          <CommandEmpty>
                            No university found.
                          </CommandEmpty>

                          <CommandGroup>
                            {ALGERIAN_UNIVERSITIES.map((uni) => (
                              <CommandItem
                                key={uni}
                                value={uni}
                                onSelect={(currentValue) => {
                                  updateForm(
                                    "university_name",
                                    currentValue
                                  );

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

                {/* Department only for HOD */}
                {isHeadOfDepartment && (
                  <div>
                    <Label className={labelCls}>Department *</Label>

                    <div className="mt-1.5">
                      <SearchableSelect
                        options={UNIVERSITY_DEPARTMENTS}
                        value={form.department || ""}
                        onChange={(v) =>
                          updateForm("department", v)
                        }
                        placeholder="Select department"
                      />
                    </div>
                  </div>
                )}

                {/* Website only for rectorate */}
                {isRectorate && (
                  <div>
                    <Label className={labelCls}>Website</Label>

                    <div className="relative mt-1.5">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                      <Input
                        value={form.website}
                        onChange={(e) =>
                          updateForm("website", e.target.value)
                        }
                        placeholder="https://university.edu.dz"
                        className="h-11 rounded-xl border border-white/[0.08]
                                   bg-white/[0.03] pl-10 text-white/80
                                   placeholder:text-white/20
                                   focus:border-[#639922]/35
                                   focus:ring-2 focus:ring-[#639922]/10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ===================================================== */}
              {/* SUBMIT */}
              {/* ===================================================== */}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-[#639922]/30
                           bg-[#639922]/15 text-[13px] font-semibold text-[#639922]
                           hover:bg-[#639922]/25 hover:border-[#639922]/50
                           hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)]
                           transition-all duration-200 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting for Review...
                  </>
                ) : (
                  <>
                    Submit for Verification
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] text-white/20">
                By submitting, you confirm that all information and documents are accurate and official.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Document/Logo Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-xl border border-white/[0.1] bg-[#0f1115] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.1] pb-3">
              <h3 className="text-lg font-semibold text-white/85">{previewTitle}</h3>
              <button
                onClick={closePreview}
                className="flex h-8 w-8 items-center justify-center rounded-lg
                           text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center">
              {previewType === "image" ? (
                <img
                  src={previewUrl}
                  alt={previewTitle}
                  className="max-h-[70vh] max-w-[80vw] rounded-lg object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  className="h-[70vh] w-[80vw] rounded-lg"
                  title={previewTitle}
                />
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-white/[0.1]">
              <a
                href={previewUrl}
                download
                className="rounded-lg border border-[#639922]/30 bg-[#639922]/15 px-4 py-2 text-[13px] text-[#639922] transition-all hover:bg-[#639922]/25"
              >
                <Download className="mr-2 inline h-4 w-4" />
                Download
              </a>
              <Button
                onClick={closePreview}
                variant="outline"
                className="border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}