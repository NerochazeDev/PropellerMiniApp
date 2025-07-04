# Database Setup Instructions for PropellerAds Telegram Mini App

## Issue
The direct PostgreSQL connection is failing due to hostname resolution issues. This means we need to create the database tables manually through the Supabase dashboard.

## Solution: Manual Table Creation

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (`ocipsgjulyyujyvzhqjd`)
3. Navigate to "SQL Editor" in the left sidebar

### Step 2: Create Tables
Copy and paste the following SQL commands in the SQL Editor and click "RUN":

```sql
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

-- Insert a test user (optional)
INSERT INTO users (username, telegram_id, total_rewards, ads_watched) 
VALUES ('test_user', '123456789', 0.005, 5) 
ON CONFLICT (username) DO NOTHING;
```

### Step 3: Verify Tables
After running the SQL commands, verify the tables were created:
1. Go to "Table Editor" in the left sidebar
2. You should see all 6 tables: `users`, `ad_views`, `withdrawals`, `referrals`, `commissions`, `achievements`

### Step 4: Test the App
Once tables are created, your PropellerAds Mini App will be fully functional with:
- Real database storage
- Monetag ad integration
- Reward tracking
- Withdrawal system
- Referral program
- Achievement system
- Playful micro-interactions and animations

## Why This Approach?
The app is configured to use Supabase API client for all database operations, which is more reliable than direct PostgreSQL connections. The tables just need to exist in the database - the app will handle all interactions through the Supabase client.

## Next Steps
After creating the tables, you can:
1. Test the ad buttons with real Monetag integration
2. See earnings recorded in the database
3. Experience all the micro-interactions and animations
4. Use the withdrawal system for USDT TRC20 payments