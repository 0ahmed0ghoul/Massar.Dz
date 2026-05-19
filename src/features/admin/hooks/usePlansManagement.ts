// features/admin/hooks/usePlansManagement.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export interface PaymentRequest {
  id: string;
  user_id: string;
  plan_type: 'student_premium' | 'company_basic' | 'company_premium';
  amount: number;
  receipt_url: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PremiumAccount {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_premium: boolean;
  company_name?: string;
  university_name?: string;
  created_at: string;
  updated_at: string;
  payment_requests: PaymentRequest[];
  days_active?: number;
  plan_status?: 'active' | 'expiring_soon' | 'expired';
}

export function usePlansManagement() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PremiumAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<PremiumAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    totalPremiumUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0,
    activePlans: 0,
    expiringSoon: 0,
    expiredPlans: 0,
  });

  const handleError = (err: any, title = "Error") => {
    console.error(err);
    toast.error(err.message || title);
  };

  const calculateDaysActive = (approvedAt: string | null): { days: number; status: 'active' | 'expiring_soon' | 'expired' } => {
    if (!approvedAt) return { days: 0, status: 'expired' };
    
    const approvedDate = new Date(approvedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - approvedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 30) {
      return { days: diffDays, status: 'expired' };
    } else if (diffDays >= 25) {
      return { days: diffDays, status: 'expiring_soon' };
    }
    return { days: diffDays, status: 'active' };
  };

  const loadPremiumAccounts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch ALL users who have payment requests OR is_premium = true
      // This ensures rejected accounts still appear in the table
      const { data: paymentUsers, error: paymentUsersError } = await supabase
        .from('payment_requests')
        .select('user_id')
        .order('created_at', { ascending: false });

      if (paymentUsersError) throw paymentUsersError;

      // Get unique user IDs from payment requests
      const userIdsFromPayments = [...new Set(paymentUsers?.map(p => p.user_id) || [])];

      // Also get users who are premium but might not have payment requests
      const { data: premiumUsers, error: premiumUsersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_premium', true);

      if (premiumUsersError) throw premiumUsersError;

      // Combine unique user IDs
      const allUserIds = [...new Set([...userIdsFromPayments, ...(premiumUsers?.map(p => p.id) || [])])];

      if (allUserIds.length === 0) {
        setAccounts([]);
        setFilteredAccounts([]);
        setLoading(false);
        return;
      }

      // Fetch all profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          is_premium,
          company_name,
          university_name,
          created_at,
          updated_at
        `)
        .in('id', allUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch ALL payment requests for these users
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_requests')
        .select('*')
        .in('user_id', allUserIds)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Group payments by user_id
      const paymentsByUser = new Map<string, PaymentRequest[]>();
      payments?.forEach(payment => {
        if (!paymentsByUser.has(payment.user_id)) {
          paymentsByUser.set(payment.user_id, []);
        }
        paymentsByUser.get(payment.user_id)!.push(payment as PaymentRequest);
      });

      // Combine profiles with their payment requests and calculate days active
      const premiumAccounts: PremiumAccount[] = profiles.map(profile => {
        const userPayments = paymentsByUser.get(profile.id) || [];
        // Find the latest approved payment to calculate days active
        const latestApprovedPayment = userPayments.find(p => p.status === 'approved');
        const { days, status: planStatus } = calculateDaysActive(latestApprovedPayment?.approved_at || null);
        
        return {
          ...profile,
          payment_requests: userPayments,
          days_active: days,
          plan_status: planStatus,
        };
      });

      setAccounts(premiumAccounts);
      setFilteredAccounts(premiumAccounts);

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
      const approvedPayments = payments?.filter(p => p.status === 'approved').length || 0;
      const rejectedPayments = payments?.filter(p => p.status === 'rejected').length || 0;
      
      const activePlans = premiumAccounts.filter(a => a.plan_status === 'active').length;
      const expiringSoon = premiumAccounts.filter(a => a.plan_status === 'expiring_soon').length;
      const expiredPlans = premiumAccounts.filter(a => a.plan_status === 'expired').length;

      setStats({
        totalPremiumUsers: premiumAccounts.length,
        totalRevenue,
        pendingPayments,
        approvedPayments,
        rejectedPayments,
        activePlans,
        expiringSoon,
        expiredPlans,
      });

    } catch (error: any) {
      handleError(error, "Failed to load premium accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPremiumAccounts();
  }, [loadPremiumAccounts]);

  // Apply filters
  useEffect(() => {
    let filtered = [...accounts];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(account => {
        const fullName = `${account.first_name} ${account.last_name}`.toLowerCase();
        const orgName = (account.company_name || account.university_name || "").toLowerCase();
        return fullName.includes(searchLower) || 
               account.email.toLowerCase().includes(searchLower) ||
               orgName.includes(searchLower);
      });
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(account => account.role === roleFilter);
    }
    
    // Apply plan status filter (active/expiring/expired)
    if (statusFilter !== "all") {
      filtered = filtered.filter(account => account.plan_status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(account => {
        const latestPayment = account.payment_requests[0];
        if (paymentStatusFilter === 'pending') return latestPayment?.status === 'pending';
        if (paymentStatusFilter === 'approved') return latestPayment?.status === 'approved';
        if (paymentStatusFilter === 'rejected') return latestPayment?.status === 'rejected';
        return true;
      });
    }
    
    setFilteredAccounts(filtered);
  }, [search, roleFilter, statusFilter, paymentStatusFilter, accounts]);

  const updatePaymentStatus = async (paymentId: string, newStatus: 'approved' | 'rejected', userId: string, userName: string) => {
    setActionLoading(paymentId);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: newStatus,
          approved_by: user!.id,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update user's premium status based on payment status
      let isPremium = false;
      if (newStatus === 'approved') {
        // Check if there's any other approved payment for this user
        const { data: otherApprovedPayments } = await supabase
          .from('payment_requests')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'approved')
          .neq('id', paymentId);
        
        // User is premium if they have this approved payment OR other approved payments
        isPremium = true;
      }
      // If rejected, user loses premium status (unless they have other approved payments)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: isPremium,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success(`Payment ${newStatus} for ${userName}`);
      await loadPremiumAccounts();
    } catch (error: any) {
      handleError(error, `Failed to ${newStatus} payment`);
    } finally {
      setActionLoading(null);
    }
  };

  const revokePremium = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke premium status from ${userName}?`)) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Premium status revoked from ${userName}`);
      await loadPremiumAccounts();
    } catch (error: any) {
      handleError(error, "Failed to revoke premium status");
    } finally {
      setActionLoading(null);
    }
  };

  const restorePremium = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to restore premium status for ${userName}?`)) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Premium status restored for ${userName}`);
      await loadPremiumAccounts();
    } catch (error: any) {
      handleError(error, "Failed to restore premium status");
    } finally {
      setActionLoading(null);
    }
  };

  const refresh = () => {
    loadPremiumAccounts();
  };

  return {
    accounts: filteredAccounts,
    totalAccounts: accounts.length,
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
  };
}