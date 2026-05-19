
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
  payment_requests: PaymentRequest[];
}

class PlansService extends BaseAdminService {
  async getPremiumAccounts(): Promise<PremiumAccount[]> {
    try {
      // Fetch all profiles with is_premium = true
      const { data: profiles, error: profilesError } = await this.supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          is_premium,
          company_name,
          university_name
        `)
        .eq('is_premium', true)
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
      const premiumAccounts: PremiumAccount[] = profiles.map(profile => ({
        ...profile,
        payment_requests: paymentsByUser.get(profile.id) || [],
      }));

      return premiumAccounts;
    } catch (error) {
      this.handleError(error, "getPremiumAccounts");
      return [];
    }
  }

  async getPremiumAccountsWithFilters(
    search: string = '',
    roleFilter: string = 'all'
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
          is_premium,
          company_name,
          university_name
        `)
        .eq('is_premium', true);

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
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
        ...profile,
        payment_requests: paymentsByUser.get(profile.id) || [],
      }));
    } catch (error) {
      this.handleError(error, "getPremiumAccountsWithFilters");
      return [];
    }
  }

  async revokePremium(userId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          is_premium: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Log the action (optional)
      await this.supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'revoke_premium',
        target_user_id: userId,
        created_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      this.handleError(error, "revokePremium");
      return false;
    }
  }

  async restorePremium(userId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      await this.supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'restore_premium',
        target_user_id: userId,
        created_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      this.handleError(error, "restorePremium");
      return false;
    }
  }

  async getPaymentStats(): Promise<{
    totalPremiumUsers: number;
    totalRevenue: number;
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number;
  }> {
    try {
      // Get premium users count
      const { count: premiumCount, error: countError } = await this.supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_premium', true);

      if (countError) throw countError;

      // Get payment stats
      const { data: payments, error: paymentsError } = await this.supabase
        .from('payment_requests')
        .select('status, amount');

      if (paymentsError) throw paymentsError;

      const stats = {
        totalPremiumUsers: premiumCount || 0,
        totalRevenue: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
        approvedPayments: payments?.filter(p => p.status === 'approved').length || 0,
        rejectedPayments: payments?.filter(p => p.status === 'rejected').length || 0,
      };

      return stats;
    } catch (error) {
      this.handleError(error, "getPaymentStats");
      return {
        totalPremiumUsers: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        approvedPayments: 0,
        rejectedPayments: 0,
      };
    }
  }
}

export const plansService = new PlansService();