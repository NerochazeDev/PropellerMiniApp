import { useCallback, useState } from "react";
import { useTelegram } from "./use-telegram";

declare global {
  interface Window {
    show_9524219?: (type?: string) => Promise<void>;
  }
}

export function useMonetag() {
  const [isLoading, setIsLoading] = useState(false);
  const { sendData } = useTelegram();

  const showRewardedInterstitial = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (typeof window.show_9524219 === 'function') {
        await window.show_9524219();
      } else {
        // SDK not loaded - simulate for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Send reward data to Telegram bot
      sendData('reward_granted');
      return { success: true };
    } catch (error) {
      console.error('Rewarded Interstitial error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [sendData]);

  const showRewardedPopup = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (typeof window.show_9524219 === 'function') {
        await window.show_9524219('pop');
      } else {
        // SDK not loaded - simulate for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Send reward data to Telegram bot
      sendData('reward_granted');
      return { success: true };
    } catch (error) {
      console.error('Rewarded Popup error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [sendData]);

  return {
    isLoading,
    showRewardedInterstitial,
    showRewardedPopup
  };
}
