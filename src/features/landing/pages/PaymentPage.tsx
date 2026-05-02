// pages/PaymentPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { subscriptionService } from "@/features/admin/services/subscription.service";

export default function PaymentPage() {
  const { paymentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!paymentId) return;
    subscriptionService.getPaymentRequest(paymentId).then(setPayment).catch(console.error);
  }, [paymentId]);

  const handleUpload = async () => {
    if (!receiptFile || !user) return;
    setUploading(true);
    try {
      const url = await subscriptionService.uploadReceipt(paymentId, receiptFile);
      await subscriptionService.updatePaymentRequest(paymentId, { receipt_url: url, status: "pending" });
      alert("Receipt uploaded successfully. Awaiting admin verification.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!payment) {
    return <div className="flex justify-center py-12">Loading payment details...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Complete Your Payment</h1>

        <div className="mb-6 p-4 rounded-xl bg-[#639922]/10 border border-[#639922]/30">
          <p className="text-sm text-foreground/80">Bank details for transfer:</p>
          <p className="font-mono text-lg text-[#639922] mt-1">CCP: 123456 78</p>
          <p className="text-xs text-foreground/50">Beneficiary: Massar Platform</p>
          <p className="text-xs text-foreground/50">Amount: {payment.amount} DZD</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Upload payment receipt (screenshot or photo)</Label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="receipt" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" /> Choose file
                </label>
              </Button>
              {receiptFile && <span className="text-sm text-foreground/60">{receiptFile.name}</span>}
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || !receiptFile}
            className="w-full bg-[#639922] text-black hover:bg-[#4f7a1a]"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
            {uploading ? "Uploading..." : "Submit Payment Proof"}
          </Button>
        </div>
      </div>
    </div>
  );
}