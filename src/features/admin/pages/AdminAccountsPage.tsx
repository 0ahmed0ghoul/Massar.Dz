// features/admin/pages/AdminAccountsPage.tsx
import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { AdminFilters } from "../components/AdminFilters";
import { AccountsTable } from "../components/AccountsTable";
import { RoleFilter, StatusFilter } from "../constants/admin.constants";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { adminService } from "../services/admin.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Profile } from "../types/verification.types";
import { usePendingVerification } from "../hooks/usePendingVerification";

export const AdminAccountsPage = () => {
  const { user } = useAuth(); // Get current admin user ID
  const { fetchProfiles, updateStatus, deleteProfile, actionLoading, loading } = useAdmin();
  const { sendConnectionInvitation } = usePendingVerification();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sendingInvite, setSendingInvite] = useState<string | null>(null);

  const loadProfiles = async () => {
    const data = await fetchProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const ok = await updateStatus(id, status);
    if (ok) setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await deleteProfile(id, name);
    if (ok) setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSendInvitation = async (profile: Profile) => {
    if (!profile.university_name) {
      toast.error("Student hasn't selected a university");
      return;
    }
    setSendingInvite(profile.id);
    try {
      const { data: universities, error: findError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'university_admin')
        .eq('university_name', profile.university_name)
        .limit(1);
      if (findError || !universities?.length) throw new Error("University not found");
      const universityId = universities[0].id;

      await sendConnectionInvitation(profile.id, universityId, user!.id);
      toast.success("Connection invitation sent to the university");
      // Refresh profiles to update the connection status (now should be 'pending')
      await loadProfiles();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSendingInvite(null);
    }
  };

  const filtered = profiles.filter((p) => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    const org = (p.university_name || p.company_name || "").toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || p.email.toLowerCase().includes(q) || org.includes(q);
    const matchRole = roleFilter === "all" || p.role === roleFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Accounts</h1>
          <p className="text-foreground/40 text-sm mt-1">{profiles.length} total · {filtered.length} shown</p>
        </div>
        <button
          onClick={loadProfiles}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <AdminFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-20 text-center">
          <Users className="h-10 w-10 text-foreground/20 mb-3" />
          <p className="text-foreground/40 font-medium">No accounts found</p>
          <p className="text-foreground/20 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <AccountsTable
          profiles={filtered}
          actionLoading={actionLoading}
          sendingInvite={sendingInvite}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSendInvitation={handleSendInvitation}
        />
      )}
    </div>
  );
};