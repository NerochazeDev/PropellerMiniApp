import {
  users,
  adViews,
  withdrawals,
  referrals,
  commissions,
  achievements,
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
import { db } from "./db";
import { eq, desc, sum } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserRewards(userId: number, amount: number): Promise<User> {
    const currentUser = await this.getUser(userId);
    const currentRewards = parseFloat(currentUser?.totalRewards || "0");
    const currentAdsWatched = currentUser?.adsWatched || 0;
    
    const [user] = await db
      .update(users)
      .set({
        totalRewards: String(currentRewards + amount),
        adsWatched: currentAdsWatched + 1,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Ad view tracking
  async recordAdView(adView: InsertAdView): Promise<AdView> {
    const [recordedView] = await db
      .insert(adViews)
      .values(adView)
      .returning();
    
    // Update user's total rewards and ads watched count
    await this.updateUserRewards(adView.userId, parseFloat(adView.rewardAmount));
    
    return recordedView;
  }

  async getUserAdViews(userId: number): Promise<AdView[]> {
    return await db
      .select()
      .from(adViews)
      .where(eq(adViews.userId, userId))
      .orderBy(desc(adViews.completedAt));
  }

  async getTotalEarnings(userId: number): Promise<number> {
    const result = await db
      .select({ total: sum(adViews.rewardAmount) })
      .from(adViews)
      .where(eq(adViews.userId, userId));
    
    return parseFloat(result[0]?.total || "0");
  }

  // Withdrawal operations
  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [created] = await db
      .insert(withdrawals)
      .values(withdrawal)
      .returning();
    return created;
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, userId))
      .orderBy(desc(withdrawals.requestedAt));
  }

  // Referral system
  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [created] = await db
      .insert(referrals)
      .values(referral)
      .returning();
    return created;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [created] = await db
      .insert(commissions)
      .values(commission)
      .returning();
    return created;
  }

  // Achievements
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return created;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }
}

export const storage = new DatabaseStorage();
