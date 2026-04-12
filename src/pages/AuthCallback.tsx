import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
        return;
      }
      
      if (session) {
        // Get user role from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        // Redirect based on role
        if (profile?.role === "student") navigate("/dashboard/student");
        else if (profile?.role === "employer") navigate("/dashboard/employer");
        else if (profile?.role === "university") navigate("/dashboard/university");
        else navigate("/");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e]">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
};

export default AuthCallback;