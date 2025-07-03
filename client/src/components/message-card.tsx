import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Info, Sparkles, Gift } from "lucide-react";
import { useEffect, useState } from "react";

interface MessageCardProps {
  type: 'loading' | 'success' | 'error' | 'info';
  title?: string;
  message?: string;
  show: boolean;
}

export function MessageCard({ type, title, message, show }: MessageCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  if (!show && !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className="w-7 h-7 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-7 h-7 text-green-600 animate-bounce" />;
      case 'error':
        return <XCircle className="w-7 h-7 text-red-600 animate-pulse" />;
      case 'info':
        return <Info className="w-7 h-7 text-blue-600 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'loading':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg';
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-lg';
      default:
        return 'bg-white border-gray-100 shadow-lg';
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-900 font-bold';
      case 'error':
        return 'text-red-900 font-bold';
      case 'info':
        return 'text-blue-900 font-bold';
      case 'loading':
        return 'text-blue-900 font-bold';
      default:
        return 'text-gray-900 font-bold';
    }
  };

  const getSubTextStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-700 font-medium';
      case 'error':
        return 'text-red-700 font-medium';
      case 'info':
        return 'text-blue-700 font-medium';
      case 'loading':
        return 'text-blue-700 font-medium';
      default:
        return 'text-gray-700 font-medium';
    }
  };

  const getAnimationClass = () => {
    if (!show) return 'opacity-0 scale-95 translate-y-2';
    return 'opacity-100 scale-100 translate-y-0';
  };

  return (
    <Card className={`mt-6 transition-all duration-300 ease-out transform hover-lift ${getStyles()} ${getAnimationClass()}`}>
      <CardContent className="p-5 relative overflow-hidden">
        {/* Animated background elements */}
        {type === 'success' && (
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl animate-pulse-slow"></div>
        )}
        
        <div className="flex items-center space-x-4 relative">
          <div className="flex-shrink-0 relative">
            {getIcon()}
            {type === 'success' && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            {title && (
              <div className="flex items-center space-x-2">
                <h4 className={`text-lg ${getTextStyles()}`}>
                  {title}
                </h4>
                {type === 'success' && (
                  <Gift className="w-5 h-5 text-green-600 animate-bounce" />
                )}
              </div>
            )}
            {message && (
              <p className={`text-sm ${getSubTextStyles()} mt-1`}>
                {message}
              </p>
            )}
          </div>
        </div>
        
        {/* Loading animation dots */}
        {type === 'loading' && (
          <div className="flex justify-center mt-3 space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {/* Success celebration effect */}
        {type === 'success' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
