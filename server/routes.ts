import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleWithdrawalRequest, handleWithdrawalStatus } from "./withdrawal-handler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve admin dashboard
  app.get('/admin', (req, res) => {
    res.sendFile('admin-dashboard.html', { root: '.' });
  });

  // Withdrawal processing routes
  app.post('/api/withdrawals', handleWithdrawalRequest);
  app.get('/api/withdrawals/:withdrawalId', handleWithdrawalStatus);

  // User earnings tracking
  app.post('/api/earnings/ad-view', (req, res) => {
    const { userId, amount } = req.body;
    console.log(`Ad view recorded for user ${userId}, earned $${amount}`);
    res.json({ success: true, message: 'Ad view recorded' });
  });

  // Referral tracking
  app.post('/api/referrals', (req, res) => {
    const { referrerUserId, referredUserId } = req.body;
    console.log(`Referral: ${referrerUserId} referred ${referredUserId}`);
    res.json({ success: true, message: 'Referral recorded' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
