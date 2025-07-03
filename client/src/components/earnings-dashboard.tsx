import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Users, 
  Award, 
  Wallet,
  ArrowUpRight,
  Target,
  Gift,
  Star
} from "lucide-react";
import { useState } from "react";

interface EarningsDashboardProps {
  totalRewards: number;
  adsWatched: number;
  level: number;
  experience: number;
  referrals: number;
  achievements: number;
}

export function EarningsDashboard({
  totalRewards,
  adsWatched,
  level,
  experience,
  referrals,
  achievements
}: EarningsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  const experienceToNextLevel = 100 - (experience % 100);
  const progressPercentage = (experience % 100);
  
  const dailyGoal = 10;
  const dailyProgress = Math.min(adsWatched, dailyGoal);
  
  return (
    <div className="space-y-6">
      {/* Main Earnings Card */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="text-center relative overflow-hidden">
            {/* Floating elements */}
            <div className="absolute top-2 right-4 w-6 h-6 bg-white/20 rounded-full animate-float"></div>
            <div className="absolute bottom-2 left-4 w-4 h-4 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-bounce-gentle">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Total Earnings</h2>
              <div className="text-5xl font-black mb-2">${totalRewards}</div>
              
              <div className="flex justify-center items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12% this week</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{adsWatched} ads</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg hover-lift">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{referrals}</div>
            <div className="text-white/80 text-sm">Referrals</div>
            <div className="text-xs text-white/60 mt-1">+$5 each</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg hover-lift">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{achievements}</div>
            <div className="text-white/80 text-sm">Achievements</div>
            <div className="text-xs text-white/60 mt-1">Bonus rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Level {level}</span>
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {experienceToNextLevel} XP to next level
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{experience % 100} XP</span>
              <span>100 XP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>Daily Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-purple-600">{dailyProgress}/{dailyGoal}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ads watched today</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">+$2.00</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bonus reward</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {dailyProgress >= dailyGoal && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">Daily goal completed! Bonus unlocked!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earning Methods */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Earning Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Watch Ads</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">$0.10 - $0.25 per ad</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">Refer Friends</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">$5.00 per referral</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">Complete Achievements</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">$1.00 - $10.00 bonus</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}