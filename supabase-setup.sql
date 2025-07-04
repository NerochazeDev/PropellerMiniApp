-- PropellerAds Telegram Mini App Database Schema
-- Run this in your Supabase Dashboard > SQL Editor

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

-- Enable Row Level Security (Optional - you can enable this later)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Insert a test user (optional)
-- INSERT INTO users (username, telegram_id, total_rewards, ads_watched) 
-- VALUES ('test_user', '123456789', 0.005, 5) 
-- ON CONFLICT (username) DO NOTHING;