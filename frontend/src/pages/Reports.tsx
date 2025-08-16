import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/Header"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { generateWeeklyReport, generateCustomReport, getUserReports, downloadReportPdf, clearError } from "@/store/slices/reportSlice"
import { getAllSymptoms } from "@/store/slices/symptomSlice"
import { useToast } from "@/hooks/use-toast"
import { 
  Download, 
  FileText, 
  Share2, 
  Calendar,
  Filter,
  Eye,
  Trash2
} from "lucide-react"

export default function Reports() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  const { reports, isLoading: reportsLoading, error } = useAppSelector((state) => state.reports)
  const { symptoms } = useAppSelector((state) => state.symptoms)
  
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    dispatch(getAllSymptoms())
    dispatch(getUserReports())
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const reportPresets = [
    {
      name: "Last 7 Days",
      description: "Quick overview of recent symptoms",
      range: 7
    },
    {
      name: "Last 30 Days", 
      description: "Comprehensive monthly summary",
      range: 30
    },
    {
      name: "Last 3 Months",
      description: "Quarterly health trends",
      range: 90
    },
    {
      name: "Last 6 Months",
      description: "Extended pattern analysis",
      range: 180
    }
  ]

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const setPresetRange = (days: number) => {
    const end = new Date()
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
  }

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const report = await dispatch(generateCustomReport({
        startDate: dateRange.start,
        endDate: dateRange.end
      })).unwrap()
      
      toast({
        title: "Report Generated",
        description: "Your health report has been generated successfully!",
      })
      
      // Refresh reports list
      dispatch(getUserReports())
    } catch (error) {
      // Error handled in useEffect
    } finally {
      setIsGenerating(false)
    }
  }

  const generateWeeklyReportHandler = async () => {
    setIsGenerating(true)
    try {
      const report = await dispatch(generateWeeklyReport()).unwrap()
      toast({
        title: "Weekly Report Generated",
        description: "Your weekly health report has been generated!",
      })
      dispatch(getUserReports())
    } catch (error) {
      // Error handled in useEffect
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = async (reportId: number) => {
    try {
      const blob = await dispatch(downloadReportPdf(reportId)).unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `health-report-${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Download Started",
        description: "Your report is being downloaded.",
      })
    } catch (error) {
      // Error handled in useEffect
    }
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
              Generate Medical Reports
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Create comprehensive health reports to share with your healthcare providers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Presets */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Quick Presets</CardTitle>
                  <CardDescription className="font-body">
                    Choose a common time range
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reportPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="soft"
                        className="h-auto p-4 flex-col items-start"
                        onClick={() => setPresetRange(preset.range)}
                      >
                        <div className="font-ui font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {preset.description}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Date Range */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Custom Date Range</CardTitle>
                  <CardDescription className="font-body">
                    Select specific dates for your report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="font-ui">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="start-date"
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="pl-10 font-body"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="font-ui">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="end-date"
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="pl-10 font-body"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Symptom Selection */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Filter by Symptoms</CardTitle>
                  <CardDescription className="font-body">
                    Select specific symptoms to include (leave empty for all)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {symptoms.slice(0, 12).map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.name}
                          checked={selectedSymptoms.includes(symptom.name)}
                          onCheckedChange={() => handleSymptomToggle(symptom.name)}
                        />
                        <Label 
                          htmlFor={symptom.name} 
                          className="text-sm font-body cursor-pointer"
                        >
                          {symptom.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSymptoms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-body text-muted-foreground">
                        Selected: {selectedSymptoms.join(", ")}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedSymptoms([])}
                        className="mt-2"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Report Format */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Export Format</CardTitle>
                  <CardDescription className="font-body">
                    Choose your preferred file format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="pdf"
                        name="format"
                        value="pdf"
                        checked={reportFormat === "pdf"}
                        onChange={(e) => setReportFormat(e.target.value)}
                        className="text-primary"
                      />
                      <Label htmlFor="pdf" className="font-body cursor-pointer">
                        PDF - Best for sharing with doctors
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="word"
                        name="format"
                        value="word"
                        checked={reportFormat === "word"}
                        onChange={(e) => setReportFormat(e.target.value)}
                        className="text-primary"
                      />
                      <Label htmlFor="word" className="font-body cursor-pointer">
                        Word Document - Editable format
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview & Actions */}
            <div className="space-y-6">
              {/* Report Summary */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-ui text-sm text-muted-foreground">Date Range</Label>
                    <p className="font-body">
                      {new Date(dateRange.start).toLocaleDateString()} -{" "}
                      {new Date(dateRange.end).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="font-ui text-sm text-muted-foreground">
                      Duration
                    </Label>
                    <p className="font-body">
                      {Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <Label className="font-ui text-sm text-muted-foreground">
                      Symptoms Filter
                    </Label>
                    <p className="font-body">
                      {selectedSymptoms.length === 0 
                        ? "All symptoms" 
                        : `${selectedSymptoms.length} selected`
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="font-ui text-sm text-muted-foreground">Format</Label>
                    <p className="font-body capitalize">{reportFormat}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="medical" 
                    className="w-full justify-start"
                    onClick={generateWeeklyReportHandler}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Generate Weekly Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={generateReport}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Generate Custom Report
                  </Button>
                </CardContent>
              </Card>

              {/* Previous Reports */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-ui text-foreground">Previous Reports</CardTitle>
                  <CardDescription className="font-body">
                    Your generated health reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportsLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : reports.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No reports generated yet
                    </p>
                  ) : (
                    reports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generated {new Date(report.generatedAt).toLocaleDateString()}
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
  )
}