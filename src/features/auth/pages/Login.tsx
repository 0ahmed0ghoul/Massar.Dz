import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, ArrowRight, Loader2 } from "lucide-react";
import MassarLogo from "@/assets/Logo-icon.jpg";
import { supabase } from "@/lib/supabaseClient";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Helper function to check if email is confirmed and auto-confirm if needed
  const ensureEmailConfirmed = async (userId: string) => {
    try {
      // Check if email is already confirmed
      const { data: user, error: userError } =
        await supabase.auth.admin.getUserById(userId);

      // If admin access not available (normal user), try to confirm via update
      if (userError || !user?.user?.email_confirmed_at) {
        // Attempt to update user to confirmed status (works if email confirmation is disabled)
        const { error: updateError } = await supabase.auth.updateUser({
          data: { email_confirmed: true },
        });

        if (updateError) {
          console.log(
            "Auto-confirm not available, user may need to verify email"
          );
        }
      }
    } catch (error) {
      console.log("Email confirmation check failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };



  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Grid texture */}
<div className="pointer-events-none absolute inset-0 bg-grid-pattern" />

      <div className="relative z-10 w-full max-w-md">

        <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center border-b border-white/10 pb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <Link to="/" >
            <img src={MassarLogo} alt="Massar Logo" className="w-11 h-11 rounded-full" />
            </Link>
            </div>
            <CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-foreground/40">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground/60 text-xs font-medium uppercase tracking-wider"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-white/20 focus:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-foreground/60 text-xs font-medium uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-foreground/40 hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-white/20 focus:ring-white/10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-foreground/40 hover:text-foreground hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
            <div className="text-center text-sm text-foreground/40 mt-5">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-foreground hover:underline hover:text-foreground/80 transition-colors font-medium"
              >
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
