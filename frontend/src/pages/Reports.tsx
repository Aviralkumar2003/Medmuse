import { useEffect, useState } from "react";

import { SymptomFilter } from "@/components/reports/SymptomFilter";
import { ReportSummary } from "@/components/reports/ReportSummary";
import { PageHeader } from "@/components/shared/PageHeader";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { formatDisplayDate, getPresetDateRange } from "@/lib/date-utils";
import { Download, FileText } from "lucide-react";

import {
  clearError,
  downloadReportPdf,
  generateCustomReport,
  getUserReports,
} from "@/store/slices/reportSlice";
import { getAllSymptoms } from "@/store/slices/symptomSlice";

const reportPresets = [
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

export default function Reports() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    reports,
    isLoading: reportsLoading,
    error,
  } = useAppSelector((state) => state.reports);
  const { symptoms } = useAppSelector((state) => state.symptoms);
  const { user } = useAppSelector((state) => state.auth);

  const [dateRange, setDateRange] = useState(() => getPresetDateRange(30));
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<number[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    dispatch(getAllSymptoms());
    dispatch(getUserReports());

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
    dispatch(clearError());
  }, [dispatch, error, toast]);

  const selectedSymptomNames = symptoms
    .filter((symptom) => selectedSymptomIds.includes(symptom.id))
    .map((symptom) => symptom.name);

  const handleSymptomToggle = (symptomId: number) => {
    setSelectedSymptomIds((previousIds) =>
      previousIds.includes(symptomId)
        ? previousIds.filter((id) => id !== symptomId)
        : [...previousIds, symptomId]
    );
  };

  const setPresetRange = (days: number) => {
    setDateRange(getPresetDateRange(days));
  };

  const generateReport = async () => {
    if (!user?.demographics) {
      toast({
        title: "Demographics Required",
        description: "Please fill your demographics before generating the report.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);

    try {
      await dispatch(
        generateCustomReport({
          startDate: dateRange.start,
          endDate: dateRange.end,
          symptomIds: selectedSymptomIds,
        })
      ).unwrap();

      toast({
        title: "Report Generated",
        description: "Your health report has been generated successfully!",
      });

      dispatch(getUserReports());
    } catch (generationError: unknown) {
      toast({
        title: "Error",
        description:
          typeof generationError === "string"
            ? generationError
            : "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = async (reportId: number) => {
    try {
      const blob = await dispatch(downloadReportPdf(reportId)).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `health-report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your report is being downloaded.",
      });
    } catch (downloadError: unknown) {
      toast({
        title: "Download Failed",
        description:
          typeof downloadError === "string"
            ? downloadError
            : "Failed to download report PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Generate Medical Reports"
            description="Create comprehensive health reports to share with your healthcare providers"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">
                    Quick Presets
                  </CardTitle>
                  <CardDescription className="font-body">
                    Choose a common time range
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reportPresets.map(({ name, description, range }) => (
                      <Button
                        key={name}
                        variant="soft"
                        className="h-auto p-4 flex-col items-start"
                        onClick={() => setPresetRange(range)}
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

              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">
                    Custom Date Range
                  </CardTitle>
                  <CardDescription className="font-body">
                    Select specific dates for your report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onStartDateChange={(startDate) =>
                      setDateRange((previousRange) => ({
                        ...previousRange,
                        start: startDate,
                      }))
                    }
                    onEndDateChange={(endDate) =>
                      setDateRange((previousRange) => ({
                        ...previousRange,
                        end: endDate,
                      }))
                    }
                  />
                </CardContent>
              </Card>

              <SymptomFilter
                symptoms={symptoms}
                selectedSymptomIds={selectedSymptomIds}
                onSymptomToggle={handleSymptomToggle}
                onClearAll={() => setSelectedSymptomIds([])}
              />
            </div>

            <div className="space-y-6">
              <ReportSummary
                startDate={dateRange.start}
                endDate={dateRange.end}
                selectedSymptoms={selectedSymptomNames}
              />

              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!user?.demographics && (
                    <div className="text-sm mb-2 text-red-600">
                      Please complete your demographics to generate the report
                    </div>
                  )}

                  <Button
                    variant="medical"
                    className="w-full justify-start"
                    onClick={generateReport}
                    disabled={!user?.demographics || isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">
                    Generated Reports
                  </CardTitle>
                  <CardDescription className="font-body">
                    Your generated health reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportsLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : reports.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No reports generated yet
                    </p>
                  ) : (
                    reports.slice(0, 5).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {formatDisplayDate(report.weekStartDate)} -{" "}
                            {formatDisplayDate(report.weekEndDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generated{" "}
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReport(report.id)}
                          disabled={!report.hasPdf}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
