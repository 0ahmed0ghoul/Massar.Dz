// components/GraduationCertificateModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Award } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  studentName: string;
}

export function GraduationCertificateModal({ open, onOpenChange, token, studentName }: Props) {
  const [qrSize, setQrSize] = useState(200);

  useEffect(() => {
    const updateSize = () => {
      setQrSize(Math.min(window.innerWidth * 0.5, 200));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const qrValue = `${window.location.origin}/student/scan?token=${token}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md md:max-w-lg border border-white/[0.09] bg-background text-foreground shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#639922]" />
            <DialogTitle className="text-lg font-bold text-foreground sm:text-xl">
              Graduation Certificate
            </DialogTitle>
          </div>
          <p className="text-sm text-foreground/40 mt-1">{studentName}</p>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="rounded-xl bg-white p-3 shadow-lg">
            <QRCodeSVG value={qrValue} size={qrSize} />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-foreground/80">
              Scan to receive certificate
            </p>
            <p className="text-xs text-foreground/40">
              Student must scan this QR code from their dashboard to officially receive the certificate.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}