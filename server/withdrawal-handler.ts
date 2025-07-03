import { Request, Response } from 'express';

export interface WithdrawalRequest {
  userId: number;
  amount: number;
  walletAddress: string;
  timestamp: Date;
}

export interface WithdrawalStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  failureReason?: string;
}

class WithdrawalProcessor {
  private pendingWithdrawals: Map<string, WithdrawalRequest> = new Map();
  
  async processWithdrawal(request: WithdrawalRequest): Promise<{ success: boolean, withdrawalId: string, message: string }> {
    // Validate wallet address (basic TRC20 validation)
    if (!this.isValidTRC20Address(request.walletAddress)) {
      return {
        success: false,
        withdrawalId: '',
        message: 'Invalid TRC20 wallet address'
      };
    }

    // Check minimum withdrawal amount
    if (request.amount < 1) {
      return {
        success: false,
        withdrawalId: '',
        message: 'Minimum withdrawal amount is $1'
      };
    }

    // Generate withdrawal ID
    const withdrawalId = `WD_${Date.now()}_${request.userId}`;
    
    // Store withdrawal request
    this.pendingWithdrawals.set(withdrawalId, request);

    // In production, you would:
    // 1. Integrate with crypto payment processor (like BitGo, Coinbase Commerce, etc.)
    // 2. Or implement manual processing workflow
    // 3. Send notification to admin dashboard
    // 4. Update user balance in database

    // For now, simulate successful request submission
    console.log(`New withdrawal request: ${withdrawalId}`, {
      userId: request.userId,
      amount: request.amount,
      walletAddress: request.walletAddress,
      timestamp: request.timestamp
    });

    return {
      success: true,
      withdrawalId,
      message: 'Withdrawal request submitted successfully. Processing time: 5-30 minutes.'
    };
  }

  private isValidTRC20Address(address: string): boolean {
    // TRC20 addresses start with 'T' and are 34 characters long
    const trc20Regex = /^T[A-Za-z0-9]{33}$/;
    return trc20Regex.test(address);
  }

  async getWithdrawalStatus(withdrawalId: string): Promise<WithdrawalStatus | null> {
    // In production, check actual withdrawal status from payment processor
    const request = this.pendingWithdrawals.get(withdrawalId);
    if (!request) return null;

    return {
      id: withdrawalId,
      status: 'pending',
      txHash: undefined,
      failureReason: undefined
    };
  }

  // Method to be called by admin or automated system to complete withdrawals
  async completeWithdrawal(withdrawalId: string, txHash: string): Promise<boolean> {
    const request = this.pendingWithdrawals.get(withdrawalId);
    if (!request) return false;

    // Update withdrawal status
    console.log(`Withdrawal completed: ${withdrawalId}`, { txHash });
    
    // In production:
    // 1. Update database with completion status
    // 2. Send notification to user
    // 3. Update user's withdrawal history
    
    return true;
  }
}

export const withdrawalProcessor = new WithdrawalProcessor();

// API endpoint handlers
export async function handleWithdrawalRequest(req: Request, res: Response) {
  try {
    const { userId, amount, walletAddress } = req.body;

    if (!userId || !amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, walletAddress'
      });
    }

    const result = await withdrawalProcessor.processWithdrawal({
      userId: parseInt(userId),
      amount: parseFloat(amount),
      walletAddress,
      timestamp: new Date()
    });

    res.json(result);
  } catch (error) {
    console.error('Withdrawal processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export async function handleWithdrawalStatus(req: Request, res: Response) {
  try {
    const { withdrawalId } = req.params;
    const status = await withdrawalProcessor.getWithdrawalStatus(withdrawalId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error('Withdrawal status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}