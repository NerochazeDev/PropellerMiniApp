import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wallet, 
  CreditCard, 
  Bitcoin, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowDownToLine,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

interface WithdrawalSystemProps {
  balance: number;
  minimumWithdrawal: number;
  pendingWithdrawals: Array<{
    id: number;
    amount: number;
    walletAddress: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
  }>;
}

export function WithdrawalSystem({ 
  balance, 
  minimumWithdrawal = 1,
  pendingWithdrawals = []
}: WithdrawalSystemProps) {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canWithdraw = parseFloat(amount) >= minimumWithdrawal && parseFloat(amount) <= balance && walletAddress.length > 0;

  const handleWithdrawal = async () => {
    if (!canWithdraw) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setAmount("");
    setWalletAddress("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Available Balance</h3>
          <div className="text-4xl font-black">${balance.toFixed(2)}</div>
          <div className="text-white/80 text-sm mt-2">
            Minimum withdrawal: ${minimumWithdrawal}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowDownToLine className="w-5 h-5 text-blue-600" />
            <span>Request Withdrawal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Minimum $${minimumWithdrawal}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
            />
            {amount && parseFloat(amount) < minimumWithdrawal && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Minimum withdrawal amount is ${minimumWithdrawal}</span>
              </div>
            )}
            {amount && parseFloat(amount) > balance && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Amount exceeds available balance</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">USDT TRC20 Wallet Address</Label>
            <Input
              id="wallet"
              type="text"
              placeholder="Enter your USDT TRC20 wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm"
            />
            {walletAddress && walletAddress.length < 34 && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Please enter a valid TRC20 wallet address</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleWithdrawal}
            disabled={!canWithdraw || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Request Withdrawal`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* USDT TRC20 Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bitcoin className="w-5 h-5 text-green-600" />
            <span>USDT TRC20 Withdrawals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-green-800 dark:text-green-200">USDT TRC20 Only</div>
                <div className="text-sm text-green-600 dark:text-green-400">Fast & secure crypto withdrawals</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network:</span>
                <span className="font-semibold">TRON (TRC20)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Processing time:</span>
                <span className="font-semibold">5-30 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network fee:</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Minimum withdrawal:</span>
                <span className="font-semibold">${minimumWithdrawal}</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <div className="font-semibold mb-1">Important:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Only send to TRC20 USDT addresses</li>
                  <li>• Double-check your wallet address</li>
                  <li>• Transactions are irreversible</li>
                  <li>• Contact support if you need help</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      {pendingWithdrawals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingWithdrawals.map((withdrawal) => (
              <div 
                key={withdrawal.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(withdrawal.status)}
                  <div>
                    <div className="font-semibold">${withdrawal.amount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {withdrawal.walletAddress.slice(0, 6)}...{withdrawal.walletAddress.slice(-4)} • {withdrawal.requestedAt}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(withdrawal.status)}>
                  {withdrawal.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}