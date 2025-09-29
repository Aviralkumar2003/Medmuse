import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Report {
  id: number;
  weekStartDate: string;
  weekEndDate: string;
  generatedAt: string;
  hasPdf: boolean;
}

interface PreviousReportsProps {
  reports: Report[];
  onDownload: (reportId: number) => void;
  isLoading?: boolean;
  maxDisplay?: number;
}

export function PreviousReports({
  reports,
  onDownload,
  isLoading = false,
  maxDisplay = 5,
}: PreviousReportsProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Previous Reports</CardTitle>
        <CardDescription className="font-body">
          Your generated health reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No reports generated yet
          </p>
        ) : (
          reports.slice(0, maxDisplay).map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 bg-muted rounded-md"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {new Date(report.weekStartDate).toLocaleDateString()} -{" "}
                  {new Date(report.weekEndDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Generated {new Date(report.generatedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(report.id)}
                disabled={!report.hasPdf}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}