// features/admin/pages/AdminPlansPage.tsx

import { useState } from "react";
import { 
  RefreshCw, 
  Crown, 
  Eye, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Loader2, 
  Building2, 
  GraduationCap, 
  Calendar, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Users,
  Wallet,
  Clock,
  TrendingUp,
  Ban,
  Check,
  Zap,
  FileText,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlansManagement } from "../hooks/usePlansManagement";

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, color, subtitle }: any) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-foreground/50">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
        {subtitle && <p className="text-[10px] text-foreground/30">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// Payment Request Card Component
const PaymentRequestCard = ({ req, onApprove, onReject, isLoading, onViewReceipt }: any) => {
  const isCompany = req.profiles.role === "company_admin";
  const amount = isCompany 
    ? (req.plan_type === "company_premium" ? "5000 DZD" : "3000 DZD")
    : "5000 DZD";

  return (
    <Card className="group border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isCompany ? "bg-[#639922]/10" : "bg-blue-500/10"
              }`}>
                {isCompany ? (
                  <Building2 className="h-5 w-5 text-[#639922]" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {req.profiles.first_name} {req.profiles.last_name}
                </h3>
                <p className="text-xs text-foreground/50">{req.profiles.email}</p>
              </div>
              <Badge variant="outline" className={isCompany ? "border-[#639922]/30 text-[#639922]" : "border-blue-500/30 text-blue-400"}>
                {isCompany ? "Company" : "Student"}
              </Badge>
              {isCompany && req.profiles.company_name && (
                <Badge variant="secondary" className="bg-white/5">{req.profiles.company_name}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-[#639922]" />
                <span className="text-foreground/70">
                  <strong className="text-[#639922]">Plan:</strong> {req.plan_type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground/70">
                  <strong className="text-[#639922]">Amount:</strong> {amount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-foreground/50" />
                <span className="text-foreground/70">
                  <strong className="text-[#639922]">Submitted:</strong> {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/30">Pending</Badge>
              </div>
            </div>

            {req.notes && (
              <div className="mt-2 rounded-lg border-l-2 border-[#639922]/30 bg-white/5 p-3">
                <p className="text-xs text-foreground/60 italic">“{req.notes}”</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReceipt(req)}
              className="border-white/20 text-foreground/70 hover:bg-white/10"
            >
              <Eye className="h-4 w-4 mr-1" /> Receipt
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(req.id)}
              disabled={isLoading === req.id}
              className="bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30"
            >
              {isLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve
            </Button>
            <Button
              size="sm"
              onClick={() => onReject(req.id)}
              disabled={isLoading === req.id}
              variant="destructive"
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              {isLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// User Account Row Component
const UserAccountRow = ({ account, actionLoading, onUpdatePlan, onViewReceipt }: any) => {
  const getPlanBadge = () => {
    if (account.plan_type === "premium") {
      return <Badge className="bg-[#639922]/20 text-[#639922] border-[#639922]/30"><Crown className="h-3 w-3 mr-1" /> Premium</Badge>;
    }
    if (account.plan_type === "basic") {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Zap className="h-3 w-3 mr-1" /> Basic</Badge>;
    }
    return <Badge variant="outline" className="text-gray-400">Free</Badge>;
  };

  const getStatusBadge = () => {
    if (account.plan_status === "active") {
      return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
    }
    if (account.plan_status === "pending") {
      return <Badge className="bg-amber-400/20 text-amber-400">Pending</Badge>;
    }
    if (account.plan_status === "rejected") {
      return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
    }
    if (account.plan_status === "expired") {
      return <Badge className="bg-orange-500/20 text-orange-400">Expired</Badge>;
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  const getPlanDisplayStatus = () => {
    if (account.plan_display_status === "expiring_soon") {
      return <Badge className="bg-amber-400/20 text-amber-400">Expiring Soon ({account.days_active}/30 days)</Badge>;
    }
    if (account.plan_display_status === "expired") {
      return <Badge className="bg-red-500/20 text-red-400">Expired ({account.days_active} days)</Badge>;
    }
    if (account.plan_display_status === "active" && account.days_active) {
      return <Badge className="bg-green-500/20 text-green-400">Active ({account.days_active}/30 days)</Badge>;
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-foreground">{account.first_name} {account.last_name}</h3>
            <Badge variant="outline" className={
              account.role === "company_admin" ? "border-[#639922]/30 text-[#639922]" : "border-blue-500/30 text-blue-400"
            }>
              {account.role === "company_admin" ? "Company" : "Student"}
            </Badge>
            {getPlanBadge()}
            {getStatusBadge()}
            {getPlanDisplayStatus()}
          </div>
          <p className="text-sm text-foreground/50">{account.email}</p>
          {account.company_name && <p className="text-xs text-foreground/40">{account.company_name}</p>}
          {account.university_name && <p className="text-xs text-foreground/40">{account.university_name}</p>}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReceipt(account.payment_requests?.[0])}
            disabled={!account.payment_requests?.length}
            className="border-white/20 text-foreground/70 hover:bg-white/10"
          >
            <FileText className="h-4 w-4 mr-1" /> Receipts
          </Button>
          <Select
            value={`${account.plan_type}|${account.plan_status}`}
            onValueChange={(val) => {
              const [planType, planStatus] = val.split('|');
              onUpdatePlan(account.id, planType, planStatus, `${account.first_name} ${account.last_name}`);
            }}
          >
            <SelectTrigger className="w-40 border-white/20 bg-white/5 text-sm">
              <SelectValue placeholder="Update plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free|inactive">Free (Inactive)</SelectItem>
              <SelectItem value="basic|active">Basic (Active)</SelectItem>
              <SelectItem value="premium|active">Premium (Active)</SelectItem>
              <SelectItem value="basic|pending">Basic (Pending)</SelectItem>
              <SelectItem value="premium|pending">Premium (Pending)</SelectItem>
              <SelectItem value="basic|expired">Basic (Expired)</SelectItem>
              <SelectItem value="premium|expired">Premium (Expired)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

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
    planTypeFilter,
    setPlanTypeFilter,
    planStatusFilter,
    setPlanStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    stats,
    updatePaymentStatus,
    updateUserPlan,
    refresh,
  } = usePlansManagement();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("payment_requests");

  const pendingRequests = accounts.flatMap(account => 
    account.payment_requests.filter(req => req.status === 'pending').map(req => ({
      ...req,
      profiles: {
        first_name: account.first_name,
        last_name: account.last_name,
        email: account.email,
        role: account.role,
        company_name: account.company_name,
        university_name: account.university_name,
      }
    }))
  );

  const companyRequests = pendingRequests.filter(req => req.profiles.role === "company_admin");
  const studentRequests = pendingRequests.filter(req => req.profiles.role === "student");

  const handleApprovePayment = async (paymentId: string) => {
    const request = pendingRequests.find(r => r.id === paymentId);
    if (request) {
      await updatePaymentStatus(paymentId, 'approved', request.user_id, `${request.profiles.first_name} ${request.profiles.last_name}`);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    const request = pendingRequests.find(r => r.id === paymentId);
    if (request) {
      await updatePaymentStatus(paymentId, 'rejected', request.user_id, `${request.profiles.first_name} ${request.profiles.last_name}`);
    }
  };

  const handleViewReceipt = (request: any) => {
    if (request?.receipt_url) {
      setPreviewUrl(request.receipt_url);
      setSelectedRequest(request);
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="relative min-h-screen bg-background">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
            </div>
            <div className="h-12 bg-white/5 rounded-xl" />
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#639922]/10 blur-3xl rounded-full" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plans & Payments</h1>
            <p className="text-sm text-foreground/40 mt-1">
              Manage user subscriptions and payment requests
            </p>
          </div>
          <Button
            onClick={refresh}
            disabled={loading}
            variant="outline"
            className="border-white/10 bg-white/5"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={Users} label="Active Users" value={stats.totalActiveUsers} color="bg-[#639922]/10 text-[#639922]" />
          <StatCard icon={Crown} label="Premium Users" value={stats.totalPremiumUsers} color="bg-amber-500/10 text-amber-500" />
          <StatCard icon={Wallet} label="Total Revenue" value={stats.totalRevenue} color="bg-green-500/10 text-green-500" subtitle="DZD" />
          <StatCard icon={Clock} label="Pending Payments" value={stats.pendingPayments} color="bg-amber-400/10 text-amber-400" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="payment_requests" className="data-[state=active]:bg-[#639922]/20 data-[state=active]:text-[#639922]">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active_users" className="data-[state=active]:bg-[#639922]/20 data-[state=active]:text-[#639922]">
              <Users className="h-4 w-4 mr-2" />
              Active Users ({accounts.filter(a => a.plan_status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="all_users" className="data-[state=active]:bg-[#639922]/20 data-[state=active]:text-[#639922]">
              <Crown className="h-4 w-4 mr-2" />
              All Subscribers ({totalAccounts})
            </TabsTrigger>
          </TabsList>

          {/* Payment Requests Tab */}
          <TabsContent value="payment_requests" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="company_admin">Companies</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-white/5 p-4">
                    <CreditCard className="h-12 w-12 text-foreground/30" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground/60">No pending payments</h3>
                <p className="text-sm text-foreground/40 mt-1">All payment requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <PaymentRequestCard
                    key={req.id}
                    req={req}
                    onApprove={handleApprovePayment}
                    onReject={handleRejectPayment}
                    onViewReceipt={handleViewReceipt}
                    isLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Users Tab */}
          <TabsContent value="active_users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="company_admin">Companies</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accounts.filter(a => a.plan_status === 'active').length === 0 ? (
              <div className="text-center py-12 text-foreground/40">No active users found.</div>
            ) : (
              <div className="space-y-3">
                {accounts.filter(a => a.plan_status === 'active').map(account => (
                  <UserAccountRow
                    key={account.id}
                    account={account}
                    actionLoading={actionLoading}
                    onUpdatePlan={updateUserPlan}
                    onViewReceipt={handleViewReceipt}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Users Tab */}
          <TabsContent value="all_users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="company_admin">Companies</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planStatusFilter} onValueChange={setPlanStatusFilter}>
                <SelectTrigger className="w-36 bg-white/5 border-white/10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-12 text-foreground/40">No users found.</div>
            ) : (
              <div className="space-y-3">
                {accounts.map(account => (
                  <UserAccountRow
                    key={account.id}
                    account={account}
                    actionLoading={actionLoading}
                    onUpdatePlan={updateUserPlan}
                    onViewReceipt={handleViewReceipt}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Receipt preview dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => {
        setPreviewUrl(null);
        setSelectedRequest(null);
      }}>
        <DialogContent className="max-w-3xl border-white/10 bg-[#0f1115] backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-white/90">Payment Receipt</DialogTitle>
            {selectedRequest && (
              <DialogDescription className="text-white/50">
                {selectedRequest.profiles?.first_name} {selectedRequest.profiles?.last_name} • 
                {selectedRequest.profiles?.role === "company_admin" ? " Company" : " Student"}
                {selectedRequest.profiles?.company_name && ` • ${selectedRequest.profiles.company_name}`}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="rounded-lg overflow-hidden">
            {previewUrl && (
              previewUrl.match(/\.(jpeg|jpg|png|gif)$/i) ?
                <img src={previewUrl} alt="Payment receipt" className="w-full rounded" /> :
                <iframe src={previewUrl} title="Receipt" className="w-full h-[70vh] rounded" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};