import { ReactNode } from "react";
import { MessageSquare, Activity, Clock as ClockIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tip {
  icon: ReactNode;
  text: string;
}

interface QuickTipsProps {
  tips?: Tip[];
}

const defaultTips: Tip[] = [
  {
    icon: <MessageSquare className="h-3 w-3 text-blue-500" />,
    text: "Be specific about location and timing"
  },
  {
    icon: <Activity className="h-3 w-3 text-green-500" />,
    text: "Note what makes it better or worse"
  },
  {
    icon: <ClockIcon className="h-3 w-3 text-orange-500" />,
    text: "Log symptoms as soon as you notice them"
  }
];

export function QuickTips({ tips = defaultTips }: QuickTipsProps) {
  return (
    <Card className="shadow-card border-border mt-6">
      <CardHeader>
        <CardTitle className="font-ui text-foreground text-lg">
          Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-center gap-2">
              {tip.icon}
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}