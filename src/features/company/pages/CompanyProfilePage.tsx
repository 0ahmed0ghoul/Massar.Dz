// pages/company/CompanyProfilePage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Upload, Building2, MapPin, Globe, Users, Briefcase } from "lucide-react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

export default function CompanyProfilePage() {
  const { company, loading, saving, uploadingLogo, updateProfile, uploadLogo } = useCompanyProfile();
  const [form, setForm] = useState({
    name: '',
    description: '',
    culture: '',
    location: '',
    website: '',
    industry: '',
    size: '',
  });

  // Sync form with fetched company data
  useEffect(() => {
    if (company) {
      setForm({
        name: company.company_name || '',
        description: company.company_description || '',
        culture: company.company_culture || '',
        location: company.wilaya || '',
        website: company.website || '',
        industry: company.industry || '',
        size: company.company_size || '',
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      company_name: form.name,
      company_description: form.description,
      company_culture: form.culture,
      wilaya: form.location,
      website: form.website,
      industry: form.industry,
      company_size: form.size,
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadLogo(file);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects (unchanged) */}
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Company Profile</h1>
            {company?.is_verified && (
              <>
                <BadgeCheck className="h-6 w-6 text-[#639922]" />
                <span className="rounded-full bg-[#639922]/20 px-2.5 py-0.5 text-xs font-medium text-[#639922]">
                  Verified
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-foreground/40">
            Build your brand to attract top talent. A complete profile increases applications by 40%.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
              </div>

              <div className="space-y-5">
                {/* Logo upload */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative">
                    {company?.avatar_url ? (
                      <img
                        src={company.avatar_url}
                        alt="Company logo"
                        className="h-20 w-20 rounded-full border-2 border-white/20 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10">
                        <Building2 className="h-8 w-8 text-foreground/40" />
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
                      disabled={uploadingLogo}
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="cursor-pointer border-white/20 text-foreground hover:bg-white/10"
                        disabled={uploadingLogo}
                      >
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingLogo ? "Uploading..." : "Upload Logo"}
                        </span>
                      </Button>
                    </label>
                    <p className="mt-1 text-xs text-foreground/40">
                      Recommended: Square, min 200x200px
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground/80">Company Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80">Location</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                      placeholder="Algiers, Algeria"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground/80">Industry</Label>
                    <Input
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                      placeholder="Technology, Finance, Healthcare..."
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80">Company Size</Label>
                    <Input
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                      placeholder="50-200 employees"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-foreground/80">Website</Label>
                  <Input
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Culture Card */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Description & Culture</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <Label className="text-foreground/80">Company Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                    placeholder="Tell candidates what your company does, your mission, and what makes you unique..."
                  />
                </div>
                <div>
                  <Label className="text-foreground/80">Culture & Values</Label>
                  <Textarea
                    value={form.culture}
                    onChange={(e) => setForm({ ...form, culture: e.target.value })}
                    rows={4}
                    className="mt-1.5 bg-white/10 border-white/20 text-foreground"
                    placeholder="Describe your work environment, team culture, and core values..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-[#639922]/30">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
              Preview (how candidates see you)
            </h3>
            <div className="flex items-center gap-3">
              {company?.avatar_url ? (
                <img src={company.avatar_url} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Building2 className="h-5 w-5 text-foreground/40" />
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {form.name || "Your Company Name"}
                  {company?.is_verified && (
                    <BadgeCheck className="ml-1 inline h-4 w-4 text-[#639922]" />
                  )}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/40">
                  {form.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {form.location}</span>}
                  {form.industry && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {form.industry}</span>}
                  {form.size && <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {form.size}</span>}
                  {form.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {form.website.replace(/^https?:\/\//, '')}</span>}
                </div>
              </div>
            </div>
            {form.description && (
              <p className="mt-3 text-sm text-foreground/60 line-clamp-2">{form.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#639922] text-foreground transition-all hover:bg-[#4f7a1a]"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}