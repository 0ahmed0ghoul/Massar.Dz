import { Link } from "react-router-dom";
import { Clock, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MassarLogo from "@/assets/Logo-icon.jpg";

const STEPS = [
  {
    icon: <CheckCircle2 className="h-4 w-4 text-foreground/60" />,
    label: "Application submitted",
    done: true,
  },
  {
    icon: <Clock className="h-4 w-4 text-amber-400" />,
    label: "Manual review by Massar team",
    done: false,
    active: true,
  },
  {
    icon: <Mail className="h-4 w-4 text-foreground/30" />,
    label: "Confirmation email sent to you",
    done: false,
  },
];

const PendingApproval = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-xl text-foreground transition-all hover:opacity-80 mb-10"
        >
          <div className="rounded-lg bg-white/10 p-1.5">
            <img src={MassarLogo} alt="Massar Logo" className="w-6 h-6" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Massar
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl p-8">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
            <Clock className="h-7 w-7 text-amber-400" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Under Review
          </h1>
          <p className="text-foreground/40 text-sm leading-relaxed mb-8">
            Your university account is being reviewed by our team. This usually
            takes <span className="text-foreground/60">1–2 business days</span>.
            You'll receive an email once it's approved.
          </p>

          {/* Progress steps */}
          <div className="text-left space-y-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border
                    ${
                      s.done
                        ? "border-white/20 bg-white/10"
                        : s.active
                        ? "border-amber-400/30 bg-amber-400/10"
                        : "border-white/10 bg-white/5"
                    }`}
                >
                  {s.icon}
                </div>
                <span
                  className={`text-sm ${
                    s.done
                      ? "text-foreground/60 line-through"
                      : s.active
                      ? "text-amber-400"
                      : "text-foreground/30"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 group"
            >
              <Link to="/">
                Go to Homepage
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <p className="text-xs text-foreground/30">
              Questions?{" "}
              <a
                href="mailto:support@massar.com"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
