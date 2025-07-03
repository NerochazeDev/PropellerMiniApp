import { useState } from "react";
import { EarningsDashboard } from "@/components/earnings-dashboard";
import { WithdrawalSystem } from "@/components/withdrawal-system";
import { ReferralSystem } from "@/components/referral-system";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  ArrowLeft,
  BarChart3,
  History
} from "lucide-react";
import { Link } from "wouter";

export default function Earnings() {
  // Mock data - in real app this would come from API
  const [userStats] = useState({
    totalRewards: 145.50,
    adsWatched: 87,
    level: 3,
    experience: 240,
    referrals: 12,
    achievements: 8,
    referralCode: "USER12345",
    totalEarned: 75.50,
    referralBonus: 5
  });

  const [withdrawals] = useState([
    {
      id: 1,
      amount: 25.00,
      method: "PayPal",
      status: "approved" as const,
      requestedAt: "Jan 15, 2025"
    },
    {
      id: 2,
      amount: 50.00,
      method: "Crypto",
      status: "pending" as const,
      requestedAt: "Jan 20, 2025"
    }
  ]);

  const [recentReferrals] = useState([
    {
      id: 1,
      username: "alice_crypto",
      joinedAt: "2 days ago",
      earned: 5.00,
      totalEarnings: 45.80,
      commissionsGenerated: 2.29,
      isActive: true
    },
    {
      id: 2,
      username: "bob_trader",
      joinedAt: "1 week ago", 
      earned: 15.50,
      totalEarnings: 127.40,
      commissionsGenerated: 6.37,
      isActive: false
    },
    {
      id: 3,
      username: "charlie_earner",
      joinedAt: "2 weeks ago",
      earned: 25.00,
      totalEarnings: 89.60,
      commissionsGenerated: 4.48,
      isActive: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-16 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Earnings Hub</h1>
              <p className="text-white/70 text-sm">Manage your rewards & earnings</p>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border border-white/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger 
              value="referrals"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              <Users className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EarningsDashboard
              totalRewards={userStats.totalRewards}
              adsWatched={userStats.adsWatched}
              level={userStats.level}
              experience={userStats.experience}
              referrals={userStats.referrals}
              achievements={userStats.achievements}
            />
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <WithdrawalSystem
              balance={userStats.totalRewards}
              minimumWithdrawal={10}
              pendingWithdrawals={withdrawals}
            />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <ReferralSystem
              referralCode={userStats.referralCode}
              totalReferrals={userStats.referrals}
              totalEarned={userStats.totalEarned}
              referralBonus={userStats.referralBonus}
              totalCommissions={13.14}
              commissionRate={0.05}
              recentReferrals={recentReferrals}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        <Card className="mt-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">${userStats.totalRewards}</div>
                <div className="text-white/70 text-xs">Total Balance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userStats.adsWatched}</div>
                <div className="text-white/70 text-xs">Ads Watched</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userStats.referrals}</div>
                <div className="text-white/70 text-xs">Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}