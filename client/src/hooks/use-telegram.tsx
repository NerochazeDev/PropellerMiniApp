import { useEffect, useState } from "react";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  sendData: (data: string) => void;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  initData: string;
  initDataUnsafe: Record<string, any>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      
      // Initialize Telegram WebApp
      tgWebApp.ready();
      tgWebApp.expand();
      
      // Apply theme if dark mode
      if (tgWebApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      setIsReady(true);
    } else {
      // Running in browser mode
      console.log('Telegram WebApp not available - running in browser mode');
      setIsReady(true);
    }
  }, []);

  const sendData = (data: string) => {
    if (webApp) {
      webApp.sendData(data);
    } else {
      console.log('Would send to Telegram bot:', data);
    }
  };

  return {
    isReady,
    webApp,
    sendData,
    isInTelegram: !!webApp
  };
}
