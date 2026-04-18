// components/GraduationCertificateModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  studentName: string;
}

export function GraduationCertificateModal({ open, onOpenChange, token, studentName }: Props) {
  // The QR code will contain a URL to the student scanning page with the token
  const qrValue = `${window.location.origin}/student/scan?token=${token}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Graduation Certificate – {studentName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <QRCodeSVG value={qrValue} size={200} />
          <p className="text-sm text-muted-foreground text-center">
            Student must scan this QR code from their dashboard to officially receive the certificate.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}