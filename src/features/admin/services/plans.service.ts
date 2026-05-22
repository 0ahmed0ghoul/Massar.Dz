// features/admin/services/plans.service.ts

import { supabase } from "@/lib/supabaseClient";

// ============================================================================
// TYPES - Independent, not inheriting from base
// ============================================================================

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
  payment_requests: PaymentRequest[];
}

export interface PaymentStats {
  totalActiveUsers: number;      // Users with active plan (basic or premium)
  totalPremiumUsers: number;      // Users with premium plan
  totalBasicUsers: number;        // Users with basic plan
  totalRevenue: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  monthlyRevenue: {
    [month: string]: number;
  };
}

// ============================================================================
// SERVICE - Independent, no inheritance
// ============================================================================

class PlansService {
  private supabase = supabase;

  private handleError(error: any, methodName: string): void {
    console.error(`[PlansService.${methodName}] Error:`, error);
    throw error;
  }

  /**
   * Get all users with active plans (basic or premium)
   */
  async getActiveAccounts(): Promise<PremiumAccount[]> {
    try {
      const { data: profiles, error: profilesError } = await this.supabase
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
          university_name
        `)
        .eq('plan_status', 'active')
        .in('plan_type', ['basic', 'premium'])
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) return [];

      // Fetch payment requests for these users
      const userIds = profiles.map(p => p.id);
      const { data: payments, error: paymentsError } = await this.supabase
        .from('payment_requests')
        .select('*')
        .in('user_id', userIds)
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

      // Combine profiles with their payment requests
      const activeAccounts: PremiumAccount[] = profiles.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        role: profile.role,
        plan_type: profile.plan_type,
        plan_status: profile.plan_status,
        company_name: profile.company_name,
        university_name: profile.university_name,
        payment_requests: paymentsByUser.get(profile.id) || [],
      }));

      return activeAccounts;
    } catch (error) {
      this.handleError(error, "getActiveAccounts");
      return [];
    }
  }

  /**
   * Get premium accounts with filters (using plan_type and plan_status)
   */
  async getPremiumAccountsWithFilters(
    search: string = '',
    roleFilter: string = 'all',
    planTypeFilter: string = 'all'
  ): Promise<PremiumAccount[]> {
    try {
      let query = this.supabase
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
          university_name
        `)
        .eq('plan_status', 'active')
        .in('plan_type', ['basic', 'premium']);

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Apply plan type filter
      if (planTypeFilter !== 'all') {
        query = query.eq('plan_type', planTypeFilter);
      }

      // Apply search filter
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,university_name.ilike.%${search}%`
        );
      }

      const { data: profiles, error: profilesError } = await query
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) return [];

      const userIds = profiles.map(p => p.id);
      const { data: payments, error: paymentsError } = await this.supabase
        .from('payment_requests')
        .select('*')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      const paymentsByUser = new Map<string, PaymentRequest[]>();
      payments?.forEach(payment => {
        if (!paymentsByUser.has(payment.user_id)) {
          paymentsByUser.set(payment.user_id, []);
        }
        paymentsByUser.get(payment.user_id)!.push(payment as PaymentRequest);
      });

      return profiles.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        role: profile.role,
        plan_type: profile.plan_type,
        plan_status: profile.plan_status,
        company_name: profile.company_name,
        university_name: profile.university_name,
        payment_requests: paymentsByUser.get(profile.id) || [],
      }));
    } catch (error) {
      this.handleError(error, "getPremiumAccountsWithFilters");
      return [];
    }
  }

  /**
   * Get pending payment requests
   */
  async getPendingPaymentRequests(): Promise<PaymentRequest[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_requests')
        .select(`
          *,
          profiles!user_id (
            first_name,
            last_name,
            email,
            role,
            company_name,
            university_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error, "getPendingPaymentRequests");
      return [];
    }
  }

  /**
   * Approve a payment request and update user's plan
   */
  async approvePayment(requestId: string, adminId: string): Promise<boolean> {
    try {
      // Get payment request details
      const { data: request, error: fetchError } = await this.supabase
        .from('payment_requests')
        .select('user_id, plan_type')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Payment request not found');

      // Map payment plan type to profile plan_type
      let profilePlanType: PlanType = 'basic';
      if (request.plan_type === 'student_premium' || request.plan_type === 'company_premium') {
        profilePlanType = 'premium';
      } else if (request.plan_type === 'company_basic') {
        profilePlanType = 'basic';
      }

      // Update payment request status
      const { error: updateError } = await this.supabase
        .from('payment_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update user's profile with plan_type and plan_status
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({
          plan_type: profilePlanType,
          plan_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.user_id);

      if (profileError) throw profileError;

      // Log the action
      await this.supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'approve_payment',
        target_user_id: request.user_id,
        details: { plan_type: request.plan_type },
        created_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      this.handleError(error, "approvePayment");
      return false;
    }
  }

  /**
   * Reject a payment request
   */
  async rejectPayment(requestId: string, adminId: string): Promise<boolean> {
    try {
      // Get payment request details
      const { data: request, error: fetchError } = await this.supabase
        .from('payment_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Payment request not found');

      // Update payment request status
      const { error: updateError } = await this.supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          approved_by: adminId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update user's profile plan_status to rejected
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({
          plan_status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.user_id);

      if (profileError) throw profileError;

      // Log the action
      await this.supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'reject_payment',
        target_user_id: request.user_id,
        created_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      this.handleError(error, "rejectPayment");
      return false;
    }
  }

  /**
   * Update user's plan (admin override)
   */
  async updateUserPlan(
    userId: string,
    planType: PlanType,
    planStatus: PlanStatus,
    adminId: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({
          plan_type: planType,
          plan_status: planStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Log the action
      await this.supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'update_user_plan',
        target_user_id: userId,
        details: { plan_type: planType, plan_status: planStatus },
        created_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      this.handleError(error, "updateUserPlan");
      return false;
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      // Get active users count (basic or premium with active status)
      const { count: activeCount, error: activeError } = await this.supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('plan_status', 'active')
        .in('plan_type', ['basic', 'premium']);

      if (activeError) throw activeError;

      // Get premium users count
      const { count: premiumCount, error: premiumError } = await this.supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('plan_type', 'premium')
        .eq('plan_status', 'active');

      if (premiumError) throw premiumError;

      // Get basic users count
      const { count: basicCount, error: basicError } = await this.supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('plan_type', 'basic')
        .eq('plan_status', 'active');

      if (basicError) throw basicError;

      // Get payment stats
      const { data: payments, error: paymentsError } = await this.supabase
        .from('payment_requests')
        .select('status, amount, created_at');

      if (paymentsError) throw paymentsError;

      // Calculate monthly revenue
      const monthlyRevenue: { [month: string]: number } = {};
      payments?.forEach(payment => {
        if (payment.status === 'approved') {
          const date = new Date(payment.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (payment.amount || 0);
        }
      });

      const stats: PaymentStats = {
        totalActiveUsers: activeCount || 0,
        totalPremiumUsers: premiumCount || 0,
        totalBasicUsers: basicCount || 0,
        totalRevenue: payments?.reduce((sum, p) => sum + (p.status === 'approved' ? (p.amount || 0) : 0), 0) || 0,
        pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
        approvedPayments: payments?.filter(p => p.status === 'approved').length || 0,
        rejectedPayments: payments?.filter(p => p.status === 'rejected').length || 0,
        monthlyRevenue,
      };

      return stats;
    } catch (error) {
      this.handleError(error, "getPaymentStats");
      return {
        totalActiveUsers: 0,
        totalPremiumUsers: 0,
        totalBasicUsers: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        approvedPayments: 0,
        rejectedPayments: 0,
        monthlyRevenue: {},
      };
    }
  }

  /**
   * Get user's payment history
   */
  async getUserPaymentHistory(userId: string): Promise<PaymentRequest[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error, "getUserPaymentHistory");
      return [];
    }
  }

  /**
   * Create a payment request (for testing/admin purposes)
   */
  async createPaymentRequest(
    userId: string,
    planType: PaymentPlanType,
    amount: number,
    receiptUrl: string | null,
    notes?: string
  ): Promise<PaymentRequest | null> {
    try {
      const { data, error } = await this.supabase
        .from('payment_requests')
        .insert({
          user_id: userId,
          plan_type: planType,
          amount,
          receipt_url: receiptUrl,
          notes,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, "createPaymentRequest");
      return null;
    }
  }
}

export const plansService = new PlansService();