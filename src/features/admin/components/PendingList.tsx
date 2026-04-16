// features/admin/components/PendingList.tsx
import { Inbox } from "lucide-react";
import { Profile } from "../services/admin.service";
import { PendingCard } from "./PendingCard";

interface PendingListProps {
  profiles: Profile[];
  actionLoading: string | null;
  onApprove: (profile: Profile) => void;
  onReject: (profile: Profile) => void;
  loading?: boolean;
}

export const PendingList = ({ profiles, actionLoading, onApprove, onReject, loading }: PendingListProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-20 text-center">
        <Inbox className="h-10 w-10 text-white/20 mb-3" />
        <p className="text-white/40 font-medium">No pending accounts</p>
        <p className="text-white/20 text-sm mt-1">All submissions have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {profiles.map((profile) => (
        <PendingCard
          key={profile.id}
          profile={profile}
          actionLoading={actionLoading}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};