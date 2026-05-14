import { Building2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { UniversityConnectionCardProps } from "@/types/profile.types";

export const UniversityConnectionCard = ({
  profile,
  onRequestConnection,
  isRequesting = false,
}: UniversityConnectionCardProps) => {
  const isVerified = profile.is_verified === true;
  const isConnected = profile.university_connection_status === "connected";
  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to messages page - the student's only university conversation will be auto-selected
    navigate("/student/dashboard/messages");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#639922]/10 blur-3xl group-hover:bg-[#639922]/15 transition-all duration-700" />

      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "rounded-full p-3 transition-all duration-300",
                isConnected
                  ? "bg-[#639922]/10 text-[#639922]"
                  : "bg-white/[0.05] text-foreground/40"
              )}
            >
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">University Connection</h3>
              <p className="text-sm text-foreground/50">
                {isConnected
                  ? `You are connected to ${profile.university_name || "your university"}. You can now claim certificates.`
                  : isVerified
                  ? `Connect with ${profile.university_name || "your university"} to access certificate claims.`
                  : "Complete admin verification before requesting university connection."}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-3">
            {/* Message button – always visible if connected */}
            {isConnected && (
              <button
                onClick={handleMessage}
                className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
              >
                <MessageCircle className="mr-2 inline h-4 w-4" />
                Message
              </button>
            )}
            {/* Request connection button */}
            {!isConnected && (
              <button
                onClick={onRequestConnection}
                disabled={!isVerified || isRequesting}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  isVerified
                    ? "bg-[#639922] text-foreground shadow-lg shadow-[#639922]/30 hover:bg-[#4f7a1a] hover:shadow-xl"
                    : "cursor-not-allowed bg-white/[0.05] text-foreground/30"
                )}
              >
                {isRequesting ? "Connecting..." : "Request Connection"}
              </button>
            )}
          </div>
        </div>

        {!isVerified && !isConnected && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-4 w-4" />
            <p className="text-xs font-medium">
              Admin verification is required before connecting with your university.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};