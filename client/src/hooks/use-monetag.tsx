import { useCallback, useState } from "react";
import { useTelegram } from "./use-telegram";

declare global {
  interface Window {
    show_9524219?: (type?: string | object) => Promise<void>;
  }
}

export function useMonetag() {
  const [isLoading, setIsLoading] = useState(false);
  const { sendData } = useTelegram();

  const showRewardedInterstitial = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (typeof window.show_9524219 === 'function') {
        // Rewarded Interstitial - exact implementation from Monetag docs
        await window.show_9524219().then(() => {
          // User reward function executed after user watches the ad
          console.log('Rewarded Interstitial: User has seen an ad!');
          sendData('reward_granted');
        });
        return { success: true };
      } else {
        // SDK not loaded - simulate for demo in browser mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Demo mode: Simulated Rewarded Interstitial ad view');
        sendData('reward_granted');
        return { success: true };
      }
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
        // Rewarded Popup - exact implementation from Monetag docs
        await window.show_9524219('pop').then(() => {
          // User watched ad till the end or closed it in interstitial format
          console.log('Rewarded Popup: User completed ad view');
          sendData('reward_granted');
        }).catch(e => {
          // User got error during playing ad
          console.error('Rewarded Popup error during ad play:', e);
          throw e;
        });
        return { success: true };
      } else {
        // SDK not loaded - simulate for demo in browser mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Demo mode: Simulated Rewarded Popup ad view');
        sendData('reward_granted');
        return { success: true };
      }
    } catch (error) {
      console.error('Rewarded Popup error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [sendData]);

  const showInAppInterstitial = useCallback(async () => {
    try {
      if (typeof window.show_9524219 === 'function') {
        // In-App Interstitial - automatic display according to timeframe settings
        await window.show_9524219({
          type: 'inApp',
          inAppSettings: {
            frequency: 2,        // show automatically 2 ads
            capping: 0.1,        // within 0.1 hours (6 minutes)
            interval: 30,        // with a 30-second interval between them
            timeout: 5,          // and a 5-second delay before the first one is shown
            everyPage: false     // session saved when navigating between pages
          }
        });
        console.log('In-App Interstitial: Automatic ad display activated');
        return { success: true };
      } else {
        console.log('Demo mode: In-App Interstitial would be automatically displayed');
        return { success: true };
      }
    } catch (error) {
      console.error('In-App Interstitial error:', error);
      return { success: false, error };
    }
  }, []);

  return {
    isLoading,
    showRewardedInterstitial,
    showRewardedPopup,
    showInAppInterstitial,
  };
}
