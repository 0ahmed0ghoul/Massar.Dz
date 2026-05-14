// features/student/components/AddCertificateModal.tsx
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
import { useStudentType } from "@/features/auth/hooks/useStudentType";
import { AddCertificateModalProps, CertificateType } from "@/types/certificate";
import { CERTIFICATE_TYPES, STAR_ACHIEVEMENTS } from "@/constants/certificate.constant";

export function AddCertificateModal({ open, onOpenChange, onAdd }: AddCertificateModalProps) {
  const { user, profile } = useAuth();
  const { type: studentType, loading: studentTypeLoading } = useStudentType();
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
  const [error, setError] = useState<string | null>(null);

  // Available options based on student type
  const availableTypes = CERTIFICATE_TYPES.filter(opt => {
    if (opt.isUniversity) return studentType === "studying"; // stars/major only for studying
    if (opt.value === "graduation") return studentType === "graduated"; // graduation only for graduates
    return true; // hackathon, english, etc.
  });

  useEffect(() => {
    if (open && availableTypes.length > 0) {
      const isCurrentAvailable = availableTypes.some(opt => opt.value === type);
      if (!isCurrentAvailable) setType(availableTypes[0].value);
    }
  }, [open, availableTypes, type]);

  // Check university connection for stars/major
  useEffect(() => {
    if (!open) return;
    const isUni = type === "stars" || type === "major";
    if (isUni && studentType === "studying") {
      const checkConnection = async () => {
        setCheckingConnection(true);
        try {
          if (profile?.university_connection_status !== undefined) {
            setConnectionStatus(profile.university_connection_status === "connected");
          } else {
            const { data, error } = await supabase
              .from("profiles")
              .select("university_connection_status")
              .eq("id", user?.id)
              .single();
            if (!error && data) setConnectionStatus(data.university_connection_status === "connected");
            else setConnectionStatus(false);
          }
        } catch { setConnectionStatus(false); }
        finally { setCheckingConnection(false); }
      };
      checkConnection();
    } else {
      setConnectionStatus(null);
      setCheckingConnection(false);
    }
  }, [open, type, user, profile, studentType]);

  // Check pending request for university certificates
  useEffect(() => {
    if (!open || !user || !(type === "stars" || type === "major") || studentType !== "studying") {
      setHasPendingRequest(false);
      return;
    }
    const checkPending = async () => {
      const { data, error } = await supabase
        .from("certificate_requests")
        .select("id")
        .eq("student_id", user.id)
        .eq("type", type)
        .eq("status", "pending")
        .maybeSingle();
      if (!error && data) setHasPendingRequest(true);
      else setHasPendingRequest(false);
    };
    checkPending();
  }, [open, user, type, studentType]);

  const reset = () => {
    const defaultType = availableTypes.length > 0 ? availableTypes[0].value : "hackathon";
    setType(defaultType);
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
    setHasPendingRequest(false);
  };

  const getUniversityName = async () => {
    if (!user) return "University";
  
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        university_name,
        university_connection_status
      `)
      .eq("id", user.id)
      .maybeSingle();
  
    if (error) {
      console.error("Error fetching university name:", error);
      return "University";
    }
  
    // Only return university if connection is approved
    if (
      profile?.university_connection_status === "connected" &&
      profile?.university_name
    ) {
      return profile.university_name;
    }
  
    return "University";
  };
  const uploadProofFile = async (userId: string, file: File, starType: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/stars/${starType}_${Date.now()}.${fileExt}`;
    const filePath = `certificate-requests/${fileName}`;
    const { error: uploadError } = await supabase.storage.from("student-files").upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: { publicUrl } } = supabase.storage.from("student-files").getPublicUrl(filePath);
    return publicUrl;
  };

  const submitUniversityRequest = async () => {
    if (!user) throw new Error("Not authenticated");
    const universityName = await getUniversityName();

    if (type === "stars") {
      if (selectedStars.length < 3) {
        setError("You must select at least 3 achievements.");
        return false;
      }
      const proofUrls: Record<string, string> = {};
      for (const star of selectedStars) {
        const file = starProofs[star];
        if (!file) {
          setError(`Please upload proof for "${STAR_ACHIEVEMENTS.find(a => a.id === star)?.label}".`);
          return false;
        }
        proofUrls[star] = await uploadProofFile(user.id, file, star);
      }
      const { error } = await supabase.from("certificate_requests").insert({
        student_id: user.id,
        type: "stars",
        achievements: selectedStars,
        proof_urls: proofUrls,
        status: "pending",
        title: `Stars Certificate - ${universityName}`,
        issuer: universityName,
        issue_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
    } else if (type === "major") {
      const { error } = await supabase.from("certificate_requests").insert({
        student_id: user.id,
        type: "major",
        status: "pending",
        title: `Major Certificate - ${universityName}`,
        issuer: universityName,
        issue_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
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
        if (studentType !== "studying") throw new Error("University certificates only for studying students.");
        if (!connectionStatus) throw new Error("You must be connected to your university.");
        if (hasPendingRequest) throw new Error("You already have a pending request for this certificate.");
        await submitUniversityRequest();
        onAdd({ type, title: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", achievements: type === "stars" ? selectedStars : undefined });
        reset();
        onOpenChange(false);
      } else {
        // Self‑claimed (graduation, hackathon, etc.)
        if (!title || !issuer || !issueDate) throw new Error("Please fill in title, issuer, and issue date.");
        await onAdd({ type, title, issuer, issueDate, expiryDate, credentialId, files: genericFile ? { certificate: genericFile } : undefined });
        reset();
        onOpenChange(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isUniversityCertificate = type === "stars" || type === "major";
  const hasConnection = connectionStatus === true;
  const canProceed = (() => {
    if (isUniversityCertificate) {
      if (studentType !== "studying") return false;
      if (!hasConnection) return false;
      if (hasPendingRequest) return false;
      if (type === "stars") return selectedStars.length >= 3 && selectedStars.every(s => starProofs[s]);
      return true; // major
    } else {
      return !!(title && issuer && issueDate);
    }
  })();

  const toggleStar = (starId: string) => {
    setSelectedStars(prev => prev.includes(starId) ? prev.filter(s => s !== starId) : [...prev, starId]);
  };

  const handleStarProof = (starId: string, file: File) => {
    setStarProofs(prev => ({ ...prev, [starId]: file }));
  };

  const removeStarProof = (starId: string) => {
    const newProofs = { ...starProofs };
    delete newProofs[starId];
    setStarProofs(newProofs);
  };

  if (studentTypeLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg"><div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-[#639922]" /></div></DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg border-white/10 bg-gradient-to-b from-[#121316] to-[#0c0d10] text-foreground max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#639922] to-[#a8d85a] bg-clip-text text-transparent">Request a Certificate</DialogTitle>
          <p className="text-xs text-foreground/40 mt-1">Select the type and provide required information.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground/60">Certificate type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as CertificateType)}>
              <SelectTrigger className="bg-white/[0.03] border-white/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#181b1f] border-white/10">
                {availableTypes.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="mr-2">{opt.icon}</span> {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm flex items-start gap-2"><AlertCircle className="h-4 w-4 mt-0.5" /> {error}</div>}

          {!isUniversityCertificate && (
            <>
              <div><Label>Certificate title *</Label><Input value={title} onChange={e=>setTitle(e.target.value)} className="bg-white/[0.02] border-white/10" /></div>
              <div><Label>Issuing organization *</Label><Input value={issuer} onChange={e=>setIssuer(e.target.value)} className="bg-white/[0.02] border-white/10" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Issue date *</Label><Input type="date" value={issueDate} onChange={e=>setIssueDate(e.target.value)} className="bg-white/[0.02] border-white/10" /></div>
                <div><Label>Expiry date (opt.)</Label><Input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="bg-white/[0.02] border-white/10" /></div>
              </div>
              <div><Label>Credential ID (opt.)</Label><Input value={credentialId} onChange={e=>setCredentialId(e.target.value)} className="bg-white/[0.02] border-white/10" /></div>
              <div className="rounded-xl border border-white/10 p-4">
                <Label className="text-sm font-medium">Attach file (optional)</Label>
                <input type="file" accept=".pdf,image/*" onChange={e=>setGenericFile(e.target.files?.[0]||null)} className="hidden" id="generic-file" />
                <Button type="button" variant="outline" asChild className="border-white/20 hover:bg-white/10 mt-2"><label htmlFor="generic-file" className="cursor-pointer"><Upload className="h-4 w-4 mr-2" />Choose file</label></Button>
                {genericFile && <div className="mt-2 flex items-center gap-1 text-sm"><span className="truncate max-w-[200px]">{genericFile.name}</span><button type="button" onClick={()=>setGenericFile(null)} className="text-red-400"><X className="h-4 w-4" /></button></div>}
              </div>
            </>
          )}

          {isUniversityCertificate && studentType !== "studying" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-amber-400 mb-2" />
              <p className="text-sm font-medium text-amber-300">Not available</p>
              <p className="text-xs text-foreground/50">University certificates are only for currently studying students.</p>
            </div>
          )}

          {isUniversityCertificate && studentType === "studying" && (
            <>
              {checkingConnection && <div className="flex items-center gap-2 text-amber-400"><Loader2 className="h-4 w-4 animate-spin" /> Checking university connection...</div>}
              {!checkingConnection && !hasConnection && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
                  <WifiOff className="mx-auto h-8 w-8 text-red-400 mb-2" />
                  <p className="text-sm font-medium text-red-300">Not connected to your university</p>
                  <p className="text-xs text-foreground/50">You must be connected to request a {type === "stars" ? "Stars" : "Major"} Certificate.</p>
                </div>
              )}
              {hasConnection && hasPendingRequest && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-sm font-medium text-amber-300">Request Already Pending</p>
                  <p className="text-xs text-foreground/50">Please wait for the university to review your request.</p>
                </div>
              )}
              {hasConnection && !hasPendingRequest && (
                <>
                  {type === "major" && (
                    <div className="rounded-xl border border-[#639922]/30 bg-[#639922]/5 p-4">
                      <Label className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-[#639922]" /> Student Information</Label>
                      <p className="text-sm text-foreground/70 mt-1">Your student card is already on file. No additional upload required.</p>
                    </div>
                  )}
                  {type === "stars" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /> Achievements (at least 3)</Label>
                      {STAR_ACHIEVEMENTS.map(ach => {
                        const selected = selectedStars.includes(ach.id);
                        const hasFile = !!starProofs[ach.id];
                        return (
                          <div key={ach.id} className={cn("rounded-xl border transition-all", selected ? "border-[#639922]/40 bg-[#639922]/5" : "border-white/10")}>
                            <div className="p-3">
                              <div className="flex items-start gap-3">
                                <Checkbox id={`star-${ach.id}`} checked={selected} onCheckedChange={()=>toggleStar(ach.id)} className="mt-1" />
                                <div className="flex-1"><label htmlFor={`star-${ach.id}`} className="font-medium text-sm cursor-pointer">{ach.label}</label><p className="text-xs text-foreground/40">{ach.description}</p></div>
                                {hasFile && <CheckCircle2 className="h-4 w-4 text-[#639922]" />}
                              </div>
                              {selected && !hasFile && (
                                <div className="mt-3 ml-6"><input type="file" accept=".pdf,image/*" onChange={(e)=>e.target.files?.[0]&&handleStarProof(ach.id,e.target.files[0])} className="hidden" id={`proof-${ach.id}`} /><Button type="button" variant="outline" size="sm" asChild><label htmlFor={`proof-${ach.id}`} className="cursor-pointer"><Upload className="h-3 w-3 mr-1" />Upload proof</label></Button></div>
                              )}
                              {selected && hasFile && <div className="mt-2 ml-6 flex items-center gap-2 text-xs"><FileText className="h-3 w-3 text-[#639922]" /><span className="text-foreground/60 truncate">{starProofs[ach.id].name}</span><button onClick={()=>removeStarProof(ach.id)} className="text-red-400"><X className="h-3 w-3" /></button></div>}
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-xs text-foreground/40">Selected: {selectedStars.length} / 3 stars.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={()=>onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !canProceed} className="bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-black">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUniversityCertificate ? "Request Certificate" : "Add Certificate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}