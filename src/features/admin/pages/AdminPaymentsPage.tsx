// pages/admin/AdminPaymentsPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAdminPayments } from "../hooks/useAdminPayments";

export default function AdminPaymentsPage() {
    const { pendingRequests, loading, actionLoading, approve, reject } = useAdminPayments();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-background">
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
                <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />
                <div className="relative z-10 container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 w-48 bg-white/10 rounded mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-white/5 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getPlanLabel = (planType: string) => {
        const labels: Record<string, string> = {
            student_monthly: "Student Monthly",
            student_yearly: "Student Yearly",
            company_monthly: "Company Starter",
            company_yearly: "Company Growth",
            company_enterprise: "Enterprise"
        };
        return labels[planType] || planType;
    };

    return (
        <div className="relative min-h-screen bg-background overflow-hidden">
            {/* Background grid & glow */}
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
            <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute bottom-[-80px] right-1/2 w-[500px] h-[300px] bg-[#639922]/5 blur-3xl rounded-full" />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-400/10 p-2">
                            <CreditCard className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Payment Requests</h1>
                            <p className="text-sm text-foreground/40 mt-1">
                                Review and approve student/company premium upgrade requests
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/30">
                            {pendingRequests.length} Pending
                        </Badge>
                    </div>
                </div>

                {/* Requests list */}
                {pendingRequests.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center backdrop-blur-sm">
                        <CreditCard className="mx-auto h-12 w-12 text-foreground/20 mb-3" />
                        <h3 className="text-lg font-medium text-foreground/60">No pending payments</h3>
                        <p className="text-sm text-foreground/40">All payment requests have been processed.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map(req => (
                            <Card key={req.id} className="group border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* User info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-foreground">
                                                    {req.profiles.first_name} {req.profiles.last_name}
                                                </h3>
                                                <Badge variant="outline" className="border-white/20 text-foreground/60 text-xs">
                                                    {req.profiles.email}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                                <span className="text-foreground/70">
                                                    <strong className="text-[#639922]">Plan:</strong> {getPlanLabel(req.plan_type)}
                                                </span>
                                                <span className="text-foreground/70">
                                                    <strong className="text-[#639922]">Amount:</strong> {req.amount} DA
                                                </span>
                                                <span className="text-foreground/70">
                                                    <strong className="text-[#639922]">Submitted:</strong> {new Date(req.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {req.notes && (
                                                <p className="mt-2 text-sm text-foreground/50 border-l-2 border-[#639922]/30 pl-2 italic">
                                                    “{req.notes}”
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPreviewUrl(req.receipt_url!)}
                                                className="border-white/20 text-foreground/70 hover:bg-white/10 hover:text-foreground"
                                            >
                                                <Eye className="h-4 w-4 mr-1" /> Receipt
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => approve(req.id)}
                                                disabled={actionLoading === req.id}
                                                className="bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 hover:text-green-300"
                                            >
                                                {actionLoading === req.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => reject(req.id)}
                                                disabled={actionLoading === req.id}
                                                variant="destructive"
                                                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:text-red-300"
                                            >
                                                {actionLoading === req.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                )}
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Receipt preview dialog */}
            <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
                <DialogContent className="max-w-2xl border-white/10 bg-background/95 backdrop-blur-md">
                    <div className="rounded-lg overflow-hidden">
                        {previewUrl && (
                            previewUrl.match(/\.(jpeg|jpg|png|gif)$/i) ?
                                <img src={previewUrl} alt="Payment receipt" className="w-full rounded" /> :
                                <iframe src={previewUrl} title="Receipt" className="w-full h-[70vh] rounded" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}