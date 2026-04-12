import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Eye, EyeOff, Sparkles, ArrowRight, School } from "lucide-react";
import MassarLogo from "@/assets/Logo-icon.jpg";

const RegisterUniversity = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0e] p-4 overflow-hidden">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle gradient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-white transition-all hover:opacity-80">
            <div className="rounded-lg bg-white/10 p-1.5">
              <img src={MassarLogo} alt="Massar Logo" className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Massar
            </span>
          </Link>
          <p className="mt-2 text-sm text-white/40">
            Join 120+ universities worldwide
          </p>
        </div>

        <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center border-b border-white/10 pb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <School className="h-5 w-5 text-white/60" />
            </div>
            <CardTitle className="text-2xl text-white">University Registration</CardTitle>
            <CardDescription className="text-white/40">
              Track student outcomes and improve your rankings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="universityName" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  University name
                </Label>
                <Input 
                  id="universityName" 
                  placeholder="MIT" 
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Admin first name
                  </Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Admin last name
                  </Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Institutional email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@university.edu" 
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min 8 characters" 
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full px-3 text-white/40 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Country
                  </Label>
                  <Input 
                    placeholder="USA" 
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    City
                  </Label>
                  <Input 
                    placeholder="Cambridge" 
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 group"
              >
                <span>Register University</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline hover:text-white/80 transition-colors">
                Sign in
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-xs text-white/30">or</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="text-center">
              <p className="text-xs text-white/30">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-white/50 hover:text-white transition-colors">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="mt-6 flex justify-center gap-6 text-center">
          {[
            { value: "120+", label: "Universities" },
            { value: "45K+", label: "Students" },
            { value: "91%", label: "Placement Rate" },
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-sm font-semibold text-white">{stat.value}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterUniversity;