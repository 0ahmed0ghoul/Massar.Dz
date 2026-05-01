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
  User,
  GraduationCap,
  CheckCircle,
  XCircle,
  Building,
  Shield,
  Award,
  ArrowRight,
  Users,
  BookOpen,
} from "lucide-react";
import { useUniversityCompleteProfile } from "@/features/auth/hooks/useUniversityCompleteProfile";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { SearchableSelect } from "@/features/auth/components/searchable-select";
import { ALGERIAN_WILAYAS } from "@/features/auth/constants/algeria.constants";
import {
  ACADEMIC_POSITIONS,
  UNIVERSITY_DEPARTMENTS,
} from "@/features/auth/constants/university.constants";

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

  const isFilled = (value: string) => value && value.trim().length > 0;

  return (
    <div className="relative min-h-screen bg-background py-12 px-4 overflow-hidden">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#639922] flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs text-foreground/60 mt-2">Account</span>
            </div>
            <div className="flex-1 h-0.5 bg-[#639922]/30 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#639922] flex items-center justify-center">
                <Building className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs text-foreground/60 mt-2">Profile</span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-foreground/40" />
              </div>
              <span className="text-xs text-foreground/40 mt-2">Verify</span>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#639922]/10">
                <GraduationCap className="h-6 w-6 text-[#639922]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">
                  Complete Your University Profile
                </CardTitle>
                <CardDescription className="text-foreground/40">
                  Tell us more about your institution and upload verification
                  documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <MapPin className="h-4 w-4 text-[#639922]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                    Location
                  </h3>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground/80">
                      Wilaya / City *
                    </Label>
                    {isFilled(form.wilaya) ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <SearchableSelect
                    options={ALGERIAN_WILAYAS}
                    value={form.wilaya || ""}
                    onChange={(value) => updateForm("wilaya", value)}
                    placeholder="Select your wilaya..."
                    emptyMessage="No wilaya found."
                  />
                </div>
              </div>

              {/* University Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <GraduationCap className="h-4 w-4 text-[#639922]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                    University Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">First Name *</Label>
                      {isFilled(form.firstName) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <Input
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      required
                      className="mt-1.5 border-white/20 bg-white/10 text-foreground"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">Last Name *</Label>
                      {isFilled(form.lastName) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <Input
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      required
                      className="mt-1.5 border-white/20 bg-white/10 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">
                        University Name *
                      </Label>
                      {isFilled(form.universityName) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="relative mt-1.5">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                      <Input
                        value={form.universityName}
                        onChange={(e) =>
                          updateForm("universityName", e.target.value)
                        }
                        required
                        className="pl-9 border-white/20 bg-white/10 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">
                        Rector / President *
                      </Label>
                      {isFilled(form.rectorName) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                      <Input
                        value={form.rectorName}
                        onChange={(e) =>
                          updateForm("rectorName", e.target.value)
                        }
                        required
                        className="pl-9 border-white/20 bg-white/10 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">Department *</Label>
                      {isFilled(form.department) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="mt-1.5">
                      <SearchableSelect
                        options={UNIVERSITY_DEPARTMENTS}
                        value={form.department || ""}
                        onChange={(value) => updateForm("department", value)}
                        placeholder="Select your department..."
                        emptyMessage="No department found."
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">
                        Your Position *
                      </Label>
                      {isFilled(form.position) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="mt-1.5">
                      <SearchableSelect
                        options={ACADEMIC_POSITIONS}
                        value={form.position || ""}
                        onChange={(value) => updateForm("position", value)}
                        placeholder="Select your position..."
                        emptyMessage="No position found."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground/80">Website</Label>
                    {isFilled(form.website) ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      value={form.website}
                      onChange={(e) => updateForm("website", e.target.value)}
                      className="pl-9 border-white/20 bg-white/10 text-foreground"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Shield className="h-4 w-4 text-[#639922]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                    Verification Documents
                  </h3>
                </div>

                {/* Logo Upload */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground/80 flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#639922]" /> Institution
                      Logo *
                    </Label>
                    {previewUrls.logo ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative">
                      {previewUrls.logo ? (
                        <div className="relative">
                          <img
                            src={previewUrls.logo}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-full object-cover border-2 border-[#639922]/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile("logo")}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-foreground hover:bg-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
                          <Building2 className="h-8 w-8 text-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange("logo", e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          className="cursor-pointer border-white/20 text-foreground hover:bg-white/10"
                        >
                          <span>
                            <Upload className="mr-2 h-4 w-4" /> Choose Logo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-foreground/40 mt-1">
                        PNG, JPG up to 2MB. Square recommended.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Certificate */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground/80 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#639922]" />{" "}
                      Registration Certificate *
                    </Label>
                    {previewUrls.certificate ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-start gap-4">
                    {previewUrls.certificate && (
                      <div className="relative">
                        <FileText className="h-12 w-12 text-[#639922]" />
                        <button
                          type="button"
                          onClick={() => removeFile("certificate")}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-foreground"
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(
                            "certificate",
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id="cert-upload"
                      />
                      <label htmlFor="cert-upload">
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          className="cursor-pointer border-white/20 text-foreground hover:bg-white/10"
                        >
                          <span>
                            <Upload className="mr-2 h-4 w-4" /> Upload Document
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-foreground/40 mt-1">
                        PDF or image, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground/80">
                      Tax ID / Registration Number
                    </Label>
                    {isFilled(docs.taxId) ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <Input
                    value={docs.taxId}
                    onChange={(e) => updateTaxId(e.target.value)}
                    className="mt-1.5 border-white/20 bg-white/10 text-foreground"
                    placeholder="e.g., 123456789"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-foreground hover:from-[#4f7a1a] hover:to-[#3b5e14]"
                >
                  {loading ? "Submitting..." : "Submit for Verification"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-foreground/30 mt-4">
                  Your information will be reviewed by our team. We'll notify
                  you once approved.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
