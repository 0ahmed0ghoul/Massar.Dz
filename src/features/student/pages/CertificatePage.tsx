// pages/student/CertificatePage.tsx
import { useState, useEffect } from "react";
import { 
  Award, GraduationCap, Star, Trophy, Users, 
  Plus, Scan, ShieldCheck, XCircle, CheckCircle,
  Calendar, FileText, Eye, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from "@/features/university/components/QRScanner";
import { AddCertificateModal } from "../components/AddCertificateModal";
import { CertificateDetailModal } from "../components/CertificateDetailModal";
import { useCertificates } from "../hooks/useCertificates";
import { Certificate, CertificateType } from "../../../types/certificate";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useStudentType } from "@/features/auth/hooks/useStudentType";

export default function CertificatePage() {
  const { user } = useAuth();
  const { type: candidateType, loading: typeLoading } = useStudentType();
  const [universityConnectionStatus, setUniversityConnectionStatus] = useState<string | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(true);
  
  const { certificates, loading, addCertificate, claimGraduationCertificate, refresh } = useCertificates();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Fetch university connection status (only needed for studying students)
  useEffect(() => {
    async function fetchConnectionStatus() {
      if (!user || candidateType !== 'studying') {
        setConnectionLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("university_connections")
        .select("status")
        .eq("student_id", user.id)
        .maybeSingle();
      if (error) console.error("Error fetching connection:", error);
      setUniversityConnectionStatus(data?.status || null);
      setConnectionLoading(false);
    }
    fetchConnectionStatus();
  }, [user, candidateType]);

  const isConnected = universityConnectionStatus === "accepted";
  const isStudying = candidateType === 'studying';
  const isGraduated = candidateType === 'graduated';
  const isSelfTaught = candidateType === 'self_taught';

  const handleScanSuccess = async (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const token = url.searchParams.get("token");
      if (!token) {
        setScanResult({ success: false, message: "Invalid QR code: no token found." });
        return;
      }
      const newCert = await claimGraduationCertificate(token);
      if (newCert) {
        setScanResult({ success: true, message: "Graduation certificate claimed successfully! 🎓" });
        setShowScanner(false);
        refresh();
      } else {
        setScanResult({ success: false, message: "Something went wrong. Please try again." });
      }
    } catch (error: any) {
      setScanResult({ success: false, message: error.message || "Invalid QR code format." });
    }
  };

  const handleAddCertificate = async (request: {
    type: CertificateType;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    files?: Record<string, File>;
    achievements?: string[];
  }) => {
    // For university certificates (major/stars) we only refresh the list – the request is stored in certificate_requests
    if (request.type === "stars" || request.type === "major") {
      refresh();
      return;
    }

    // Self‑claimed certificates: add directly
    let file: File | undefined;
    if (request.files) {
      const firstKey = Object.keys(request.files)[0];
      if (firstKey) file = request.files[firstKey];
    }
    await addCertificate(
      request.type,
      request.title,
      request.issuer,
      request.issueDate,
      request.expiryDate,
      request.credentialId,
      file
    );
    refresh();
  };

  const openDetail = (cert: Certificate) => {
    setSelectedCert(cert);
    setShowDetailModal(true);
  };

  const getIconByType = (type: CertificateType) => {
    switch (type) {
      case "stars": return <Star className="h-5 w-5 text-amber-400" />;
      case "major": return <GraduationCap className="h-5 w-5 text-blue-400" />;
      case "graduation": return <Award className="h-5 w-5 text-purple-400" />;
      case "hackathon": return <Trophy className="h-5 w-5 text-orange-400" />;
      case "english": return <FileText className="h-5 w-5 text-green-400" />;
      default: return <Award className="h-5 w-5 text-[#639922]" />;
    }
  };

  const getCategoryLabel = (type: CertificateType) => {
    if (["stars", "major", "graduation"].includes(type)) return "University Certificates";
    if (type === "hackathon") return "Competitions & Hackathons";
    if (type === "english") return "Language Certificates";
    return "Other Certificates";
  };

  const groupedCertificates = certificates.reduce((acc, cert) => {
    const cat = getCategoryLabel(cert.type);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

  const isLoading = loading || typeLoading || connectionLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
          <p className="text-sm text-foreground/40">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-[#639922]/10 border border-[#639922]/20">
            <ShieldCheck className="w-6 h-6 text-[#639922]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-foreground/40 mt-2 text-sm">Manage your academic achievements</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <Button onClick={() => setShowAddModal(true)} className="bg-[#639922] text-black">
            <Plus className="w-4 h-4 mr-2" /> Add Certificate
          </Button>

          {isStudying && (
            isConnected ? (
              <Button variant="outline" onClick={() => setShowScanner(!showScanner)} className="border-white/20">
                <Scan className="w-4 h-4 mr-2" /> {showScanner ? "Hide Scanner" : "Claim Graduation Certificate"}
              </Button>
            ) : (
              <div className="text-sm text-foreground/40 bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                You need to be connected to a university department to claim a graduation certificate.
              </div>
            )
          )}

          {isGraduated && (
            <div className="text-sm text-foreground/40 bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2">
              <Award className="h-4 w-4" />
              As a graduate, you can upload your graduation certificate manually using "Add Certificate".
            </div>
          )}

          {isSelfTaught && (
            <div className="text-sm text-foreground/40 bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2">
              <Star className="h-4 w-4" />
              Self‑taught learners can add skills certificates and achievements.
            </div>
          )}
        </div>

        {showScanner && (
          <div className="mb-8">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Scan className="h-5 w-5 text-[#639922]" /> Scan University QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
                  <QRScanner onScanSuccess={handleScanSuccess} />
                </div>
                {scanResult && (
                  <div className={`mt-4 flex items-start gap-3 rounded-xl p-4 border ${
                    scanResult.success
                      ? "bg-[#639922]/10 border-[#639922]/30 text-[#639922]"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}>
                    {scanResult.success ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <XCircle className="w-5 h-5 mt-0.5" />}
                    <div className="text-sm font-medium leading-relaxed">{scanResult.message}</div>
                  </div>
                )}
                <p className="text-xs text-foreground/30 mt-4">
                  Scan the QR code provided by your university to claim your graduation certificate.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 rounded-full p-1 mb-6">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-[#639922] data-[state=active]:text-black">All</TabsTrigger>
            {Object.keys(groupedCertificates).map(cat => (
              <TabsTrigger key={cat} value={cat} className="rounded-full data-[state=active]:bg-[#639922] data-[state=active]:text-black">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-8">
              {Object.entries(groupedCertificates).map(([category, certs]) => (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#639922]" /> {category}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {certs.map(cert => (
                      <CertificateCard 
                        key={cert.id} 
                        certificate={cert} 
                        icon={getIconByType(cert.type)} 
                        onClick={() => openDetail(cert)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {Object.entries(groupedCertificates).map(([category, certs]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {certs.map(cert => (
                  <CertificateCard 
                    key={cert.id} 
                    certificate={cert} 
                    icon={getIconByType(cert.type)} 
                    onClick={() => openDetail(cert)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {certificates.length === 0 && !loading && (
          <div className="text-center py-12 text-foreground/30">
            No certificates yet. Add your first certificate using the button above.
          </div>
        )}
      </div>

      <AddCertificateModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddCertificate} />
      <CertificateDetailModal
        open={showDetailModal} 
        onOpenChange={setShowDetailModal} 
        certificate={selectedCert} 
      />
    </div>
  );
}

function CertificateCard({ certificate, icon, onClick }: { certificate: Certificate; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#639922]/10">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{certificate.title}</h3>
            <p className="text-xs text-foreground/40">{certificate.issuer}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-foreground/30">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {certificate.issue_date}</span>
              {certificate.credential_id && <span>ID: {certificate.credential_id}</span>}
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-[#639922]/20 text-[#639922] text-xs">Verified</Badge>
      </div>
      <div className="mt-3 flex justify-end">
        <span className="text-xs text-foreground/40 flex items-center gap-1 group-hover:text-[#639922] transition-colors">
          <Eye className="h-3 w-3" /> View details
        </span>
      </div>
    </div>
  );
}