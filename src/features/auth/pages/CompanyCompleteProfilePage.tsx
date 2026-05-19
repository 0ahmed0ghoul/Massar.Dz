// pages/CompanyCompleteProfilePage.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Building,
  Shield,
  Award,
  ArrowRight,
  Download,
  X,
  Eye,
  Crown,
  Sparkles,
  CreditCard,
  Receipt,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useCompanyCompleteProfile } from "@/features/auth/hooks/useCompanyCompleteProfile";
import { SearchableSelect } from "@/features/auth/components/searchable-select";
import { ALGERIAN_WILAYAS } from "@/constants/algeria.constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyCompleteProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const pending = JSON.parse(localStorage.getItem("pending_profile") || "{}");

  const {
    loading,
    form,
    docs,
    previewUrls,
    receiptFile,
    setReceiptFile,
    uploadingPayment,
    updateForm,
    updateTaxId,
    handleFileChange,
    removeFile,
    handleSubmit: submitProfile,
  } = useCompanyCompleteProfile(user, profile, pending.selectedPlan);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("basic");

  const isFilled = (value: string) => value && value.trim().length > 0;
  const handlePreview = (file: File, title: string) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith("image/") ? "image" : "pdf");
    setPreviewTitle(title);
  };
  useEffect(() => {
    const pending = localStorage.getItem("pending_profile");
  
    if (!pending) return;
  
    try {
      const parsed = JSON.parse(pending);
      setSelectedPlan(parsed.selectedPlan ?? "basic");
    } catch (e) {
      setSelectedPlan("basic");
    }
  }, []);
  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewType(null);
    setPreviewTitle("");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle profile submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProfile(e);
  };

  // Plan details
  const planDetails = {
    basic: {
      name: "Basic Plan",
      price: "2000 DZD",
      priceValue: 29900,
      icon: Building2,
      iconColor: "text-slate-400",
    },
    premium: {
      name: "Premium Plan",
      price: "5000 DZD",
      priceValue: 59900,
      icon: Crown,
      iconColor: "text-[#639922]",
    },
  };

  const currentPlan = planDetails[selectedPlan];
  const CurrentPlanIcon = currentPlan.icon;
console.log(currentPlan);
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

        {/* Selected Plan Banner */}
        <div className={`mb-6 rounded-xl border p-4 ${
          selectedPlan === "premium" 
            ? "border-[#639922]/30 bg-gradient-to-r from-[#639922]/10 to-[#639922]/5" 
            : "border-slate-500/30 bg-gradient-to-r from-slate-500/10 to-slate-500/5"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              selectedPlan === "premium" ? "bg-[#639922]/20" : "bg-slate-500/20"
            }`}>
              <CurrentPlanIcon className={`h-5 w-5 ${
                selectedPlan === "premium" ? "text-[#639922]" : "text-slate-400"
              }`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                selectedPlan === "premium" ? "text-[#639922]" : "text-slate-400"
              }`}>
                {currentPlan.name} Selected
              </p>
              <p className="text-xs text-white/50">
                Complete your profile and upload required documents for verification.
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                selectedPlan === "premium" ? "text-[#639922]" : "text-white/60"
              }`}>
                {currentPlan.price}
              </p>
              <p className="text-[10px] text-white/30">per year</p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
          <form onSubmit={handleFormSubmit}>
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#639922]/10">
                  <Briefcase className="h-6 w-6 text-[#639922]" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">
                    Complete Your Company Profile
                  </CardTitle>
                  <CardDescription className="text-foreground/40">
                    Tell us more about your company and upload verification documents
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-8">
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

              {/* Company Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Building2 className="h-4 w-4 text-[#639922]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                    Company Details
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">
                        Company Name *
                      </Label>
                      {isFilled(form.companyName) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                      <Input
                        value={form.companyName}
                        onChange={(e) => updateForm("companyName", e.target.value)}
                        required
                        className="pl-9 border-white/20 bg-white/10 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80">Industry *</Label>
                      {isFilled(form.industry) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <Input
                      value={form.industry}
                      onChange={(e) => updateForm("industry", e.target.value)}
                      required
                      className="mt-1.5 border-white/20 bg-white/10 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground/80">
                      Company Description
                    </Label>
                    {isFilled(form.companyDescription) ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <Textarea
                    value={form.companyDescription}
                    onChange={(e) => updateForm("companyDescription", e.target.value)}
                    rows={3}
                    className="mt-1.5 border-white/20 bg-white/10 text-foreground"
                    placeholder="Tell us about your company's mission, culture, and values..."
                  />
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
                      <Award className="h-4 w-4 text-[#639922]" /> Company Logo *
                    </Label>
                    {docs.logo ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative">
                      {docs.logo ? (
                        <div className="relative group">
                          <img
                            src={previewUrls.logo}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-full object-cover border-2 border-[#639922]/30"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => docs.logo && handlePreview(docs.logo, "Company Logo")}
                              className="p-1.5 bg-[#639922] rounded-full"
                            >
                              <Eye className="h-4 w-4 text-black" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile("logo")}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-foreground hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
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
                        onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
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
                      <FileText className="h-4 w-4 text-[#639922]" /> Registration Certificate *
                    </Label>
                    {docs.registrationCertificate ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-start gap-4">
                    {docs.registrationCertificate && (
                      <div className="relative group">
                        {previewUrls.certificate && previewUrls.certificate.endsWith(".pdf") ? (
                          <FileText className="h-12 w-12 text-[#639922]" />
                        ) : previewUrls.certificate ? (
                          <img
                            src={previewUrls.certificate}
                            alt="Certificate preview"
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <FileText className="h-12 w-12 text-[#639922]" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => docs.registrationCertificate && handlePreview(docs.registrationCertificate, "Registration Certificate")}
                            className="p-1.5 bg-[#639922] rounded-full"
                          >
                            <Eye className="h-3 w-3 text-black" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("registrationCertificate")}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-foreground hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange("registrationCertificate", e.target.files?.[0] || null)}
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

              {/* ========== PAYMENT RECEIPT UPLOAD SECTION ========== */}
              {/* Only show for PREMIUM plan - Basic plan doesn't require payment receipt */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <CreditCard className="h-4 w-4 text-[#639922]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                      Payment Receipt
                    </h3>
                  </div>

                  {/* Bank Details */}
                  <div className="rounded-xl border border-[#639922]/20 bg-[#639922]/5 p-4">
                    <p className="text-sm font-semibold text-foreground/80 mb-3">Bank Transfer Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/50">Bank:</span>
                        <span className="text-sm font-mono text-foreground/80">Banque d'Algérie</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/50">Account Name:</span>
                        <span className="text-sm font-mono text-foreground/80">Massar Platform</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/50">CCP:</span>
                        <span className="text-sm font-mono text-[#639922] font-bold">123456 78</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/50">Amount:</span>
                        <span className="text-sm font-mono text-[#639922] font-bold">{currentPlan.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/50">Reference:</span>
                        <span className="text-xs font-mono text-foreground/60">{user?.id?.slice(0, 8)}-COMPANY</span>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label className="text-foreground/80">Upload payment receipt (screenshot or photo)</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        asChild
                        className="border-white/20 hover:bg-white/10"
                      >
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" /> Choose file
                        </label>
                      </Button>
                      {receiptFile && (
                        <span className="text-sm text-foreground/60 flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          {receiptFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/40">
                      PDF, PNG, JPG up to 5MB. Please upload a clear image of your bank transfer receipt.
                    </p>
                  </div>
                </div>

              {/* Submit Buttons */}
              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={loading || uploadingPayment}
                  className="w-full bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-foreground hover:from-[#4f7a1a] hover:to-[#3b5e14]"
                >
                  {loading || uploadingPayment ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <><Building2 className="h-4 w-4 mr-2" /> Submit Profile{selectedPlan === "premium" ? " & Payment" : ""}</>
                  )}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-foreground/30">
                  Your information will be reviewed by our team. We'll notify you once approved.
                </p>
              </div>
            </CardContent>
          </form>
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
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.1] pb-3">
              <h3 className="text-lg font-semibold text-white/85">{previewTitle}</h3>
              <button
                onClick={closePreview}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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