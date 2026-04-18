// components/UniversityConnectionCard.tsx
import { Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

interface UniversityConnectionCardProps {
  profile: Profile;
  onRequestConnection: () => Promise<void>;
  isRequesting?: boolean;
}

export const UniversityConnectionCard = ({
  profile,
  onRequestConnection,
  isRequesting = false,
}: UniversityConnectionCardProps) => {
  const isVerified = profile.isVerified === true;
  const isConnected = profile.university_connection_status === true;

  return (
    <div className="rounded-2xl border border-theme-border bg-theme-card p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "rounded-full p-3",
              isConnected
                ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                : "text-theme-muted bg-theme-muted/10"
            )}
          >
            {isConnected ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-theme-text">University Connection</h3>
            <p className="text-sm text-theme-muted">
              {isConnected
                ? `You are connected to ${profile.university_name || "your university"}. You can now claim certificates.`
                : isVerified
                ? `Connect with ${profile.university_name || "your university"} to access certificate claims.`
                : "Complete admin verification before requesting university connection."}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {!isConnected && (
            <button
              onClick={onRequestConnection}
              disabled={!isVerified || isRequesting}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                isVerified
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "cursor-not-allowed bg-theme-border text-theme-muted"
              )}
            >
              {isRequesting ? "Connecting..." : "Request Connection"}
            </button>
          )}
        </div>
      </div>

      {!isVerified && !isConnected && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <p className="text-xs">Admin verification is required before connecting with your university.</p>
        </div>
      )}
    </div>
  );
};