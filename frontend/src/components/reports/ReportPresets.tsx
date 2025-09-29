import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface ReportPreset {
  name: string;
  description: string;
  range: number;
}

interface ReportPresetsProps {
  onSelectRange: (days: number) => void;
  presets?: ReportPreset[];
}

const defaultPresets: ReportPreset[] = [
  {
    name: "Last 7 Days",
    description: "Quick overview of recent symptoms",
    range: 7,
  },
  {
    name: "Last 30 Days",
    description: "Comprehensive monthly summary",
    range: 30,
  },
  {
    name: "Last 3 Months",
    description: "Quarterly health trends",
    range: 90,
  },
  {
    name: "Last 6 Months",
    description: "Extended pattern analysis",
    range: 180,
  },
];

export function ReportPresets({
  onSelectRange,
  presets = defaultPresets,
}: ReportPresetsProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Quick Presets</CardTitle>
        <CardDescription className="font-body">
          Choose a common time range
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presets.map(({ name, description, range }) => (
            <Button
              key={name}
              variant="soft"
              className="h-auto p-4 flex-col items-start"
              onClick={() => onSelectRange(range)}
            >
              <div className="font-ui font-medium">{name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {description}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}