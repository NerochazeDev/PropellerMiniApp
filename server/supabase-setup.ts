import { supabase } from './db.js';

// Create tables using Supabase API
export async function setupSupabaseTables() {
  console.log('Setting up Supabase tables...');
  
  try {
    // Create users table
    const usersTable = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });
    
    // Create ad_views table
    const adViewsTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS ad_views (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          ad_type TEXT NOT NULL,
          reward_amount DECIMAL(10, 6) NOT NULL,
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    // Create withdrawals table
    const withdrawalsTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS withdrawals (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 6) NOT NULL,
          wallet_address TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          processed_at TIMESTAMP
        );
      `
    });
    
    // Create referrals table
    const referralsTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS referrals (
          id SERIAL PRIMARY KEY,
          referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(referrer_id, referred_id)
        );
      `
    });
    
    // Create commissions table
    const commissionsTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS commissions (
          id SERIAL PRIMARY KEY,
          referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 6) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    // Create achievements table
    const achievementsTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS achievements (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          achievement_type TEXT NOT NULL,
          achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    // Enable real-time for all tables
    await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE users REPLICA IDENTITY FULL;
        ALTER TABLE ad_views REPLICA IDENTITY FULL;
        ALTER TABLE withdrawals REPLICA IDENTITY FULL;
        ALTER TABLE referrals REPLICA IDENTITY FULL;
        ALTER TABLE commissions REPLICA IDENTITY FULL;
        ALTER TABLE achievements REPLICA IDENTITY FULL;
      `
    });
    
    console.log('✅ Supabase tables created successfully');
    console.log('✅ Real-time replication enabled');
    
  } catch (error) {
    console.error('❌ Error setting up Supabase tables:', error);
    throw error;
  }
}

// Setup real-time subscriptions
export function setupRealtimeSubscriptions() {
  console.log('Setting up real-time subscriptions...');
  
  // Listen to user updates
  const usersSubscription = supabase
    .channel('users-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      (payload) => {
        console.log('User update:', payload);
      }
    )
    .subscribe();
  
  // Listen to ad view updates
  const adViewsSubscription = supabase
    .channel('ad-views-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ad_views' },
      (payload) => {
        console.log('Ad view update:', payload);
      }
    )
    .subscribe();
  
  // Listen to withdrawal updates
  const withdrawalsSubscription = supabase
    .channel('withdrawals-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'withdrawals' },
      (payload) => {
        console.log('Withdrawal update:', payload);
      }
    )
    .subscribe();
  
  console.log('✅ Real-time subscriptions active');
  
  return {
    usersSubscription,
    adViewsSubscription,
    withdrawalsSubscription
  };
}