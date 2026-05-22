// AuthPage.tsx
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, TrendingUp, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { RoleSelector } from "../components/RoleSelector";
import { VerificationStep } from "../components/VerificationStep";
import { StudentForm } from "../components/forms/StudentForm";
import { CompanyForm } from "../components/forms/CompanyForm";
import { UniversityForm } from "../components/forms/UniversityForm";
import MassarLogo from "@/assets/Logo-icon.jpg";

/* ── Preview card data (mirrors Hero) ──────────────────── */
const topMatch = {
  role: "Product Manager",
  company: "Sonatrach Digital",
  location: "Algiers, DZ",
  score: 94,
  tags: ["Full-time", "Strategy", "Agile"],
};

const avatars = [
  { initials: "SA", bg: "#639922" },
  { initials: "MK", bg: "#185FA5" },
  { initials: "LR", bg: "#993556" },
  { initials: "YB", bg: "#854F0B" },
];

/* ── Left decorative panel ─────────────────────────────── */
function PreviewPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full p-12 border-r border-border overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.4)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.4)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full gradient-hero blur-3xl opacity-60" />

      <Link to="/" className="relative z-10 flex items-center gap-2.5 w-fit">
        <img src={MassarLogo} alt="Massar" className="h-8 w-8 rounded-lg border border-border" />
        <span className="font-bold text-foreground text-base tracking-tight">Massar</span>
      </Link>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="relative w-full h-[360px]">
          {/* Top-match card */}
          <div
            className="absolute left-0 top-0 w-64 rounded-2xl border bg-card/60 p-4 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/10"
            style={{ animation: "floatA 5s ease-in-out infinite" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Top match</span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                {topMatch.score}%
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">{topMatch.role}</p>
            <p className="mb-3 text-[11px] text-muted-foreground">{topMatch.company} · {topMatch.location}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topMatch.tags.map(t => (
                <span key={t} className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${topMatch.score}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-primary">{topMatch.score}%</span>
            </div>
          </div>

          {/* Stats card */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-48 rounded-2xl border bg-card/60 p-4 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/10"
            style={{ animation: "floatB 6s ease-in-out infinite" }}
          >
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">New roles</p>
            <p className="mt-0.5 text-xl font-black text-foreground">1,284</p>
            <p className="text-[11px] text-muted-foreground">this week</p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-primary">
              <TrendingUp className="h-3 w-3" />
              +23%
            </div>
          </div>

          {/* Social proof card */}
          <div
            className="absolute bottom-0 left-0 rounded-2xl border bg-card/60 p-4 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/10"
            style={{ animation: "floatC 7s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex">
                {avatars.map((av, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[9px] font-bold text-white"
                    style={{ background: av.bg, marginLeft: i === 0 ? 0 : -8 }}
                  >
                    {av.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">45,000+ students</p>
                <p className="text-[10px] text-muted-foreground">already matched</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-muted-foreground/50 tracking-widest uppercase font-medium">
        — Built for ambition.
      </p>
    </div>
  );
}

/* ── Login form ────────────────────────────────────────── */
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const { login, isLoading } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Sign in</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick up exactly where you left off.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="auth-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <Input
            id="auth-email" type="email" required placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="auth-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
          </div>
          <div className="relative">
            <Input
              id="auth-password" type={showPw ? "text" : "password"} required placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-white/20 pr-10"
            />
            <Button
              type="button" variant="ghost" size="icon"
              className="absolute right-0 top-0 h-full px-3 text-foreground/40 hover:text-foreground hover:bg-white/10"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          type="submit" disabled={isLoading} size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 group mt-1"
        >
          {isLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <><span>Sign In</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
          }
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/40 mt-5">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-4 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          Create one
        </button>
      </p>
    </motion.div>
  );
}

/* ── Register flow ─────────────────────────────────────── */
function RegisterFlow({ onSwitch }: { onSwitch: () => void }) {
  const {
    step,
    role,
    isLoading,
    verificationCode,
    resendCooldown,
    pendingEmail,
    setVerificationCode,
    setStep,
    handleRoleSelect,
    handleFormSubmit,
    handleVerify,
    handleResendCode,
  } = useRegister();

  const META: Record<string, { title: string; desc: string }> = {
    student:          { title: "Student",    desc: "Find internships and jobs" },
    company_admin:    { title: "Company",    desc: "Post jobs & manage candidates" },
    university_admin: { title: "University", desc: "" },
    super_admin:      { title: "Super Admin",desc: "Full system control" },
  };
  const meta = role ? META[role] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {step === "verify" ? (
        <VerificationStep
          email={pendingEmail} code={verificationCode}
          isLoading={isLoading} resendCooldown={resendCooldown}
          onCodeChange={setVerificationCode} onVerify={handleVerify}
          onResend={() => handleResendCode(pendingEmail)}
          onBack={() => setStep("form")}
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              {step === "form" && (
                <button
                  onClick={() => setStep("role")}
                  className="flex items-center justify-center w-6 h-6 rounded-md border border-white/10 text-foreground/40 hover:text-foreground hover:border-white/20 transition-colors bg-transparent cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              )}
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {step === "role" ? "Create account" : meta?.title}
              </p>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {step === "role" ? "Who are you?" : meta?.desc}
            </h1>
            {step === "role" && (
              <p className="text-sm text-muted-foreground mt-1">Choose your role to get started.</p>
            )}
          </div>

          {/* RoleSelector – only main roles (no company type) */}
          {step === "role" && (
            <RoleSelector selectedRole={role} onRoleSelect={handleRoleSelect} />
          )}

          {step === "form" && role === "student" && (
            <StudentForm isLoading={isLoading} onSubmit={handleFormSubmit} />
          )}

          {step === "form" && role === "company_admin" && (
            <CompanyForm isLoading={isLoading} onSubmit={handleFormSubmit} />
          )}

          {step === "form" && role === "university_admin" && (
            <UniversityForm isLoading={isLoading} onSubmit={handleFormSubmit} />
          )}

          {step === "role" && (
            <p className="text-center text-sm text-foreground/40 mt-5">
              Already have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-4 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Login
              </button>
            </p>
          )}
        </>
      )}

      {step !== "verify" && (
        <p className="text-center text-xs text-foreground/25 mt-5">
          By continuing you agree to Terms &amp; Privacy
        </p>
      )}
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );

  return (
    <div className="relative min-h-screen bg-background flex overflow-hidden">

      {/* Global grid — identical to Hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Hero glow — identical class */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/2 rounded-full gradient-hero blur-3xl" />

      <div className="relative z-10 hidden lg:block w-[46%] flex-shrink-0">
        <PreviewPanel />
      </div>

      {/* ── Right / form column ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:p-10 ">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <Link to="/">
              <img src={MassarLogo} alt="Massar" className="h-9 w-9 rounded-xl border border-border" />
            </Link>
          </div>

          {/* Tab switcher — same pill badge style as Hero */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-border bg-background/60 backdrop-blur-sm mb-6 w-fit mx-auto">
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border-none capitalize ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form card — same glass card as Hero floating cards */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl p-7 sm:p-8">
            <AnimatePresence mode="wait">
              {mode === "login"
                ? <LoginForm    key="login"    onSwitch={() => setMode("register")} />
                : <RegisterFlow key="register" onSwitch={() => setMode("login")}    />
              }
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(-50%) translateX(0px); }
          50%      { transform: translateY(-50%) translateX(-6px); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}