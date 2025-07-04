import {
  type User,
  type InsertUser,
  type AdView,
  type InsertAdView,
  type Withdrawal,
  type InsertWithdrawal,
  type Referral,
  type InsertReferral,
  type Commission,
  type InsertCommission,
  type Achievement,
  type InsertAchievement,
} from "@shared/schema";
import { supabase } from "./db";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRewards(userId: number, amount: number): Promise<User>;
  
  // Ad view tracking
  recordAdView(adView: InsertAdView): Promise<AdView>;
  getUserAdViews(userId: number): Promise<AdView[]>;
  getTotalEarnings(userId: number): Promise<number>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getUserWithdrawals(userId: number): Promise<Withdrawal[]>;
  
  // Referral system
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  
  // Achievements
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: insertUser.username,
        telegram_id: insertUser.telegramId,
        total_rewards: insertUser.totalRewards || "0.000000",
        ads_watched: insertUser.adsWatched || 0,
        level: insertUser.level || 1,
        experience: insertUser.experience || 0,
        referral_code: insertUser.referralCode,
        referred_by: insertUser.referredBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  }

  async updateUserRewards(userId: number, amount: number): Promise<User> {
    const currentUser = await this.getUser(userId);
    const currentRewards = parseFloat(currentUser?.totalRewards || "0");
    const currentAdsWatched = currentUser?.adsWatched || 0;
    
    const { data, error } = await supabase
      .from('users')
      .update({
        total_rewards: String(currentRewards + amount),
        ads_watched: currentAdsWatched + 1,
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  }

  // Ad view tracking
  async recordAdView(adView: InsertAdView): Promise<AdView> {
    const { data, error } = await supabase
      .from('ad_views')
      .insert({
        user_id: adView.userId,
        ad_type: adView.adType,
        reward_amount: adView.rewardAmount,
        viewed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update user's total rewards and ads watched count
    await this.updateUserRewards(adView.userId, parseFloat(adView.rewardAmount));
    
    return data as AdView;
  }

  async getUserAdViews(userId: number): Promise<AdView[]> {
    const { data, error } = await supabase
      .from('ad_views')
      .select('*')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false });
    
    if (error) throw error;
    return data as AdView[];
  }

  async getTotalEarnings(userId: number): Promise<number> {
    const { data, error } = await supabase
      .from('ad_views')
      .select('reward_amount')
      .eq('user_id', userId);
    
    if (error) return 0;
    return data.reduce((sum, view) => sum + parseFloat(view.reward_amount), 0);
  }

  // Withdrawal operations
  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const { data, error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: withdrawal.userId,
        amount: withdrawal.amount,
        wallet_address: withdrawal.walletAddress,
        status: withdrawal.status || 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Withdrawal;
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });
    
    if (error) throw error;
    return data as Withdrawal[];
  }

  // Referral system
  async createReferral(referral: InsertReferral): Promise<Referral> {
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referral.referrerId,
        referred_id: referral.referredId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Referral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Referral[];
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const { data, error } = await supabase
      .from('commissions')
      .insert({
        referrer_id: commission.referrerId,
        referred_id: commission.referredId,
        amount: commission.amount,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Commission;
  }

  // Achievements
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: achievement.userId,
        achievement_type: achievement.achievementType,
        achieved_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
    
    if (error) throw error;
    return data as Achievement[];
  }
}

export const storage = new SupabaseStorage();