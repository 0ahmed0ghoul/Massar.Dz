// components/CertificateDetailModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, ExternalLink, Award, User, Building2, Hash, Clock } from "lucide-react";
import { Certificate } from "../types/certificate.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: Certificate | null;
}

export function CertificateDetailModal({ open, onOpenChange, certificate }: Props) {
  if (!certificate) return null;

  const isImage = certificate.file_url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  const isPdf = certificate.file_url?.match(/\.pdf$/i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/10 bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-[#639922]" />
            Certificate Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Header with badge */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{certificate.title}</h3>
              <p className="text-sm text-foreground/40">{certificate.issuer}</p>
            </div>
            <Badge className="bg-[#639922]/20 text-[#639922]">Verified ✅</Badge>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-foreground/60">
              <Calendar className="h-4 w-4 text-[#639922]" />
              <span>Issued: {certificate.issue_date}</span>
            </div>
            {certificate.expiry_date && (
              <div className="flex items-center gap-2 text-foreground/60">
                <Clock className="h-4 w-4 text-[#639922]" />
                <span>Expires: {certificate.expiry_date}</span>
              </div>
            )}
            {certificate.credential_id && (
              <div className="flex items-center gap-2 text-foreground/60 sm:col-span-2">
                <Hash className="h-4 w-4 text-[#639922]" />
                <span>Credential ID: {certificate.credential_id}</span>
              </div>
            )}
          </div>

          {/* Certificate file preview */}
          {certificate.file_url && (
            <div className="mt-3">
              <p className="text-xs font-medium text-foreground/50 mb-2">Certificate Document</p>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                {isImage && (
                  <img src={certificate.file_url} alt="Certificate" className="max-h-64 rounded object-contain mx-auto" />
                )}
                {isPdf && (
                  <iframe src={certificate.file_url} className="w-full h-64 rounded" title="Certificate PDF" />
                )}
                {!isImage && !isPdf && (
                  <a href={certificate.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[#639922] hover:underline">
                    <FileText className="h-4 w-4" /> View Full Certificate
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Additional info for graduation certificate */}
          {certificate.type === "graduation" && (
            <div className="mt-2 p-3 rounded-lg bg-[#639922]/10 border border-[#639922]/20">
              <p className="text-xs text-[#639922] font-medium">🎓 This is an official graduation certificate verified by your university.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}