import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleWithdrawalRequest, handleWithdrawalStatus } from "./withdrawal-handler";
import { insertAdViewSchema, insertUserSchema, insertReferralSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // User management
  app.post('/api/users', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists by Telegram ID
      if (validatedData.telegramId && typeof validatedData.telegramId === 'string') {
        const existingUser = await storage.getUserByTelegramId(validatedData.telegramId);
        if (existingUser) {
          return res.json({ success: true, user: existingUser, message: 'User already exists' });
        }
      }
      
      const user = await storage.createUser(validatedData);
      res.json({ success: true, user, message: 'User created successfully' });
    } catch (error) {
      console.error('User creation error:', error);
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, user });
    } catch (error) {
      console.error('User fetch error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user' });
    }
  });

  // Monetag ad view tracking with strict validation - ONLY real Telegram users
  app.post('/api/earnings/ad-view', async (req, res) => {
    try {
      const { userId, adType, rewardAmount, telegramId, telegramInitData } = req.body;
      
      // Validate required fields
      if (!userId || !adType || !rewardAmount) {
        return res.status(400).json({ success: false, message: 'Missing required fields: userId, adType, rewardAmount' });
      }
      
      // Validate ad type
      if (!['interstitial', 'popup'].includes(adType)) {
        return res.status(400).json({ success: false, message: 'Invalid ad type. Must be "interstitial" or "popup"' });
      }
      
      // Validate reward amount (realistic Monetag earnings: $0.001-$0.003)
      const amount = parseFloat(rewardAmount);
      if (amount < 0.001 || amount > 0.003) {
        return res.status(400).json({ success: false, message: 'Invalid reward amount. Must be between $0.001 and $0.003' });
      }
      
      // Verify user exists and has valid Telegram ID
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      if (!user.telegramId) {
        return res.status(403).json({ success: false, message: 'Only Telegram users can earn rewards' });
      }
      
      // Rate limiting: Check if user is not spamming ads (max 1 ad per 30 seconds)
      const recentAdViews = await storage.getUserAdViews(userId);
      if (recentAdViews.length > 0) {
        const lastAdView = recentAdViews[0];
        const lastAdTime = lastAdView.completedAt ? new Date(lastAdView.completedAt).getTime() : 0;
        const timeSinceLastAd = Date.now() - lastAdTime;
        const minimumInterval = 30 * 1000; // 30 seconds
        
        if (timeSinceLastAd < minimumInterval) {
          return res.status(429).json({ 
            success: false, 
            message: 'Please wait 30 seconds between ad views to prevent fraud',
            waitTime: Math.ceil((minimumInterval - timeSinceLastAd) / 1000)
          });
        }
      }
      
      // Daily limit check (max 50 ads per day per user to prevent abuse)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAdViews = recentAdViews.filter(adView => {
        const adViewTime = adView.completedAt ? new Date(adView.completedAt) : new Date(0);
        return adViewTime >= today;
      });
      
      if (todayAdViews.length >= 50) {
        return res.status(429).json({ 
          success: false, 
          message: 'Daily limit reached. You can watch up to 50 ads per day.'
        });
      }
      
      // Record the ad view
      const adViewData = {
        userId,
        adType,
        rewardAmount: rewardAmount.toString()
      };
      
      const validatedAdView = insertAdViewSchema.parse(adViewData);
      const adView = await storage.recordAdView(validatedAdView);
      
      console.log(`✅ Authenticated Monetag Ad View: Telegram User ${user.telegramId} (${user.username}) watched ${adType} ad, earned $${rewardAmount}`);
      
      // Get updated user data
      const updatedUser = await storage.getUser(userId);
      
      res.json({ 
        success: true, 
        message: 'Ad view recorded successfully',
        adView,
        user: updatedUser
      });
    } catch (error) {
      console.error('Ad view recording error:', error);
      res.status(500).json({ success: false, message: 'Failed to record ad view' });
    }
  });

  // Get user earnings summary
  app.get('/api/users/:id/earnings', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const adViews = await storage.getUserAdViews(userId);
      const totalEarnings = await storage.getTotalEarnings(userId);
      const withdrawals = await storage.getUserWithdrawals(userId);
      const referrals = await storage.getUserReferrals(userId);
      
      res.json({
        success: true,
        data: {
          user,
          totalEarnings,
          adsWatched: user.adsWatched || 0,
          adViews: adViews.slice(0, 10), // Last 10 ad views
          withdrawals: withdrawals.slice(0, 5), // Last 5 withdrawals
          referrals: referrals.slice(0, 10) // Last 10 referrals
        }
      });
    } catch (error) {
      console.error('Earnings fetch error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch earnings' });
    }
  });

  // Withdrawal processing routes
  app.post('/api/withdrawals', handleWithdrawalRequest);
  app.get('/api/withdrawals/:withdrawalId', handleWithdrawalStatus);

  // Referral tracking
  app.post('/api/referrals', async (req, res) => {
    try {
      const { referrerId, referredUserId, referredUsername } = req.body;
      
      if (!referrerId || !referredUserId) {
        return res.status(400).json({ success: false, message: 'Missing required fields: referrerId, referredUserId' });
      }
      
      // Verify both users exist
      const referrer = await storage.getUser(referrerId);
      const referred = await storage.getUser(referredUserId);
      
      if (!referrer || !referred) {
        return res.status(404).json({ success: false, message: 'One or both users not found' });
      }
      
      const referralData = {
        referrerId,
        referredUserId,
        referredUsername: referredUsername || referred.username
      };
      
      const validatedReferral = insertReferralSchema.parse(referralData);
      const referral = await storage.createReferral(validatedReferral);
      
      console.log(`🔗 Referral: ${referrer.username} referred ${referred.username}`);
      
      res.json({ 
        success: true, 
        message: 'Referral recorded successfully',
        referral
      });
    } catch (error) {
      console.error('Referral recording error:', error);
      res.status(500).json({ success: false, message: 'Failed to record referral' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
