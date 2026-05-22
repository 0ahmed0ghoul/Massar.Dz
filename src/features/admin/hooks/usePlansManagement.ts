// features/admin/hooks/usePlansManagement.ts

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export type PlanType = 'free' | 'basic' | 'premium';
export type PlanStatus = 'inactive' | 'pending' | 'active' | 'rejected' | 'expired';
export type PaymentRequestStatus = 'pending' | 'approved' | 'rejected';
export type PaymentPlanType = 'student_premium' | 'company_basic' | 'company_premium';

export interface PaymentRequest {
  id: string;
  user_id: string;
  plan_type: PaymentPlanType;
  amount: number;
  receipt_url: string | null;
  notes: string | null;
  status: PaymentRequestStatus;
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
  plan_type: PlanType;
  plan_status: PlanStatus;
  company_name?: string;
  university_name?: string;
  created_at: string;
  updated_at: string;
  payment_requests: PaymentRequest[];
  days_active?: number;
  plan_display_status?: 'active' | 'expiring_soon' | 'expired';
}

interface PaymentStats {
  totalActiveUsers: number;
  totalPremiumUsers: number;
  totalBasicUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  activePlans: number;
  expiringSoon: number;
  expiredPlans: number;
}

export function usePlansManagement() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PremiumAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<PremiumAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [planTypeFilter, setPlanTypeFilter] = useState<string>("all");
  const [planStatusFilter, setPlanStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<PaymentStats>({
    totalActiveUsers: 0,
    totalPremiumUsers: 0,
    totalBasicUsers: 0,
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
      // Fetch ALL users who have payment requests OR have active plans (basic/premium)
      const { data: paymentUsers, error: paymentUsersError } = await supabase
        .from('payment_requests')
        .select('user_id')
        .order('created_at', { ascending: false });

      if (paymentUsersError) throw paymentUsersError;

      // Get unique user IDs from payment requests
      const userIdsFromPayments = [...new Set(paymentUsers?.map(p => p.user_id) || [])];

      // Also get users who have active plans (basic or premium) but might not have payment requests
      const { data: activePlanUsers, error: activePlanUsersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('plan_status', 'active')
        .in('plan_type', ['basic', 'premium']);

      if (activePlanUsersError) throw activePlanUsersError;

      // Combine unique user IDs
      const allUserIds = [...new Set([...userIdsFromPayments, ...(activePlanUsers?.map(p => p.id) || [])])];

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
          plan_type,
          plan_status,
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
        const { days, status: planDisplayStatus } = calculateDaysActive(latestApprovedPayment?.approved_at || null);
        
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role,
          plan_type: profile.plan_type || 'free',
          plan_status: profile.plan_status || 'inactive',
          company_name: profile.company_name,
          university_name: profile.university_name,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          payment_requests: userPayments,
          days_active: days,
          plan_display_status: planDisplayStatus,
        };
      });

      setAccounts(premiumAccounts);
      setFilteredAccounts(premiumAccounts);

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
      const approvedPayments = payments?.filter(p => p.status === 'approved').length || 0;
      const rejectedPayments = payments?.filter(p => p.status === 'rejected').length || 0;
      
      const totalActiveUsers = premiumAccounts.filter(a => a.plan_status === 'active').length;
      const totalPremiumUsers = premiumAccounts.filter(a => a.plan_type === 'premium' && a.plan_status === 'active').length;
      const totalBasicUsers = premiumAccounts.filter(a => a.plan_type === 'basic' && a.plan_status === 'active').length;
      
      const activePlans = premiumAccounts.filter(a => a.plan_display_status === 'active').length;
      const expiringSoon = premiumAccounts.filter(a => a.plan_display_status === 'expiring_soon').length;
      const expiredPlans = premiumAccounts.filter(a => a.plan_display_status === 'expired').length;

      setStats({
        totalActiveUsers,
        totalPremiumUsers,
        totalBasicUsers,
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
    
    // Apply plan type filter (basic/premium)
    if (planTypeFilter !== "all") {
      filtered = filtered.filter(account => account.plan_type === planTypeFilter);
    }
    
    // Apply plan status filter (active/pending/rejected/expired)
    if (planStatusFilter !== "all") {
      filtered = filtered.filter(account => account.plan_status === planStatusFilter);
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
  }, [search, roleFilter, planTypeFilter, planStatusFilter, paymentStatusFilter, accounts]);

  const updatePaymentStatus = async (paymentId: string, newStatus: 'approved' | 'rejected', userId: string, userName: string) => {
    setActionLoading(paymentId);
    try {
      // Get payment request details
      const { data: request, error: fetchError } = await supabase
        .from('payment_requests')
        .select('plan_type')
        .eq('id', paymentId)
        .single();

      if (fetchError) throw fetchError;

      // Update payment request status
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

      // Map payment plan type to profile plan_type
      let profilePlanType: PlanType = 'basic';
      if (request.plan_type === 'student_premium' || request.plan_type === 'company_premium') {
        profilePlanType = 'premium';
      } else if (request.plan_type === 'company_basic') {
        profilePlanType = 'basic';
      }

      // Update user's profile plan_type and plan_status based on payment status
      if (newStatus === 'approved') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            plan_type: profilePlanType,
            plan_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) throw updateError;
      } else {
        // If rejected, set plan_status to rejected
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            plan_status: 'rejected',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) throw updateError;
      }

      toast.success(`Payment ${newStatus} for ${userName}`);
      await loadPremiumAccounts();
    } catch (error: any) {
      handleError(error, `Failed to ${newStatus} payment`);
    } finally {
      setActionLoading(null);
    }
  };

  const updateUserPlan = async (userId: string, planType: PlanType, planStatus: PlanStatus, userName: string) => {
    if (!confirm(`Are you sure you want to update ${userName}'s plan to ${planType} (${planStatus})?`)) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_type: planType,
          plan_status: planStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Plan updated for ${userName}`);
      await loadPremiumAccounts();
    } catch (error: any) {
      handleError(error, "Failed to update plan");
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
  };
}