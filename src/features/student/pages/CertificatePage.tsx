// pages/student/CertificatePage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { useUniversityData } from "@/features/university/hooks/useUniversityData";
import { QRScanner } from "@/features/university/components/QRScanner";

export default function CertificatePage() {
  const { scanCertificate, getClaimByToken } = useUniversityData();
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    // Extract token from URL (format: http://.../student/scan?token=xyz)
    const url = new URL(decodedText);
    const token = url.searchParams.get("token");
    if (!token) {
      setScanResult({ success: false, message: "Invalid QR code: no token found." });
      return;
    }

    const claim = getClaimByToken(token);
    if (!claim) {
      setScanResult({ success: false, message: "Certificate not found or already claimed." });
      return;
    }

    if (claim.scannedAt) {
      setScanResult({ success: false, message: `Certificate already scanned on ${new Date(claim.scannedAt).toLocaleDateString()}.` });
      return;
    }

    const success = scanCertificate(token);
    if (success) {
      setScanResult({ success: true, message: `Certificate received on ${new Date().toLocaleDateString()}!` });
    } else {
      setScanResult({ success: false, message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Student Certificate Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Scan the QR code provided by your university to officially receive your graduation certificate.
          </p>

          <QRScanner onScanSuccess={handleScanSuccess} />

          {scanResult && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${scanResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {scanResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span>{scanResult.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}