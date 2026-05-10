// pages/PricingPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Upload,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { usePayment } from "../service/usePayment";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { COMPANY_PLANS, getStudentPromotion, STUDENT_PLANS } from "@/constants/pricing.constants";
import { Plan } from "@/types/payment";

type TabType = "student" | "company" | "all";

export default function PricingPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { submitPayment, submitting } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [roleMismatchDialog, setRoleMismatchDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [promotion, setPromotion] = useState<{
    eligible: boolean;
    discount: number;
    message: string | null;
    freePlanId: string | null;
  }>({ eligible: false, discount: 0, message: null, freePlanId: null });

  // Check student certificates to apply promotion
  useEffect(() => {
    if (profile?.role === "student") {
      const certificates = (profile as any).certificates || [];
      const hasStars = certificates.some((c: any) => c.type === "stars");
      const hasMajor = certificates.some((c: any) => c.type === "major");
      setPromotion(getStudentPromotion(hasStars, hasMajor));
    }
  }, [profile]);

  const handleChoosePlan = (plan: Plan) => {
    // Check role compatibility
    const userRole = profile?.role;
    const isStudent = userRole === "student";
    const isCompany = userRole === "company_admin";

    if (plan.for === "student" && !isStudent) {
      setRoleMismatchDialog({
        open: true,
        message:
          "This plan is designed for students. If you're a company representative, please check our Company plans.",
      });
      return;
    }
    if (plan.for === "company" && !isCompany) {
      setRoleMismatchDialog({
        open: true,
        message:
          "This plan is designed for companies. If you're a student, please check our Student plans.",
      });
      return;
    }
    setSelectedPlan(plan);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan || (!promotion.freePlanId && !receiptFile)) return;
    let finalPlan = selectedPlan;
    let finalAmount = selectedPlan.price;

    if (promotion.freePlanId && promotion.discount === 100) {
      finalPlan = STUDENT_PLANS.find((p) => p.id === promotion.freePlanId)!;
      finalAmount = 0;
    } else if (promotion.eligible && promotion.discount > 0) {
      finalAmount = Math.floor(
        selectedPlan.price * (1 - promotion.discount / 100)
      );
    }

    await submitPayment(finalPlan.id, finalAmount, receiptFile as File, notes);
    setSelectedPlan(null);
    setReceiptFile(null);
    setNotes("");
    alert("Payment request submitted! Waiting for admin approval.");
  };

  // Determine which plans to display based on active tab
  let displayedPlans: Plan[] = [];
  if (activeTab === "student") displayedPlans = STUDENT_PLANS;
  else if (activeTab === "company") displayedPlans = COMPANY_PLANS;
  else displayedPlans = [...STUDENT_PLANS, ...COMPANY_PLANS];

  // Helper to check if a plan is currently active for the user
  const isPlanActive = (planId: string): boolean => {
    if (!profile) return false;
    // If user has current_plan_id field (set after payment approval)
    if ((profile as any).current_plan_id === planId) return true;
    // For companies, if they are premium and plan is company plan, we consider active (but better check exact id)
    if (profile.role === "company_admin" && profile.is_premium && planId.startsWith("company_")) {
      // If no specific current_plan_id, assume the yearly growth plan is active (example fallback)
      // In real scenario, store current_plan_id in profile after approval.
      return (profile as any).current_plan_id === planId;
    }
    return false;
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-[#639922]/10 border border-[#639922]/20">
            <Zap className="w-6 h-6 text-[#639922]" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Premium Plans</h1>
          <p className="text-foreground/40 mt-2 max-w-lg mx-auto">
            Unlock advanced features with the plan that suits you best.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
            {(["student", "company", "all"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#639922] text-black shadow-md"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "student"
                  ? "Student"
                  : tab === "company"
                  ? "Company"
                  : "All Plans"}
              </button>
            ))}
          </div>
        </div>

        {/* Promotion banner for students */}
        {profile?.role === "student" &&
          promotion.eligible &&
          promotion.message &&
          (activeTab === "student" || activeTab === "all") && (
            <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#639922]/20 to-[#639922]/5 border border-[#639922]/30 p-4 text-center backdrop-blur-sm">
              <Sparkles className="inline-block h-5 w-5 text-[#639922] mr-2" />
              <span className="text-foreground/90">{promotion.message}</span>
              {promotion.discount === 100 && (
                <Badge className="ml-3 bg-[#639922] text-black">100% OFF</Badge>
              )}
              {promotion.discount === 50 && (
                <Badge className="ml-3 bg-amber-500 text-black">50% OFF</Badge>
              )}
            </div>
          )}

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayedPlans.map((plan) => {
            let finalPrice = plan.price;
            let discountLabel = null;
            if (
              profile?.role === "student" &&
              plan.for === "student" &&
              promotion.eligible
            ) {
              if (
                promotion.discount === 100 &&
                promotion.freePlanId === plan.id
              ) {
                finalPrice = 0;
                discountLabel = "FREE with your certificates";
              } else if (
                promotion.discount === 50 &&
                plan.id.includes("yearly")
              ) {
                finalPrice = Math.floor(plan.price * 0.5);
                discountLabel = `50% off (${plan.price} DA → ${finalPrice} DA)`;
              } else if (promotion.discount === 50) {
                finalPrice = Math.floor(plan.price * 0.5);
                discountLabel = `50% off applied`;
              }
            }

            const isActive = isPlanActive(plan.id);

            return (
              <Card
                key={plan.id}
                className={`relative border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5 ${
                  plan.recommended
                    ? "border-[#639922]/40 ring-1 ring-[#639922]/30"
                    : ""
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#639922] text-black px-3 py-0.5 text-xs font-bold">
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    {finalPrice === 0 ? (
                      <p className="text-3xl font-bold text-[#639922]">FREE</p>
                    ) : (
                      <p className="text-3xl font-bold">
                        {finalPrice} DA{" "}
                        <span className="text-sm font-normal text-foreground/50">
                          / {plan.period}
                        </span>
                      </p>
                    )}
                    {discountLabel && (
                      <p className="text-xs text-[#639922] mt-1">
                        {discountLabel}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-foreground/70"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-[#639922]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isActive ? (
                    <Button disabled className="w-full bg-white/10 text-white/50 cursor-not-allowed">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleChoosePlan(plan)}
                      className="w-full bg-gradient-to-r from-[#639922] to-[#4f7a1a] text-black hover:shadow-lg transition-all group"
                    >
                      {finalPrice === 0 ? "Claim for Free" : "Choose Plan"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Role mismatch dialog */}
      <Dialog
        open={roleMismatchDialog.open}
        onOpenChange={(open) =>
          setRoleMismatchDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="max-w-md border-white/10 bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">
              Plan Not Available
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/80">{roleMismatchDialog.message}</p>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  setRoleMismatchDialog({ open: false, message: "" })
                }
                className="bg-[#639922] text-black"
              >
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md border-white/10 bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Complete Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-sm text-foreground/80">
                Send{" "}
                <strong>
                  {selectedPlan
                    ? promotion.freePlanId === selectedPlan.id &&
                      promotion.discount === 100
                      ? 0
                      : selectedPlan.price
                    : 0}{" "}
                  DA
                </strong>{" "}
                to CCP account:
              </p>
              <p className="text-lg font-mono font-bold text-[#639922]">
                123456 78
              </p>
              <p className="text-xs text-foreground/40">
                Massar (Benyoucef Benkhedda)
              </p>
            </div>

            {!(
              promotion.freePlanId === selectedPlan?.id &&
              promotion.discount === 100
            ) && (
              <>
                <div>
                  <Label>Upload Payment Receipt *</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setReceiptFile(e.target.files?.[0] || null)
                      }
                      className="w-full text-foreground/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#639922]/20 file:text-[#639922] hover:file:bg-[#639922]/30"
                    />
                  </div>
                </div>
                <div>
                  <Label>Transaction ID / Notes (optional)</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., transaction reference"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </>
            )}

            <Button
              onClick={handleUpgrade}
              disabled={
                (!receiptFile &&
                  !(
                    promotion.freePlanId === selectedPlan?.id &&
                    promotion.discount === 100
                  )) ||
                submitting
              }
              className="w-full bg-[#639922] text-black hover:bg-[#4f7a1a]"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}