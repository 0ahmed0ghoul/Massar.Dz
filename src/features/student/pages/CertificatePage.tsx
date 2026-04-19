// pages/student/CertificatePage.tsx
import { useState } from "react";
import { CheckCircle, XCircle, Scan, ShieldCheck } from "lucide-react";
import { useUniversityData } from "@/features/university/hooks/useUniversityData";
import { QRScanner } from "@/features/university/components/QRScanner";

export default function CertificatePage() {
  const { scanCertificate, getClaimByToken } = useUniversityData();

  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const token = url.searchParams.get("token");

      if (!token) {
        setScanResult({
          success: false,
          message: "Invalid QR code: no token found.",
        });
        return;
      }

      const claim = getClaimByToken(token);

      if (!claim) {
        setScanResult({
          success: false,
          message: "Certificate not found or already claimed.",
        });
        return;
      }

      if (claim.scannedAt) {
        setScanResult({
          success: false,
          message: `Already scanned on ${new Date(
            claim.scannedAt
          ).toLocaleDateString()}`,
        });
        return;
      }

      const success = scanCertificate(token);

      if (success) {
        setScanResult({
          success: true,
          message: `Certificate received successfully 🎉`,
        });
      } else {
        setScanResult({
          success: false,
          message: "Something went wrong. Please try again.",
        });
      }
    } catch {
      setScanResult({
        success: false,
        message: "Invalid QR code format.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0c0e] overflow-hidden">
      {/* GRID BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* GLOW EFFECT */}
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">

        {/* HERO HEADER */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-[#639922]/10 border border-[#639922]/20">
            <ShieldCheck className="w-6 h-6 text-[#639922]" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Certificate Verification
          </h1>

          <p className="text-white/40 mt-2 text-sm">
            Scan your university QR code to securely claim your certificate
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="relative group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* animated glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#639922]/10 blur-3xl opacity-60 group-hover:opacity-100 transition duration-700" />

          <div className="relative p-6 md:p-8 space-y-6">

            {/* STEP INFO */}
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Scan className="w-4 h-4 text-[#639922]" />
              <span>Step 1: Scan the QR code</span>
            </div>

            {/* SCANNER */}
            <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
              <QRScanner onScanSuccess={handleScanSuccess} />
            </div>

            {/* EMPTY STATE */}
            {!scanResult && (
              <div className="text-center text-white/30 text-sm py-4">
                Waiting for scan...
              </div>
            )}

            {/* RESULT */}
            {scanResult && (
              <div
                className={`flex items-start gap-3 rounded-xl p-4 border ${
                  scanResult.success
                    ? "bg-[#639922]/10 border-[#639922]/30 text-[#639922]"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <div>
                  {scanResult.success ? (
                    <CheckCircle className="w-5 h-5 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 mt-0.5" />
                  )}
                </div>

                <div className="text-sm font-medium leading-relaxed">
                  {scanResult.message}
                </div>
              </div>
            )}

            {/* EXTRA INFO */}
            <div className="text-xs text-white/30 border-t border-white/10 pt-4">
              This system ensures your certificate is securely verified and cannot be reused.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}