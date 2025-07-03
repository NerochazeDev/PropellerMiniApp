import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface StatusCardProps {
  totalRewards: number;
  adsWatched: number;
}

export function StatusCard({ totalRewards, adsWatched }: StatusCardProps) {
  const [animateReward, setAnimateReward] = useState(false);
  const [prevRewards, setPrevRewards] = useState(totalRewards);

  useEffect(() => {
    if (totalRewards > prevRewards) {
      setAnimateReward(true);
      setTimeout(() => setAnimateReward(false), 1000);
    }
    setPrevRewards(totalRewards);
  }, [totalRewards, prevRewards]);

  return (
    <Card className="shadow-lg border-0 mb-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 hover-lift animate-scale-in">
      <CardContent className="p-6">
        <div className="text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>
          
          {/* Floating coins animation */}
          <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg animate-bounce-gentle">
              <DollarSign className={`w-8 h-8 text-white ${animateReward ? 'coin-spin' : ''}`} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-up">
              Total Rewards
            </h3>
            
            <div className="relative">
              <p className={`text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${animateReward ? 'animate-pulse' : ''}`}>
                {totalRewards}
              </p>
              {animateReward && (
                <div className="absolute -top-2 -right-2 text-green-500 font-bold animate-bounce text-lg">
                  +10
                </div>
              )}
            </div>
            
            <div className="flex justify-center items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 shadow-sm">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {adsWatched}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  +{adsWatched * 10}
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 animate-pulse-slow">
              🎯 Keep watching ads to earn more rewards!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
