// features/admin/pages/AdminPlansPage.tsx
import { RefreshCw, Crown } from "lucide-react";
import { usePlansManagement } from "../hooks/usePlansManagement";
import { PlansFilters } from "../components/PlansFilters";
import { PlansStatsCards } from "../components/PlansStatsCards";
import { PlansTable } from "../components/PlansTable";

export const AdminPlansPage = () => {
  const {
    accounts,
    totalAccounts,
    loading,
    actionLoading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    stats,
    revokePremium,
    restorePremium,
    updatePaymentStatus,
    refresh,
  } = usePlansManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plans Management</h1>
          <p className="text-foreground/40 text-sm mt-1">
            {totalAccounts} premium {totalAccounts === 1 ? "user" : "users"} total
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <PlansStatsCards stats={stats} />

      {/* Filters */}
      <PlansFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={setPaymentStatusFilter}
      />

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-20 text-center">
          <Crown className="h-10 w-10 text-foreground/20 mb-3" />
          <p className="text-foreground/40 font-medium">No users found</p>
          <p className="text-foreground/20 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <PlansTable
          accounts={accounts}
          actionLoading={actionLoading}
          onRevokePremium={revokePremium}
          onRestorePremium={restorePremium}
          onUpdatePaymentStatus={updatePaymentStatus}
        />
      )}
    </div>
  );
}