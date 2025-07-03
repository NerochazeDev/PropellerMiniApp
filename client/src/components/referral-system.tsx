import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Copy, 
  Share2, 
  Gift, 
  TrendingUp,
  Award,
  ExternalLink,
  Crown,
  Star
} from "lucide-react";
import { useState } from "react";

interface ReferralSystemProps {
  referralCode: string;
  totalReferrals: number;
  totalEarned: number;
  referralBonus: number;
  totalCommissions: number;
  commissionRate: number;
  recentReferrals: Array<{
    id: number;
    username: string;
    joinedAt: string;
    earned: number;
    totalEarnings: number;
    commissionsGenerated: number;
    isActive: boolean;
  }>;
}

export function ReferralSystem({ 
  referralCode = "USER123",
  totalReferrals = 0,
  totalEarned = 0,
  referralBonus = 5,
  totalCommissions = 0,
  commissionRate = 0.05,
  recentReferrals = []
}: ReferralSystemProps) {
  const [copied, setCopied] = useState(false);
  
  const referralLink = `https://t.me/propellerads_bot?start=${referralCode}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join PropellerAds and Earn Money!',
        text: `Join me on PropellerAds and start earning money by watching ads! Use my referral code: ${referralCode}`,
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  const getReferralTier = (count: number) => {
    if (count >= 100) return { tier: 'Diamond', color: 'text-purple-600', bonus: '25%' };
    if (count >= 50) return { tier: 'Gold', color: 'text-yellow-600', bonus: '20%' };
    if (count >= 25) return { tier: 'Silver', color: 'text-gray-600', bonus: '15%' };
    if (count >= 10) return { tier: 'Bronze', color: 'text-orange-600', bonus: '10%' };
    return { tier: 'Starter', color: 'text-blue-600', bonus: '5%' };
  };

  const currentTier = getReferralTier(totalReferrals);

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold">{totalReferrals}</div>
            <div className="text-white/80 text-sm">Total Referrals</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold">${totalEarned}</div>
            <div className="text-white/80 text-sm">Total Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">5% Commission System</h3>
            <p className="text-white/80 text-sm">Earn {(commissionRate * 100)}% from every ad your referrals watch</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
              <div className="text-white/80 text-xs">Lifetime Commissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${referralBonus}</div>
              <div className="text-white/80 text-xs">Signup Bonus</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tier */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className={`text-lg font-bold ${currentTier.color}`}>
                  {currentTier.tier} Tier
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  +{currentTier.bonus} bonus on referrals
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              ${referralBonus} per referral
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next tier</span>
              <span>{totalReferrals}/25</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalReferrals / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <span>Your Referral Link</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-gray-800"
            />
            <Button 
              onClick={handleCopy}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join PropellerAds and earn money!')}`)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Telegram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How Referrals Work */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>How Referrals Work</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              1
            </div>
            <div>
              <div className="font-semibold">Share your link</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Send your referral link to friends and family
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
              2
            </div>
            <div>
              <div className="font-semibold">They join and watch ads</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Your referrals start earning money by watching ads
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
              3
            </div>
            <div>
              <div className="font-semibold">You earn bonuses</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Get ${referralBonus} signup bonus + {(commissionRate * 100)}% commission from their ad earnings
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      {recentReferrals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Referrals</span>
              <Badge variant="secondary">{recentReferrals.length} this month</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReferrals.map((referral) => (
              <div 
                key={referral.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {referral.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center space-x-2">
                      <span>{referral.username}</span>
                      {referral.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Joined {referral.joinedAt}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+${referral.earned}</div>
                  <div className="text-xs text-gray-500">earned</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Referral Leaderboard */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Top Referrers This Month</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { rank: 1, username: "CryptoKing", referrals: 47, icon: Crown, color: "text-yellow-600" },
            { rank: 2, username: "AdMaster", referrals: 31, icon: Star, color: "text-gray-400" },
            { rank: 3, username: "EarnBot", referrals: 28, icon: Award, color: "text-orange-600" },
          ].map((user) => (
            <div 
              key={user.rank}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 ${user.color}`}>
                  <user.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">#{user.rank} {user.username}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.referrals} referrals
                  </div>
                </div>
              </div>
              <Badge variant="secondary">
                ${user.referrals * referralBonus}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}