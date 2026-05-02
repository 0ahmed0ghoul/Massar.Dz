// components/AddCertificateModal.tsx (updated)
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, AlertCircle, CheckCircle2, Loader2, Wifi, WifiOff, Sparkles, FileText } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

type CertificateType = "stars" | "major" | "hackathon" | "english" | "self_taught";

interface AddCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (request: {
    type: CertificateType;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    files?: Record<string, File>;
    achievements?: string[];
  }) => void;
}

const CERTIFICATE_TYPES: { value: CertificateType; label: string; icon: string }[] = [
  { value: "stars", label: "Stars Certificate", icon: "⭐" },
  { value: "major", label: "Major Certificate", icon: "🎓" },
  { value: "hackathon", label: "Hackathon / Competition", icon: "🏆" },
  { value: "english", label: "English Certificate", icon: "🌐" },
  { value: "self_taught", label: "Self‑Taught / Online Course", icon: "📚" },
];

const STAR_ACHIEVEMENTS = [
  { id: "club", label: "Club participation/leadership", description: "Active role in a university club" },
  { id: "language", label: "Foreign language certificate", description: "e.g., TOEFL, IELTS, DELF" },
  { id: "internship", label: "Completed internship", description: "Proof of internship completion" },
  { id: "promotionDelegate", label: "Promotion delegate", description: "Class representative or delegate" },
  { id: "volunteering", label: "Volunteering", description: "Community service or volunteer work" },
  { id: "research", label: "Research / publication", description: "Research paper or academic publication" },
];

export function AddCertificateModal({ open, onOpenChange, onAdd }: AddCertificateModalProps) {
  const { user, profile } = useAuth();
  const [type, setType] = useState<CertificateType>("stars");
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [credentialId, setCredentialId] = useState("");

  // University certificate states
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);
  const [achievementFiles, setAchievementFiles] = useState<Record<string, File>>({});

  // Non‑university certificate file
  const [genericFile, setGenericFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);

  // Check university connection when modal opens and type is university‑related
  useEffect(() => {
    if (!open) return;
    if (type === "stars" || type === "major") {
      const checkConnection = async () => {
        setCheckingConnection(true);
        try {
          if (profile?.university_connection_status !== undefined) {
            setConnectionStatus(profile.university_connection_status);
          } else {
            const { data, error } = await supabase
              .from("profiles")
              .select("university_connection_status")
              .eq("id", user?.id)
              .single();
            if (!error && data) setConnectionStatus(data.university_connection_status);
            else setConnectionStatus(false);
          }
        } catch {
          setConnectionStatus(false);
        } finally {
          setCheckingConnection(false);
        }
      };
      checkConnection();
    } else {
      setConnectionStatus(null);
      setCheckingConnection(false);
    }
  }, [open, type, user, profile]);

  const reset = () => {
    setType("stars");
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setExpiryDate("");
    setCredentialId("");
    setStudentCardFile(null);
    setSelectedAchievements([]);
    setAchievementFiles({});
    setGenericFile(null);
    setConnectionStatus(null);
    setCheckingConnection(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !issueDate) return;

    if ((type === "stars" || type === "major") && !connectionStatus) {
      alert("You need to be connected to your university to request this certificate.");
      return;
    }

    setIsLoading(true);
    const files: Record<string, File> = {};
    if (type === "major" && studentCardFile) files["studentCard"] = studentCardFile;
    if (type === "stars") {
      Object.entries(achievementFiles).forEach(([id, file]) => { files[id] = file; });
    }
    if (!(type === "stars" || type === "major") && genericFile) files["certificate"] = genericFile;

    onAdd({
      type,
      title,
      issuer,
      issueDate,
      expiryDate: expiryDate || undefined,
      credentialId: credentialId || undefined,
      files: Object.keys(files).length ? files : undefined,
      achievements: type === "stars" ? selectedAchievements : undefined,
    });
    reset();
    onOpenChange(false);
    setIsLoading(false);
  };

  const isUniversityCertificate = type === "stars" || type === "major";
  const hasConnection = connectionStatus === true;
  const canProceed = title && issuer && issueDate &&
    (!isUniversityCertificate || hasConnection) &&
    (type !== "major" || studentCardFile) &&
    (type !== "stars" || selectedAchievements.length > 0 || Object.keys(achievementFiles).length > 0);

  const toggleAchievement = (id: string) => {
    setSelectedAchievements(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    if (selectedAchievements.includes(id) && achievementFiles[id]) {
      const newFiles = { ...achievementFiles };
      delete newFiles[id];
      setAchievementFiles(newFiles);
    }
  };

  // Helper to render the form content based on connection and type
  const renderFormContent = () => {
    // For non‑university certificates, always show the full form
    if (!isUniversityCertificate) {
      return (
        <>
          {/* Basic information */}
          <div className="space-y-4">
            <div>
              <Label>Certificate title *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Bachelor's in Computer Science" className="bg-white/[0.02] border-white/10 focus:border-[#639922]/50" />
            </div>
            <div>
              <Label>Issuing organization *</Label>
              <Input value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="e.g., University of Algiers" className="bg-white/[0.02] border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Issue date *</Label>
                <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="bg-white/[0.02] border-white/10" />
              </div>
              <div>
                <Label>Expiry date (optional)</Label>
                <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="bg-white/[0.02] border-white/10" />
              </div>
            </div>
            <div>
              <Label>Credential ID (optional)</Label>
              <Input value={credentialId} onChange={e => setCredentialId(e.target.value)} placeholder="e.g., STARS-2024-001" className="bg-white/[0.02] border-white/10" />
            </div>
          </div>

          {/* Simple file upload */}
          <div className="rounded-xl border border-white/10 p-4 space-y-2">
            <Label className="text-sm font-medium">Attach certificate file (optional)</Label>
            <div className="flex items-center gap-3">
              <input type="file" accept=".pdf,image/*" onChange={e => setGenericFile(e.target.files?.[0] || null)} className="hidden" id="generic-file" />
              <Button type="button" variant="outline" asChild className="border-white/20 hover:bg-white/10">
                <label htmlFor="generic-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" /> Choose file
                </label>
              </Button>
              {genericFile && (
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                  <span className="truncate max-w-[200px]">{genericFile.name}</span>
                  <button type="button" onClick={() => setGenericFile(null)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-foreground/30">PDF, JPG, PNG (max 5MB)</p>
          </div>
        </>
      );
    }

    // University certificates: show only if connected, otherwise show a message
    if (checkingConnection) {
      return (
        <div className="flex items-center justify-center gap-2 text-amber-400 text-sm p-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking university connection...
        </div>
      );
    }

    if (!hasConnection) {
      return (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <WifiOff className="mx-auto h-8 w-8 text-red-400 mb-2" />
          <p className="text-sm font-medium text-red-300">Not connected to your university</p>
          <p className="text-xs text-foreground/50 mt-1">
            You must be connected to your university to request a {type === "stars" ? "Stars" : "Major"} Certificate.
          </p>
        </div>
      );
    }

    // Connected – show the full form
    return (
      <>
        {/* Success message */}
        <div className="rounded-xl bg-[#639922]/10 border border-[#639922]/30 p-3 text-center">
          <p className="text-sm font-medium text-[#a8d85a]">
            ✅ Connected to your university – you can request this certificate.
          </p>
        </div>

        {/* Basic information */}
        <div className="space-y-4">
          <div>
            <Label>Certificate title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Bachelor's in Computer Science" className="bg-white/[0.02] border-white/10 focus:border-[#639922]/50" />
          </div>
          <div>
            <Label>Issuing organization *</Label>
            <Input value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="e.g., University of Algiers" className="bg-white/[0.02] border-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Issue date *</Label>
              <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="bg-white/[0.02] border-white/10" />
            </div>
            <div>
              <Label>Expiry date (optional)</Label>
              <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="bg-white/[0.02] border-white/10" />
            </div>
          </div>
          <div>
            <Label>Credential ID (optional)</Label>
            <Input value={credentialId} onChange={e => setCredentialId(e.target.value)} placeholder="e.g., STARS-2024-001" className="bg-white/[0.02] border-white/10" />
          </div>
        </div>

        {/* Specific fields for major or stars */}
        {type === "major" && (
          <div className="rounded-xl border border-[#639922]/30 bg-[#639922]/5 p-4 space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-[#639922]" />
              Student card * (required)
            </Label>
            <div className="flex items-center gap-3">
              <input type="file" accept=".pdf,image/*" onChange={e => setStudentCardFile(e.target.files?.[0] || null)} className="hidden" id="student-card" />
              <Button type="button" variant="outline" asChild className="border-white/20 hover:bg-white/10">
                <label htmlFor="student-card" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </label>
              </Button>
              {studentCardFile && (
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                  <span className="truncate max-w-[150px]">{studentCardFile.name}</span>
                  <button type="button" onClick={() => setStudentCardFile(null)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-foreground/30">PDF, JPG, PNG (max 5MB)</p>
          </div>
        )}

        {type === "stars" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#639922]" />
              Achievements (select all that apply)
            </Label>
            <div className="space-y-3">
              {STAR_ACHIEVEMENTS.map(ach => {
                const isSelected = selectedAchievements.includes(ach.id);
                const hasFile = !!achievementFiles[ach.id];
                return (
                  <div key={ach.id} className={cn(
                    "rounded-xl border transition-all",
                    isSelected ? "border-[#639922]/40 bg-[#639922]/5" : "border-white/10 bg-white/[0.02]"
                  )}>
                    <div className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={ach.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleAchievement(ach.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={ach.id} className="font-medium text-sm cursor-pointer">{ach.label}</label>
                          <p className="text-xs text-foreground/40 mt-0.5">{ach.description}</p>
                        </div>
                        {hasFile && <CheckCircle2 className="h-4 w-4 text-[#639922]" />}
                      </div>
                      {isSelected && !hasFile && (
                        <div className="mt-3 ml-6">
                          <input type="file" accept=".pdf,image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setAchievementFiles(prev => ({ ...prev, [ach.id]: file }));
                          }} className="hidden" id={`file-${ach.id}`} />
                          <Button type="button" variant="outline" size="sm" asChild className="border-white/20 text-foreground/80">
                            <label htmlFor={`file-${ach.id}`} className="cursor-pointer">
                              <Upload className="h-3 w-3 mr-1" /> Upload proof
                            </label>
                          </Button>
                        </div>
                      )}
                      {isSelected && hasFile && (
                        <div className="mt-2 ml-6 flex items-center gap-2 text-xs">
                          <FileText className="h-3 w-3 text-[#639922]" />
                          <span className="text-foreground/60">{achievementFiles[ach.id].name}</span>
                          <button type="button" onClick={() => {
                            const newFiles = { ...achievementFiles };
                            delete newFiles[ach.id];
                            setAchievementFiles(newFiles);
                          }} className="text-red-400 hover:text-red-300">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-foreground/30 mt-2">At least one achievement with proof is required to request a Stars certificate.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg border-white/10 bg-gradient-to-b from-[#121316] to-[#0c0d10] text-foreground max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-white/10 bg-white/[0.02]">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#639922] to-[#a8d85a] bg-clip-text text-transparent">
            Request a Certificate
          </DialogTitle>
          <p className="text-xs text-foreground/40 mt-1">
            Fill in the details below. All starred fields are mandatory.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          {/* Certificate Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground/60">Certificate type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as CertificateType)}>
              <SelectTrigger className="bg-white/[0.03] border-white/10 focus:border-[#639922]/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#181b1f] border-white/10">
                {CERTIFICATE_TYPES.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#639922]/20">
                    <span className="mr-2">{opt.icon}</span> {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Form content depends on type & connection */}
          {renderFormContent()}

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button type="submit" disabled={isLoading || !canProceed} className="bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-black hover:shadow-lg transition-all">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isLoading ? "Submitting..." : "Request Certificate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}