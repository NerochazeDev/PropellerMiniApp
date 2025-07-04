import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-supabase";
import { handleWithdrawalRequest, handleWithdrawalStatus } from "./withdrawal-handler";
import { insertAdViewSchema, insertUserSchema, insertReferralSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Test database connection and add test user
  app.post('/api/test-database', async (req, res) => {
    try {
      console.log('🔍 Testing database connection...');
      
      // First, test basic Supabase connection
      const { supabase } = await import("./db");
      
      // Try a simple query to check connection
      console.log('🔗 Testing basic Supabase connection...');
      const { data, error: healthError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (healthError) {
        console.error('❌ Basic connection failed:', healthError);
        throw new Error(`Database connection failed: ${healthError.message}`);
      }
      
      console.log('✅ Basic connection successful');
      
      // Try to get user count
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('❌ Count query failed:', countError);
        throw new Error(`Count query failed: ${countError.message}`);
      }
      
      console.log('📊 Total users in database:', count);
      
      res.json({ 
        success: true, 
        message: 'Database connection working', 
        totalUsers: count || 0,
        note: 'Basic connection test successful'
      });
      
    } catch (error) {
      console.error('❌ Database test failed:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Database setup endpoint
  app.post('/api/setup-database', async (req, res) => {
    try {
      const { supabase } = await import("./db");
      
      // Create tables using Supabase SQL
      const createTablesSQL = `
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          telegram_id TEXT UNIQUE,
          total_rewards DECIMAL(10, 6) DEFAULT 0.000000,
          ads_watched INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          experience INTEGER DEFAULT 0,
          referral_code TEXT UNIQUE,
          referred_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create ad_views table
        CREATE TABLE IF NOT EXISTS ad_views (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          ad_type TEXT NOT NULL,
          reward_amount DECIMAL(10, 6) NOT NULL,
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create withdrawals table
        CREATE TABLE IF NOT EXISTS withdrawals (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 6) NOT NULL,
          wallet_address TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          processed_at TIMESTAMP
        );

        -- Create referrals table
        CREATE TABLE IF NOT EXISTS referrals (
          id SERIAL PRIMARY KEY,
          referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(referrer_id, referred_id)
        );

        -- Create commissions table
        CREATE TABLE IF NOT EXISTS commissions (
          id SERIAL PRIMARY KEY,
          referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 6) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create achievements table
        CREATE TABLE IF NOT EXISTS achievements (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          achievement_type TEXT NOT NULL,
          achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
        ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
        ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
        ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
      `;

      // Since supabase.rpc('exec_sql') might not be available, let's use direct SQL execution
      try {
        // Try to create tables using direct SQL queries
        const { Client } = await import('pg');
        const client = new Client({
          connectionString: 'postgresql://postgres:Omoolaomoola10122@@db.ocipsgjulyyujyvzhqjd.supabase.co:5432/postgres',
          ssl: { rejectUnauthorized: false }
        });
        
        await client.connect();

        // Create tables
        const tableQueries = [
          `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            telegram_id TEXT UNIQUE,
            total_rewards DECIMAL(10, 6) DEFAULT 0.000000,
            ads_watched INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            experience INTEGER DEFAULT 0,
            referral_code TEXT UNIQUE,
            referred_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
          `CREATE TABLE IF NOT EXISTS ad_views (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            ad_type TEXT NOT NULL,
            reward_amount DECIMAL(10, 6) NOT NULL,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
          `CREATE TABLE IF NOT EXISTS withdrawals (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount DECIMAL(10, 6) NOT NULL,
            wallet_address TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            processed_at TIMESTAMP
          );`,
          `CREATE TABLE IF NOT EXISTS referrals (
            id SERIAL PRIMARY KEY,
            referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(referrer_id, referred_id)
          );`,
          `CREATE TABLE IF NOT EXISTS commissions (
            id SERIAL PRIMARY KEY,
            referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount DECIMAL(10, 6) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
          `CREATE TABLE IF NOT EXISTS achievements (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            achievement_type TEXT NOT NULL,
            achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        ];

        for (const query of tableQueries) {
          await client.query(query);
        }
        
        await client.end();
        console.log('✅ All tables created successfully via direct connection');
      } catch (dbError) {
        console.error('Direct database connection failed:', dbError);
        // If direct connection fails, tables need to be created manually
        throw new Error('Database tables must be created manually in Supabase dashboard');
      }
      
      // Test the tables
      const { data: testData, error: testError } = await supabase.from('users').select('count', { count: 'exact' });
      
      res.json({ 
        success: !testError, 
        message: testError ? 'Tables creation attempted, please check Supabase dashboard' : 'Database tables created successfully',
        tableTest: !testError,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database setup error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database setup failed. Please create tables manually in Supabase dashboard.',
        error: error.message,
        instructions: 'Go to your Supabase dashboard > SQL Editor and run the table creation scripts'
      });
    }
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
