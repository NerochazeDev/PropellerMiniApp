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
    method: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
  }>;
}

export function WithdrawalSystem({ 
  balance, 
  minimumWithdrawal = 10,
  pendingWithdrawals = []
}: WithdrawalSystemProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canWithdraw = parseFloat(amount) >= minimumWithdrawal && parseFloat(amount) <= balance;

  const handleWithdrawal = async () => {
    if (!canWithdraw) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setAmount("");
    setMethod("");
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
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>PayPal</span>
                  </div>
                </SelectItem>
                <SelectItem value="crypto">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="w-4 h-4" />
                    <span>Cryptocurrency</span>
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleWithdrawal}
            disabled={!canWithdraw || !method || isSubmitting}
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

      {/* Payment Methods Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold">PayPal</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Instant transfer</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-semibold">Free</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Bitcoin className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold">Cryptocurrency</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">1-2 hours</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-semibold">Free</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">3-5 business days</div>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-semibold">$2 fee</div>
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
                      {withdrawal.method} • {withdrawal.requestedAt}
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