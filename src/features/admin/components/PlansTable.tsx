// features/admin/components/PlansTable.tsx
import { Crown, MoreVertical, Check, X, Eye, Building2, GraduationCap, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PremiumAccount, PaymentRequest } from "../hooks/usePlansManagement";

interface PlansTableProps {
  accounts: PremiumAccount[];
  actionLoading: string | null;
  onRevokePremium: (userId: string, userName: string) => void;
  onRestorePremium: (userId: string, userName: string) => void;
  onUpdatePaymentStatus: (paymentId: string, status: 'approved' | 'rejected', userId: string, userName: string) => void;
}

const getRoleIcon = (role: string) => {
  if (role === "student") return <GraduationCap className="h-4 w-4" />;
  if (role === "company_admin") return <Building2 className="h-4 w-4" />;
  return <Crown className="h-4 w-4" />;
};

const getRoleColor = (role: string) => {
  if (role === "student") return "text-blue-400 bg-blue-400/10";
  if (role === "company_admin") return "text-purple-400 bg-purple-400/10";
  return "text-yellow-400 bg-yellow-400/10";
};

const getPlanStatusBadge = (status: string, daysActive?: number) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500/20 text-green-400">Active ({daysActive}/30 days)</Badge>;
    case "expiring_soon":
      return <Badge className="bg-yellow-500/20 text-yellow-400">Expiring Soon ({daysActive}/30 days)</Badge>;
    case "expired":
      return <Badge className="bg-red-500/20 text-red-400">Expired ({daysActive}/30 days)</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getDaysActiveColor = (daysActive: number = 0) => {
  if (daysActive >= 30) return "text-red-500 font-bold";
  if (daysActive >= 25) return "text-yellow-500";
  return "text-green-500";
};

export function PlansTable({ accounts, actionLoading, onRevokePremium, onRestorePremium, onUpdatePaymentStatus }: PlansTableProps) {
  const getLatestPendingPayment = (payments: PaymentRequest[]) => {
    return payments.find(p => p.status === 'pending');
  };

  const getLatestApprovedPayment = (payments: PaymentRequest[]) => {
    return payments.find(p => p.status === 'approved');
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/[0.03] border-b border-white/10">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">User</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Role</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Plan Status</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Days Active</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Payment Status</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Plan Type</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-foreground/50">Amount</th>
              <th className="text-right py-4 px-4 text-xs font-medium text-foreground/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const latestPending = getLatestPendingPayment(account.payment_requests);
              const latestApproved = getLatestApprovedPayment(account.payment_requests);
              const isRevoking = actionLoading === account.id;
              const isUpdating = actionLoading === latestPending?.id;
              const daysColor = getDaysActiveColor(account.days_active);
              
              return (
                <tr key={account.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {account.first_name} {account.last_name}
                      </p>
                      <p className="text-xs text-foreground/40">{account.email}</p>
                      {account.company_name && (
                        <p className="text-xs text-foreground/30 mt-1">{account.company_name}</p>
                      )}
                      {account.university_name && (
                        <p className="text-xs text-foreground/30 mt-1">{account.university_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.role)}`}>
                      {getRoleIcon(account.role)}
                      {account.role === "company_admin" ? "Company" : account.role === "student" ? "Student" : account.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getPlanStatusBadge(account.plan_status || 'expired', account.days_active)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden w-20">
                        <div 
                          className={`h-full rounded-full ${
                            (account.days_active || 0) >= 30 ? 'bg-red-500' : 
                            (account.days_active || 0) >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((account.days_active || 0) / 30 * 100, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${daysColor}`}>
                        {account.days_active || 0}/30 days
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {latestPending ? (
                      <div className="space-y-1">
                        <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onUpdatePaymentStatus(latestPending.id, 'approved', account.id, `${account.first_name} ${account.last_name}`)}
                            disabled={isUpdating}
                            className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            title="Approve"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onUpdatePaymentStatus(latestPending.id, 'rejected', account.id, `${account.first_name} ${account.last_name}`)}
                            disabled={isUpdating}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Reject"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : latestApproved ? (
                      <Badge className="bg-green-500/20 text-green-400">Approved</Badge>
                    ) : (
                      <Badge variant="outline">No Payment</Badge>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-sm text-foreground">
                        {latestApproved?.plan_type === "company_premium" ? "Premium" :
                         latestApproved?.plan_type === "company_basic" ? "Basic" :
                         latestApproved?.plan_type === "student_premium" ? "Student Premium" : "Premium"}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">
                      {latestApproved ? `${latestApproved.amount.toLocaleString()} DZD` : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-white/10 bg-slate-800">
                        {account.is_premium ? (
                          <DropdownMenuItem
                            onClick={() => onRevokePremium(account.id, `${account.first_name} ${account.last_name}`)}
                            disabled={isRevoking}
                            className="text-red-400 focus:text-red-400"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {isRevoking ? "Removing..." : "Remove Premium"}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onRestorePremium(account.id, `${account.first_name} ${account.last_name}`)}
                            disabled={isRevoking}
                            className="text-green-400 focus:text-green-400"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {isRevoking ? "Restoring..." : "Restore Premium"}
                          </DropdownMenuItem>
                        )}
                        {latestApproved?.receipt_url && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={latestApproved.receipt_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 mr-2" />
                                View Receipt
                              </a>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}