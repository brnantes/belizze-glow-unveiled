import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className={`text-xs mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-rose-gold/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-rose-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
