// features/admin/components/AccountsTable.tsx
import { Profile } from "../services/admin.service";
import { AccountRow } from "./AccountRow";

interface AccountsTableProps {
  profiles: Profile[];
  actionLoading: string | null;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const AccountsTable = ({ profiles, actionLoading, onStatusChange, onDelete }: AccountsTableProps) => (
  <div className="rounded-xl border border-white/10 overflow-hidden">
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-wider text-foreground/30">
      <span>User</span>
      <span className="hidden sm:block">Role</span>
      <span className="hidden sm:block">Status</span>
      <span>Actions</span>
    </div>
    <div className="divide-y divide-white/[0.06]">
      {profiles.map((profile) => (
        <AccountRow
          key={profile.id}
          profile={profile}
          actionLoading={actionLoading}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);