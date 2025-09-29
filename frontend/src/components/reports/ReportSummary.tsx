import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportSummaryProps {
  startDate: string;
  endDate: string;
  selectedSymptoms: string[];
  format: string;
}

export function ReportSummary({
  startDate,
  endDate,
  selectedSymptoms,
  format,
}: ReportSummaryProps) {
  const calculateDurationInDays = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Report Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-ui text-sm text-muted-foreground">Date Range</Label>
          <p className="font-body">
            {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <Label className="font-ui text-sm text-muted-foreground">Duration</Label>
          <p className="font-body">
            {calculateDurationInDays(startDate, endDate)} days
          </p>
        </div>
        <div>
          <Label className="font-ui text-sm text-muted-foreground">
            Symptoms Filter
          </Label>
          <p className="font-body">
            {selectedSymptoms.length === 0
              ? "All symptoms"
              : `${selectedSymptoms.length} selected`}
          </p>
        </div>
        <div>
          <Label className="font-ui text-sm text-muted-foreground">Format</Label>
          <p className="font-body capitalize">{format}</p>
        </div>
      </CardContent>
    </Card>
  );
}