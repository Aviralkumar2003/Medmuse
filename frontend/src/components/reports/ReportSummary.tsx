import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate, inclusiveDayCount } from "@/lib/date-utils";

interface ReportSummaryProps {
  startDate: string;
  endDate: string;
  selectedSymptoms: string[];
}

export function ReportSummary({
  startDate,
  endDate,
  selectedSymptoms,
}: ReportSummaryProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Report Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-ui text-sm text-muted-foreground">Date Range</Label>
          <p className="font-body">
            {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
          </p>
        </div>
        <div>
          <Label className="font-ui text-sm text-muted-foreground">Duration</Label>
          <p className="font-body">
            {inclusiveDayCount(startDate, endDate)} days
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
      </CardContent>
    </Card>
  );
}
