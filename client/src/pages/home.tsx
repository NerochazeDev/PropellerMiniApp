import { useState, useEffect } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { useMonetag } from "@/hooks/use-monetag";
import { StatusCard } from "@/components/status-card";
import { AdButton } from "@/components/ad-button";
import { MessageCard } from "@/components/message-card";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { isReady, isInTelegram } = useTelegram();
  const { isLoading, showRewardedInterstitial, showRewardedPopup } = useMonetag();
  
  const [totalRewards, setTotalRewards] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
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
        setTotalRewards(prev => prev + 10);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-telegram rounded-full mb-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">PropellerAds</h1>
            <p className="text-gray-600 text-sm">Watch ads and earn rewards</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Status Card */}
        <StatusCard totalRewards={totalRewards} adsWatched={adsWatched} />

        {/* Ad Buttons Section */}
        <div className="space-y-4">
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
          show={isLoading}
        />

        <MessageCard
          type="success"
          title="Reward Granted!"
          message="You watched the ad successfully."
          show={showSuccess}
        />

        <MessageCard
          type="error"
          title="Ad Error"
          message="Failed to load ad. Please try again."
          show={showError}
        />

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose an ad format to watch</li>
              <li>• Complete the ad viewing process</li>
              <li>• Earn rewards automatically</li>
              <li>• Rewards are sent to your Telegram bot</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 py-6 text-center">
        <div className="text-xs text-gray-500 space-y-1">
          <p>Powered by PropellerAds & Monetag</p>
          <p>Zone ID: 9524219</p>
          {isInTelegram && <p>Running in Telegram WebApp</p>}
        </div>
      </footer>
    </div>
  );
}
