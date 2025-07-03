import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface StatusCardProps {
  totalRewards: number;
  adsWatched: number;
}

export function StatusCard({ totalRewards, adsWatched }: StatusCardProps) {
  return (
    <Card className="shadow-sm border border-gray-100 mb-6">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Rewards</h3>
          <p className="text-3xl font-bold text-telegram">{totalRewards}</p>
          <p className="text-sm text-gray-500 mt-1">Ads watched today: {adsWatched}</p>
        </div>
      </CardContent>
    </Card>
  );
}
