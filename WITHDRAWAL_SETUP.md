# Withdrawal Processing Setup Guide

## Overview
This guide explains how to process real USDT TRC20 withdrawals for your Telegram Mini App users.

## Current Implementation
The app currently includes a withdrawal processing system that:
- Validates TRC20 wallet addresses
- Enforces minimum withdrawal amounts ($1)
- Logs withdrawal requests for manual processing
- Provides withdrawal status tracking

## Production Setup Options

### Option 1: Manual Processing (Recommended for Start)
1. **Monitor Withdrawal Requests**
   - Check server logs for withdrawal requests
   - Each request includes: userId, amount, walletAddress, timestamp
   - Verify user has sufficient balance before processing

2. **Process Withdrawals**
   - Use your preferred crypto wallet or exchange
   - Send USDT TRC20 to user's wallet address
   - Keep transaction hash for records

3. **Update Status**
   - Call the completion endpoint with transaction hash
   - Notify user via Telegram bot about completion

### Option 2: Automated Processing (For Scale)
Integrate with crypto payment processors:

#### Recommended Services:
- **BitGo** - Enterprise crypto platform
- **Coinbase Commerce** - Easy integration
- **Binance Pay** - Good rates
- **NOWPayments** - Crypto payment gateway

#### Integration Steps:
1. Sign up for chosen service
2. Get API credentials
3. Update `withdrawal-handler.ts` with real API calls
4. Test with small amounts first

## Security Considerations

### Important Safety Measures:
1. **Daily Limits** - Set maximum daily withdrawal amounts
2. **KYC Requirements** - Consider identity verification for large amounts
3. **Fraud Detection** - Monitor for suspicious patterns
4. **Hot Wallet Security** - Use secure wallet management
5. **Backup Systems** - Always have manual override capability

### Recommended Limits:
- Minimum: $1 USDT
- Maximum per day: $100 USDT (adjust based on your revenue)
- Maximum per user per day: $50 USDT

## Revenue Tracking

### Your Monetag Earnings:
- Track total ad views from your users
- Monitor your Monetag dashboard revenue
- Ensure withdrawals don't exceed your earnings
- Keep 10-20% buffer for processing fees

### User Balance Management:
```javascript
// Example balance checking
const userBalance = await getUserBalance(userId);
const pendingWithdrawals = await getPendingWithdrawals(userId);
const availableBalance = userBalance - pendingWithdrawals;

if (withdrawalAmount > availableBalance) {
  return { success: false, message: 'Insufficient balance' };
}
```

## Telegram Bot Integration

### Withdrawal Notifications:
Send updates to users via your Telegram bot:
- Withdrawal request received
- Processing started
- Completion with transaction hash
- Any errors or rejections

### Example Bot Message:
```
💰 Withdrawal Update
Amount: $2.50 USDT
Status: Completed ✅
Transaction: abc123...xyz789
Network: TRON (TRC20)
Time: 5 minutes
```

## Testing Process

### Before Going Live:
1. Test with small amounts ($1-5)
2. Verify TRC20 addresses work correctly
3. Check transaction confirmations
4. Test error handling for invalid addresses
5. Monitor gas fees and processing times

### Test Wallet Addresses (TESTNET):
- Use TRON testnet for initial testing
- Get test TRX and test USDT
- Verify everything works before mainnet

## Support & Error Handling

### Common Issues:
1. **Invalid Address**: User entered wrong format
2. **Insufficient Balance**: User doesn't have enough funds
3. **Network Congestion**: Delays in processing
4. **Failed Transaction**: Network or wallet issues

### Support Process:
1. Log all withdrawal attempts
2. Keep transaction hashes for support
3. Have clear refund process
4. Provide user-friendly error messages

## Monitoring & Analytics

### Track These Metrics:
- Total withdrawal requests
- Average processing time
- Success/failure rates
- User satisfaction
- Revenue vs. withdrawals ratio

### Tools:
- Server logs for debugging
- Database for user tracking
- Telegram bot for notifications
- Analytics dashboard for insights

## Legal Considerations

### Important Notes:
- Check local regulations for crypto payments
- Consider tax implications
- Keep detailed records for compliance
- Have clear terms of service
- Consider user agreements

## Getting Started Checklist

- [ ] Set up withdrawal monitoring system
- [ ] Create secure wallet for payments
- [ ] Test with small amounts
- [ ] Set up user notifications
- [ ] Implement daily limits
- [ ] Create support process
- [ ] Document all procedures
- [ ] Train support team
- [ ] Launch with beta users
- [ ] Monitor and optimize

## Support Contact
For technical issues with the withdrawal system, check:
1. Server logs for error messages
2. TRC20 network status
3. User wallet address validity
4. Your Monetag account balance