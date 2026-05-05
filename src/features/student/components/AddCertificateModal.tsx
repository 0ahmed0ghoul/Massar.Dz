// components/AddCertificateModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, AlertCircle, CheckCircle2, Loader2, WifiOff, Sparkles, FileText, ShieldCheck } from "lucide-react";
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

const CERTIFICATE_TYPES: { value: CertificateType; label: string; icon: string; isUniversity: boolean }[] = [
  { value: "stars", label: "Stars Certificate", icon: "⭐", isUniversity: true },
  { value: "major", label: "Major Certificate", icon: "🎓", isUniversity: true },
  { value: "hackathon", label: "Hackathon / Competition", icon: "🏆", isUniversity: false },
  { value: "english", label: "English Certificate", icon: "🌐", isUniversity: false },
  { value: "self_taught", label: "Self‑Taught / Online Course", icon: "📚", isUniversity: false },
];

const STAR_ACHIEVEMENTS = [
  { id: "major", label: "Major Excellence", description: "Being top of your major" },
  { id: "delegate", label: "Student Delegate", description: "Active student representation" },
  { id: "internship", label: "Internship Completion", description: "Completed an internship" },
  { id: "club", label: "Club Participation", description: "Active member of a student club" },
  { id: "language", label: "Language Certificate", description: "Official language certificate (TOEFL, IELTS, etc.)" },
];

export function AddCertificateModal({ open, onOpenChange, onAdd }: AddCertificateModalProps) {
  const { user, profile } = useAuth();
  const [type, setType] = useState<CertificateType>("stars");
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [starProofs, setStarProofs] = useState<Record<string, File>>({});
  const [genericFile, setGenericFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [checkingPending, setCheckingPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check university connection
  useEffect(() => {
    if (!open) return;
    const isUni = type === "stars" || type === "major";
    if (isUni) {
      const checkConnection = async () => {
        setCheckingConnection(true);
        try {
          if (profile?.university_connection_status !== undefined) {
            setConnectionStatus(profile.university_connection_status === "accepted");
          } else {
            const { data, error } = await supabase
              .from("profiles")
              .select("university_connection_status")
              .eq("id", user?.id)
              .single();
            if (!error && data) setConnectionStatus(data.university_connection_status === "accepted");
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

  // Check if there's already a pending request for the selected university certificate type
  useEffect(() => {
    if (!open || !user || !(type === "stars" || type === "major")) {
      setHasPendingRequest(false);
      return;
    }
    const checkPending = async () => {
      setCheckingPending(true);
      const { data, error } = await supabase
        .from("certificate_requests")
        .select("id")
        .eq("student_id", user.id)
        .eq("type", type)
        .eq("status", "pending")
        .maybeSingle();
      if (!error && data) setHasPendingRequest(true);
      else setHasPendingRequest(false);
      setCheckingPending(false);
    };
    checkPending();
  }, [open, user, type]);

  const reset = () => {
    setType("stars");
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setExpiryDate("");
    setCredentialId("");
    setSelectedStars([]);
    setStarProofs({});
    setGenericFile(null);
    setError(null);
    setConnectionStatus(null);
    setCheckingConnection(false);
    setHasPendingRequest(false);
    setCheckingPending(false);
  };

  const getUniversityName = async () => {
    if (!user) return "University";
    const { data: connection } = await supabase
      .from("university_connections")
      .select("university_id")
      .eq("student_id", user.id)
      .eq("status", "accepted")
      .maybeSingle();
    if (connection) {
      const { data: uniProfile } = await supabase
        .from("profiles")
        .select("university_name")
        .eq("id", connection.university_id)
        .single();
      return uniProfile?.university_name || "University";
    }
    return "University";
  };

  const uploadProofFile = async (userId: string, file: File, starType: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/stars/${starType}_${Date.now()}.${fileExt}`;
    const filePath = `certificate-requests/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("student-files")
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: { publicUrl } } = supabase.storage
      .from("student-files")
      .getPublicUrl(filePath);
    return publicUrl;
  };

  const submitUniversityRequest = async () => {
    if (!user) throw new Error("Not authenticated");
    const universityName = await getUniversityName();

    if (type === "stars") {
      if (selectedStars.length < 3) {
        setError("You must select at least 3 achievements to earn the Stars Certificate.");
        return false;
      }
      const proofUrls: Record<string, string> = {};
      for (const star of selectedStars) {
        const file = starProofs[star];
        if (!file) {
          setError(`Please upload proof for "${STAR_ACHIEVEMENTS.find(a => a.id === star)?.label}".`);
          return false;
        }
        const url = await uploadProofFile(user.id, file, star);
        proofUrls[star] = url;
      }
      const { error: insertError } = await supabase.from("certificate_requests").insert({
        student_id: user.id,
        type: "stars",
        achievements: selectedStars,
        proof_urls: proofUrls,
        status: "pending",
        title: `Stars Certificate - ${universityName}`,
        issuer: universityName,
        issue_date: new Date().toISOString().split("T")[0],
      });
      if (insertError) throw new Error(insertError.message);
    } else if (type === "major") {
      const { error: insertError } = await supabase.from("certificate_requests").insert({
        student_id: user.id,
        type: "major",
        status: "pending",
        title: `Major Certificate - ${universityName}`,
        issuer: universityName,
        issue_date: new Date().toISOString().split("T")[0],
      });
      if (insertError) throw new Error(insertError.message);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const isUni = type === "stars" || type === "major";

      if (isUni) {
        if (!connectionStatus) {
          setError("You need to be connected to your university to request this certificate.");
          setIsLoading(false);
          return;
        }
        if (hasPendingRequest) {
          setError("You already have a pending request for this certificate.");
          setIsLoading(false);
          return;
        }
        await submitUniversityRequest();
        onAdd({
          type,
          title: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          achievements: type === "stars" ? selectedStars : undefined,
        });
        reset();
        onOpenChange(false);
      } else {
        if (!title || !issuer || !issueDate) {
          setError("Please fill in title, issuer, and issue date.");
          setIsLoading(false);
          return;
        }
        const files: Record<string, File> = {};
        if (genericFile) files["certificate"] = genericFile;
        onAdd({
          type,
          title,
          issuer,
          issueDate,
          expiryDate,
          credentialId,
          files: Object.keys(files).length ? files : undefined,
        });
        reset();
        onOpenChange(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const isUniversityCertificate = type === "stars" || type === "major";
  const hasConnection = connectionStatus === true;

  const canProceed = (() => {
    if (isUniversityCertificate) {
      if (!hasConnection) return false;
      if (hasPendingRequest) return false;
      if (type === "stars") {
        return selectedStars.length >= 3 && selectedStars.every(s => starProofs[s]);
      }
      return true; // major
    } else {
      return !!(title && issuer && issueDate);
    }
  })();

  const toggleStar = (starId: string) => {
    setSelectedStars(prev =>
      prev.includes(starId) ? prev.filter(s => s !== starId) : [...prev, starId]
    );
  };

  const handleStarProof = (starId: string, file: File | null) => {
    if (!file) return;
    setStarProofs(prev => ({ ...prev, [starId]: file }));
  };

  const removeStarProof = (starId: string) => {
    const newProofs = { ...starProofs };
    delete newProofs[starId];
    setStarProofs(newProofs);
  };

  const renderFormContent = () => {
    // Self‑claimed certificates
    if (!isUniversityCertificate) {
      return (
        <>
          <div className="space-y-4">
            <div>
              <Label>Certificate title *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Bachelor’s in Computer Science" className="bg-white/[0.02] border-white/10" />
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
              <Input value={credentialId} onChange={e => setCredentialId(e.target.value)} placeholder="e.g., CERT-001" className="bg-white/[0.02] border-white/10" />
            </div>
          </div>
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

    // University certificates: check connection status
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

    // Connected: now check if there's a pending request
    if (hasPendingRequest && !checkingPending) {
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-amber-400 mb-2" />
          <p className="text-sm font-medium text-amber-300">Request Already Pending</p>
          <p className="text-xs text-foreground/50 mt-1">
            You have already requested the {type === "stars" ? "Stars" : "Major"} Certificate. Please wait for the university to review your request.
          </p>
        </div>
      );
    }

    // Connected and no pending request – show form
    return (
      <>
        <div className="rounded-xl bg-[#639922]/10 border border-[#639922]/30 p-3 text-center">
          <p className="text-sm font-medium text-[#a8d85a]">
            ✅ Connected to your university – you can request this certificate.
          </p>
        </div>

        {type === "major" && (
          <div className="rounded-xl border border-[#639922]/30 bg-[#639922]/5 p-4 space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-[#639922]" />
              Student Information
            </Label>
            <p className="text-sm text-foreground/70">Your student card is already on file. No additional upload required.</p>
            <p className="text-xs text-foreground/40">The university will verify your enrollment before issuing the certificate.</p>
          </div>
        )}

        {type === "stars" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Achievements (select at least 3)
            </Label>
            <div className="space-y-3">
              {STAR_ACHIEVEMENTS.map(ach => {
                const isSelected = selectedStars.includes(ach.id);
                const hasFile = !!starProofs[ach.id];
                return (
                  <div key={ach.id} className={cn(
                    "rounded-xl border transition-all",
                    isSelected ? "border-[#639922]/40 bg-[#639922]/5" : "border-white/10 bg-white/[0.02]"
                  )}>
                    <div className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`star-${ach.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleStar(ach.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={`star-${ach.id}`} className="font-medium text-sm cursor-pointer">{ach.label}</label>
                          <p className="text-xs text-foreground/40 mt-0.5">{ach.description}</p>
                        </div>
                        {hasFile && <CheckCircle2 className="h-4 w-4 text-[#639922]" />}
                      </div>
                      {isSelected && !hasFile && (
                        <div className="mt-3 ml-6">
                          <input type="file" accept=".pdf,image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleStarProof(ach.id, file);
                          }} className="hidden" id={`proof-${ach.id}`} />
                          <Button type="button" variant="outline" size="sm" asChild className="border-white/20 text-foreground/80">
                            <label htmlFor={`proof-${ach.id}`} className="cursor-pointer">
                              <Upload className="h-3 w-3 mr-1" /> Upload proof
                            </label>
                          </Button>
                        </div>
                      )}
                      {isSelected && hasFile && (
                        <div className="mt-2 ml-6 flex items-center gap-2 text-xs">
                          <FileText className="h-3 w-3 text-[#639922]" />
                          <span className="text-foreground/60 truncate max-w-[200px]">{starProofs[ach.id].name}</span>
                          <button type="button" onClick={() => removeStarProof(ach.id)} className="text-red-400 hover:text-red-300">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-foreground/40 mt-2">
              You have selected {selectedStars.length} / 3 stars.
            </p>
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
            Select the type and provide required information.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
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

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              {error}
            </div>
          )}

          {renderFormContent()}

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