import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MassarLogo from "@/assets/Logo-icon.jpg";
import { supabase } from "@/lib/supabaseClient";

const RegisterStudent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    degreeLevel: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Send verification code via email
  const sendVerificationCode = async (email: string) => {
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code in localStorage or database (in production, use database)
      localStorage.setItem(`verification_${email}`, code);
      localStorage.setItem(`verification_${email}_expires`, (Date.now() + 10 * 60 * 1000).toString()); // 10 min expiry
      
      // Send email using Supabase Edge Function or email service
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code }
      });
      
      if (error) {
        // Fallback: console.log the code for development
        console.log(`Verification code for ${email}: ${code}`);
        toast({
          title: "Development Mode",
          description: `Verification code: ${code} (check console)`,
        });
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Failed to send verification code:", error);
      return false;
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      toast({
        title: "Please wait",
        description: `Wait ${resendCooldown} seconds before resending`,
        variant: "destructive",
      });
      return;
    }
    
    const success = await sendVerificationCode(formData.email);
    if (success) {
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email",
      });
      
      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  // Verify code and complete registration
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if code is valid
      const storedCode = localStorage.getItem(`verification_${formData.email}`);
      const storedExpiry = localStorage.getItem(`verification_${formData.email}_expires`);
      
      if (!storedCode || !storedExpiry) {
        throw new Error("Verification code expired or not found");
      }
      
      if (Date.now() > parseInt(storedExpiry)) {
        throw new Error("Verification code has expired. Please request a new one.");
      }
      
      if (storedCode !== verificationCode) {
        throw new Error("Invalid verification code");
      }
      
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'student',
          },
          // Auto-confirm email since we verified with code
          emailRedirectTo: undefined,
        },
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.rpc('create_profile', {
          p_id: authData.user.id,
          p_email: formData.email,
          p_first_name: formData.firstName,
          p_last_name: formData.lastName,
          p_role: 'student',
          p_degree_level: formData.degreeLevel,
        });
        
        if (profileError) throw profileError;
        
        // Manually confirm email since we verified with code
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          authData.user.id,
          { email_confirm: true }
        );
        
        // Clean up stored code
        localStorage.removeItem(`verification_${formData.email}`);
        localStorage.removeItem(`verification_${formData.email}_expires`);
      }
      
      toast({
        title: "Success!",
        description: "Account created successfully! You can now log in.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial signup - create temporary user and send verification code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate email format
      if (!formData.email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .single();
      
      if (existingUser) {
        throw new Error("An account with this email already exists");
      }
      
      // Send verification code
      const codeSent = await sendVerificationCode(formData.email);
      
      if (codeSent) {
        setShowVerification(true);
        toast({
          title: "Verification Code Sent",
          description: `Please check your email for the 6-digit verification code`,
        });
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth signup
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // If showing verification form
  if (showVerification) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0e] p-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-white transition-all hover:opacity-80">
              <div className="rounded-lg bg-white/10 p-1.5">
                <img src={MassarLogo} alt="Massar Logo" className="w-6 h-6" />
              </div>
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Massar</span>
            </Link>
          </div>
          
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center border-b border-white/10 pb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <CheckCircle className="h-5 w-5 text-white/60" />
              </div>
              <CardTitle className="text-2xl text-white">Verify Your Email</CardTitle>
              <CardDescription className="text-white/40">
                Enter the 6-digit code sent to {formData.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Verification Code
                  </Label>
                  <Input 
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
                
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Verify & Create Account</>
                  )}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
                
                <div className="text-center text-sm text-white/40">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowVerification(false);
                      setVerificationCode("");
                    }}
                    className="text-white hover:underline"
                  >
                    Go back
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main registration form
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0e] p-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
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
            Join 45,000+ students already on Massar
          </p>
        </div>

        <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center border-b border-white/10 pb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <Sparkles className="h-5 w-5 text-white/60" />
            </div>
            <CardTitle className="text-2xl text-white">Create Student Account</CardTitle>
            <CardDescription className="text-white/40">
              Start your career journey today
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    First name
                  </Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Last name
                  </Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
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
              
              <div className="space-y-2">
                <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Degree level
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, degreeLevel: value })}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-white/10">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0b0c0e] text-white">
                    <SelectItem value="bachelor" className="focus:bg-white/10 focus:text-white">Bachelor's</SelectItem>
                    <SelectItem value="master" className="focus:bg-white/10 focus:text-white">Master's</SelectItem>
                    <SelectItem value="phd" className="focus:bg-white/10 focus:text-white">PhD</SelectItem>
                    <SelectItem value="bootcamp" className="focus:bg-white/10 focus:text-white">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
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
                    <span>Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-xs text-white/30">or</span>
              </div>
            </div>
            
            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            
            <div className="mt-6 text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline hover:text-white/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterStudent;