import { Button } from "@/components/ui/button";
import { Play, Gift, Zap, Target } from "lucide-react";
import { useState } from "react";

interface AdButtonProps {
  type: 'interstitial' | 'popup';
  onClick: () => void;
  disabled: boolean;
  className?: string;
}

export function AdButton({ type, onClick, disabled, className = "" }: AdButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const isInterstitial = type === 'interstitial';
  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };
  
  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 ${
        isInterstitial 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
      } animate-pulse-slow`}></div>
      
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={`relative w-full py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
          isInterstitial 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0'
        } ${className} ${isClicked ? 'animate-pulse' : ''}`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        
        <div className="relative flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${isInterstitial ? 'bg-white/20' : 'bg-white/20'} animate-bounce-gentle`}>
              {isInterstitial ? (
                <Play className="w-6 h-6 text-white" />
              ) : (
                <Gift className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">
                  {isInterstitial ? 'Interstitial Ad' : 'Popup Ad'}
                </span>
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
              <div className="text-sm text-white/80 font-medium">
                {isInterstitial ? 'Full-screen experience' : 'Quick redirect format'}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-bold text-yellow-300">+10</span>
            </div>
            <div className="text-xs text-white/70">rewards</div>
          </div>
        </div>
        
        {/* Loading dots when disabled */}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </Button>
    </div>
  );
}
