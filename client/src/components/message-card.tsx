import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react";

interface MessageCardProps {
  type: 'loading' | 'success' | 'error' | 'info';
  title?: string;
  message?: string;
  show: boolean;
}

export function MessageCard({ type, title, message, show }: MessageCardProps) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'loading':
        return 'bg-white border-gray-100';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'info':
        return 'text-blue-900';
      default:
        return 'text-gray-900';
    }
  };

  const getSubTextStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className={`mt-6 ${getStyles()}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div>
            {title && (
              <h4 className={`font-semibold ${getTextStyles()}`}>
                {title}
              </h4>
            )}
            {message && (
              <p className={`text-sm ${getSubTextStyles()}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
