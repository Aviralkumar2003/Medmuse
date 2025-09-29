import { forwardRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportActionsProps {
  onGenerateReport: () => void;
  onDownloadPdf: () => void;
  isGenerating: boolean;
}

export const ReportActions = forwardRef<HTMLDivElement, ReportActionsProps>(
  ({ onGenerateReport, onDownloadPdf, isGenerating }, ref) => {
    return (
      <Card className="shadow-card border-border" ref={ref}>
        <CardHeader>
          <CardTitle className="font-ui text-foreground">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Generate Report Button */}
          <Button
            variant="medical"
            className="w-full justify-start"
            onClick={onGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Generate Report
          </Button>

          {/* Download PDF Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onDownloadPdf}
          >
            <Download className="h-4 w-4 mr-2" />
            Download as PDF
          </Button>
        </CardContent>
      </Card>
    );
  }
);