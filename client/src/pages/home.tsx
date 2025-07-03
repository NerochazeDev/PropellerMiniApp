import { useState, useEffect } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { useMonetag } from "@/hooks/use-monetag";
import { StatusCard } from "@/components/status-card";
import { AdButton } from "@/components/ad-button";
import { MessageCard } from "@/components/message-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Star, Crown, Zap, TrendingUp, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isReady, isInTelegram } = useTelegram();
  const { isLoading, showRewardedInterstitial, showRewardedPopup } = useMonetag();
  
  const [totalRewards, setTotalRewards] = useState(1.56);
  const [adsWatched, setAdsWatched] = useState(98);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleAdClick = async (type: 'interstitial' | 'popup') => {
    setShowSuccess(false);
    setShowError(false);
    
    try {
      const result = type === 'interstitial' 
        ? await showRewardedInterstitial()
        : await showRewardedPopup();
      
      if (result.success) {
        setTotalRewards(prev => prev + 0.003);
        setAdsWatched(prev => prev + 1);
        setShowSuccess(true);
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-6"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Rocket className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-white/80 text-lg font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-16 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <header className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-2xl animate-bounce-gentle">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse opacity-75"></div>
              <svg className="relative w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <div className="absolute -top-2 -right-2">
                <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2 animate-slide-up">
              PropellerAds
            </h1>
            <p className="text-white/70 text-lg font-medium animate-slide-up">
              Watch ads and earn rewards
            </p>
            
            <div className="flex justify-center items-center space-x-2 mt-3">
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-white/60 text-sm">Premium Ad Platform</span>
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-md mx-auto px-4 py-8">
        {/* Status Card */}
        <StatusCard totalRewards={totalRewards} adsWatched={adsWatched} />

        {/* Ad Buttons Section */}
        <div className="space-y-6">
          <AdButton
            type="interstitial"
            onClick={() => handleAdClick('interstitial')}
            disabled={isLoading}
          />
          
          <AdButton
            type="popup"
            onClick={() => handleAdClick('popup')}
            disabled={isLoading}
          />
        </div>

        {/* Message Cards */}
        <MessageCard
          type="loading"
          title="Loading ad..."
          message="Preparing your rewarded experience..."
          show={isLoading}
        />

        <MessageCard
          type="success"
          title="Reward Granted!"
          message="You watched the ad successfully and earned $0.003!"
          show={showSuccess}
        />

        <MessageCard
          type="error"
          title="Ad Error"
          message="Failed to load ad. Please try again."
          show={showError}
        />

        {/* Earnings Hub Button */}
        <Link href="/earnings">
          <Button className="w-full mt-6 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold text-lg shadow-2xl hover-lift">
            <div className="flex items-center justify-center space-x-3">
              <Wallet className="w-6 h-6" />
              <div className="text-center">
                <div>Earnings Hub</div>
                <div className="text-sm text-white/80">Manage withdrawals & referrals</div>
              </div>
              <TrendingUp className="w-6 h-6" />
            </div>
          </Button>
        </Link>

        {/* Advanced Instructions Card */}
        <Card className="mt-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h4 className="font-bold text-white text-lg">How it works:</h4>
            </div>
            <ul className="text-white/80 space-y-3">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Choose an ad format to watch</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Complete the ad viewing process</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Earn rewards automatically</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <span>Rewards are sent to your Telegram bot</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <span>Refer friends and earn 5% commission from their earnings</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="text-white/60 space-y-2">
            <p className="font-medium">Powered by PropellerAds & Monetag</p>
            <p className="text-sm">Zone ID: 9524219</p>
            {isInTelegram && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Running in Telegram WebApp</span>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
