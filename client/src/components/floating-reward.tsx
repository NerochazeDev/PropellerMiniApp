import { useEffect, useState } from "react";
import { Coins, Star, Heart, Gift } from "lucide-react";

interface FloatingRewardProps {
  show: boolean;
  amount: number;
  onComplete: () => void;
}

export function FloatingReward({ show, amount, onComplete }: FloatingRewardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; icon: string }[]>([]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Create floating particles
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100, // Random position from -100 to 100
        y: Math.random() * 150 - 75,  // Random position from -75 to 75
        icon: ['coin', 'star', 'heart', 'gift'][Math.floor(Math.random() * 4)]
      }));
      
      setParticles(newParticles);
      
      // Auto hide after animation
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2500);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'coin':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'star':
        return <Star className="w-4 h-4 text-purple-400" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'gift':
        return <Gift className="w-4 h-4 text-green-400" />;
      default:
        return <Coins className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {/* Main reward display */}
      <div className="relative">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl animate-tada">
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 animate-coin-flip" />
            <span className="text-lg font-bold">+${amount.toFixed(3)}</span>
          </div>
        </div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-float-up"
            style={{
              left: particle.x + 'px',
              top: particle.y + 'px',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: '2s'
            }}
          >
            <div className="animate-spin">
              {getIcon(particle.icon)}
            </div>
          </div>
        ))}
        
        {/* Expanding ring effect */}
        <div className="absolute inset-0 rounded-full border-4 border-green-400 opacity-30 animate-ping scale-150"></div>
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-50 animate-ping scale-200" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}