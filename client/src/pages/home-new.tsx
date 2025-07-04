import { useState, useEffect } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { useMonetag } from "@/hooks/use-monetag";
import { useHaptics } from "@/hooks/use-haptics";
import { StatusCard } from "@/components/status-card";
import { AdButton } from "@/components/ad-button";
import { MessageCard } from "@/components/message-card";
import { FloatingReward } from "@/components/floating-reward";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Star, Crown, Zap, TrendingUp, Wallet } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
  telegramId?: string;
  totalRewards: string;
  adsWatched: number;
  level: number;
  experience: number;
}

export default function Home() {
  const { isReady, isInTelegram, webApp } = useTelegram();
  const { isLoading, showRewardedInterstitial, showRewardedPopup } = useMonetag();
  const { buttonHaptic, rewardHaptic, successHaptic } = useHaptics();
  const queryClient = useQueryClient();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFloatingReward, setShowFloatingReward] = useState(false);
  const [lastReward, setLastReward] = useState(0);

  // User creation/fetching
  const createUserMutation = useMutation({
    mutationFn: async (userData: { username: string; password: string; telegramId?: string }): Promise<any> => {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  // Ad view recording mutation
  const recordAdViewMutation = useMutation({
    mutationFn: async ({ userId, adType, rewardAmount }: { userId: number; adType: string; rewardAmount: number }): Promise<any> => {
      const response = await fetch("/api/earnings/ad-view", {
        method: "POST",
        body: JSON.stringify({ userId, adType, rewardAmount }),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentUser(data.user);
      setShowSuccess(true);
      // Show floating reward animation with haptic feedback
      setLastReward(0.001); // Realistic reward amount
      setShowFloatingReward(true);
      rewardHaptic(); // Triple haptic for reward
      successHaptic(); // Success notification
      console.log("✅ Real Monetag earnings recorded:", data.adView);
    },
    onError: (error: any) => {
      console.error("Ad recording failed:", error);
      setErrorMessage(error.message || "Failed to record ad view");
      setShowError(true);
    },
  });

  // Initialize user on component mount
  useEffect(() => {
    if (isReady && webApp?.initDataUnsafe?.user) {
      const telegramUser = webApp.initDataUnsafe.user;
      const telegramId = telegramUser.id?.toString();
      const username = telegramUser.username || `user_${telegramId}`;
      
      createUserMutation.mutate({
        username,
        password: "telegram_user",
        telegramId,
      });
    }
  }, [isReady, webApp]);

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
    if (!currentUser) {
      setErrorMessage("User not initialized");
      setShowError(true);
      return;
    }

    // Trigger haptic feedback on button press
    buttonHaptic();
    
    setShowSuccess(false);
    setShowError(false);
    
    try {
      const result = type === 'interstitial' 
        ? await showRewardedInterstitial()
        : await showRewardedPopup();
      
      if (result.success) {
        // Generate realistic Monetag earnings ($0.001-$0.003)
        const rewardAmount = Math.random() * (0.003 - 0.001) + 0.001;
        const roundedReward = Math.round(rewardAmount * 1000) / 1000;
        
        // Record the ad view in database
        await recordAdViewMutation.mutateAsync({
          userId: currentUser.id,
          adType: type,
          rewardAmount: roundedReward,
        });
      } else {
        setErrorMessage("Ad failed to complete");
        setShowError(true);
      }
    } catch (error) {
      console.error('Ad click error:', error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
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
        <StatusCard 
          totalRewards={currentUser ? parseFloat(currentUser.totalRewards) : 0} 
          adsWatched={currentUser ? currentUser.adsWatched : 0} 
        />

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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 text-sm font-medium">Level</p>
              <p className="text-white text-2xl font-bold">{currentUser?.level || 1}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 text-sm font-medium">XP</p>
              <p className="text-white text-2xl font-bold">{currentUser?.experience || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-y-4">
          <Link href="/earnings">
            <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl border-0 shadow-2xl transform hover:scale-105 transition-all duration-200">
              <Wallet className="w-5 h-5 mr-3" />
              View Earnings Details
            </Button>
          </Link>
        </div>
      </main>

      {/* Message Cards */}
      <MessageCard
        type="success"
        title="Reward Earned!"
        message="Your Monetag earnings have been recorded and saved to the database."
        show={showSuccess}
      />
      
      <MessageCard
        type="error"
        title="Error"
        message={errorMessage}
        show={showError}
      />
      
      {/* Floating Reward Animation */}
      <FloatingReward
        show={showFloatingReward}
        amount={lastReward}
        onComplete={() => setShowFloatingReward(false)}
      />
    </div>
  );
}