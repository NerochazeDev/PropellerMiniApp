import { Button } from "@/components/ui/button";
import { Play, Gift } from "lucide-react";

interface AdButtonProps {
  type: 'interstitial' | 'popup';
  onClick: () => void;
  disabled: boolean;
  className?: string;
}

export function AdButton({ type, onClick, disabled, className = "" }: AdButtonProps) {
  const isInterstitial = type === 'interstitial';
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isInterstitial 
          ? 'bg-telegram hover:bg-telegram-dark text-white' 
          : 'bg-white hover:bg-gray-50 text-telegram border-2 border-telegram'
      } ${className}`}
    >
      <div className="flex items-center justify-center space-x-3">
        {isInterstitial ? (
          <Play className="w-6 h-6" />
        ) : (
          <Gift className="w-6 h-6" />
        )}
        <div className="text-left">
          <div className="font-semibold">
            {isInterstitial ? 'Watch Ad (Interstitial)' : 'Watch Ad (Popup)'}
          </div>
          <div className={`text-sm ${isInterstitial ? 'text-blue-100' : 'text-telegram/70'}`}>
            {isInterstitial ? 'Full-screen ad with banner' : 'Direct redirect to offer'}
          </div>
        </div>
      </div>
    </Button>
  );
}
