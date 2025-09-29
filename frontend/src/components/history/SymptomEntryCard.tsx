import { Calendar, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SymptomEntry {
  id: string | number;
  entryDate: string;
  symptomName: string;
  symptomCategory: string;
  severity: number;
  notes?: string;
  previousSeverity?: number;
}

interface SymptomEntryCardProps {
  entry: SymptomEntry;
}

export const SymptomEntryCard = ({ entry }: SymptomEntryCardProps) => {
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-secondary";
    if (severity <= 6) return "text-attention";
    return "text-warning";
  };

  const getSeverityTrend = (current: number, previous?: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-warning" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-secondary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-card border-border hover:shadow-lg transition-medical">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-ui">
                  {new Date(entry.entryDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-ui">
                  {entry.symptomName}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {entry.symptomCategory}
                </span>
              </div>
            </div>
            
            {entry.notes && (
              <p className="text-sm text-muted-foreground font-body">{entry.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-ui mb-1">Severity</div>
              <div className={`text-lg font-bold ${getSeverityColor(entry.severity)}`}>
                {entry.severity}
              </div>
              {entry.previousSeverity && (
                <div className="flex items-center justify-end gap-1 text-xs">
                  vs. {entry.previousSeverity}
                  {getSeverityTrend(entry.severity, entry.previousSeverity)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};