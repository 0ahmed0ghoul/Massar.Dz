// pages/CompleteProfilePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, Building2, FileText, MapPin, Globe, User, 
  Briefcase, GraduationCap, CheckCircle, XCircle, 
  Building, Shield, Award, ArrowRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../service/auth.service";

export default function CompleteProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    city: profile?.city || "",
    // Company specific
    companyName: profile?.company_name || "",
    industry: profile?.industry || "",
    companyDescription: "",
    // University specific
    universityName: profile?.university_name || "",
    rectorName: "",
    website: "",
  });

  const [docs, setDocs] = useState({
    logo: null as File | null,
    registrationCertificate: null as File | null,
    taxId: "",
  });

  const [previewUrls, setPreviewUrls] = useState({
    logo: "",
    certificate: "",
  });

  const isCompany = profile?.role === "company_admin";
  const isUniversity = profile?.role === "university_admin";

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (field: "logo" | "certificate", file: File | null) => {
    if (!file) return;
    setDocs({ ...docs, [field]: file });
    const url = URL.createObjectURL(file);
    setPreviewUrls({ ...previewUrls, [field]: url });
  };

  const removeFile = (field: "logo" | "certificate") => {
    setDocs({ ...docs, [field]: null });
    setPreviewUrls({ ...previewUrls, [field]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const additionalData = isCompany
        ? {
            company_name: form.companyName,
            industry: form.industry,
            company_description: form.companyDescription,
          }
        : isUniversity
        ? {
            university_name: form.universityName,
            rector_name: form.rectorName,
            website: form.website,
            city: form.city,
          }
        : {};

      const verificationDocs: any = { tax_id: docs.taxId };
      if (docs.logo) verificationDocs.logo = await fileToBase64(docs.logo);
      if (docs.registrationCertificate)
        verificationDocs.registration_certificate = await fileToBase64(docs.registrationCertificate);

      await authService.markProfileCompleted(user.id, additionalData, verificationDocs);

      toast({
        title: "Profile submitted",
        description: "Your application is now pending admin approval.",
      });
      navigate("/pending-approval");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0c0e] py-12 px-4 overflow-hidden">
      {/* Background grid & glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#639922] flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-white/60 mt-2">Account</span>
            </div>
            <div className="flex-1 h-0.5 bg-[#639922]/30 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#639922] flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-white/60 mt-2">Profile</span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white/40" />
              </div>
              <span className="text-xs text-white/40 mt-2">Verify</span>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-[#639922]/5">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#639922]/10">
                {isCompany ? <Briefcase className="h-6 w-6 text-[#639922]" /> : <GraduationCap className="h-6 w-6 text-[#639922]" />}
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  Complete Your {isCompany ? "Company" : "University"} Profile
                </CardTitle>
                <CardDescription className="text-white/40">
                  Tell us more about your institution and upload verification documents
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
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Location</h3>
                </div>
                <div>
                  <Label className="text-white/80">City / Wilaya *</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                      className="pl-9 border-white/20 bg-white/10 text-white focus:border-[#639922]/50 focus:ring-[#639922]/20 transition-all"
                      placeholder="e.g., Algiers"
                    />
                  </div>
                </div>
              </div>

              {/* Role-specific sections */}
              {isCompany && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <Briefcase className="h-4 w-4 text-[#639922]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Company Details</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-white/80">Company Name *</Label>
                      <div className="relative mt-1.5">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          value={form.companyName}
                          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                          required
                          className="pl-9 border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/80">Industry *</Label>
                      <Input
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        required
                        className="border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/80">Company Description</Label>
                    <Textarea
                      value={form.companyDescription}
                      onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
                      rows={3}
                      className="mt-1.5 border-white/20 bg-white/10 text-white focus:border-[#639922]/50 resize-none"
                      placeholder="Tell us about your company's mission, culture, and values..."
                    />
                  </div>
                </div>
              )}

              {isUniversity && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <GraduationCap className="h-4 w-4 text-[#639922]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">University Details</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-white/80">University Name *</Label>
                      <div className="relative mt-1.5">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          value={form.universityName}
                          onChange={(e) => setForm({ ...form, universityName: e.target.value })}
                          required
                          className="pl-9 border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/80">Rector / President Name *</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          value={form.rectorName}
                          onChange={(e) => setForm({ ...form, rectorName: e.target.value })}
                          required
                          className="pl-9 border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/80">Website</Label>
                    <div className="relative mt-1.5">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="pl-9 border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Shield className="h-4 w-4 text-[#639922]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Verification Documents</h3>
                </div>

                {/* Logo Upload */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <Label className="text-white/80 flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#639922]" /> Institution Logo *
                  </Label>
                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative group">
                      {previewUrls.logo ? (
                        <div className="relative">
                          <img src={previewUrls.logo} alt="Logo preview" className="h-20 w-20 rounded-full object-cover border-2 border-[#639922]/30" />
                          <button
                            type="button"
                            onClick={() => removeFile("logo")}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-[#639922]/50 transition">
                          <Building2 className="h-8 w-8 text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button type="button" variant="outline" asChild className="cursor-pointer border-white/20 text-white hover:bg-white/10">
                          <span>
                            <Upload className="mr-2 h-4 w-4" /> Choose Logo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-white/40 mt-1">PNG, JPG up to 2MB. Square recommended.</p>
                    </div>
                  </div>
                </div>

                {/* Registration Certificate */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <Label className="text-white/80 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#639922]" /> Registration Certificate / Legal Document *
                  </Label>
                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {previewUrls.certificate && (
                      <div className="relative">
                        <FileText className="h-12 w-12 text-[#639922]" />
                        <button
                          type="button"
                          onClick={() => removeFile("certificate")}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition"
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange("certificate", e.target.files?.[0] || null)}
                        className="hidden"
                        id="cert-upload"
                      />
                      <label htmlFor="cert-upload">
                        <Button type="button" variant="outline" asChild className="cursor-pointer border-white/20 text-white hover:bg-white/10">
                          <span>
                            <Upload className="mr-2 h-4 w-4" /> Upload Document
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-white/40 mt-1">PDF or image, max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <Label className="text-white/80">Tax ID / Registration Number (optional)</Label>
                  <Input
                    value={docs.taxId}
                    onChange={(e) => setDocs({ ...docs, taxId: e.target.value })}
                    className="mt-1.5 border-white/20 bg-white/10 text-white focus:border-[#639922]/50"
                    placeholder="e.g., 123456789"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-white hover:from-[#4f7a1a] hover:to-[#3b5e14] transition-all duration-300 group"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit for Verification
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-white/30 mt-4">
                  Your information will be reviewed by our team. We'll notify you once approved.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}