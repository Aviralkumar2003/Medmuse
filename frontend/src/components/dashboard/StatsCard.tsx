import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
}

export const StatsCard = ({ title, value, description, trend, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="shadow-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-ui font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-ui font-bold text-foreground mb-1">
          {value}
        </div>
        <p className="text-xs font-body text-muted-foreground">
          {description}
        </p>
        <p className="text-xs font-body text-secondary mt-1">
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};