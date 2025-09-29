import { useEffect } from "react"
import { Calendar, Activity, Target, Plus, Clock, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { WelcomeSection } from "@/components/dashboard/WelcomeSection"
import { QuickActionCard } from "@/components/dashboard/QuickActionCard"
import { RecentEntriesCard } from "@/components/dashboard/RecentEntriesCard"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { getUserSymptomEntries } from "../store/slices/symptomEntrySlice"
import { generateWeeklyReport } from "../store/slices/reportSlice"
import { useToast } from "../hooks/use-toast"

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { entries, isLoading: entriesLoading } = useAppSelector((state) => state.symptomEntries)
  const { isGenerating: reportGenerating } = useAppSelector((state) => state.reports)

  useEffect(() => {
    // Fetch recent entries when component mounts
    dispatch(getUserSymptomEntries({ page: 0, size: 5, sort: 'entryDate,desc' }))
  }, [dispatch])

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Entries",
      value: entries.length.toString(),
      icon: Calendar,
      description: "Recent entries",
      trend: `${entries.length} logged`
    },
    {
      title: "Average Severity",
      value: entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.severity, 0) / entries.length).toFixed(1) : "0",
      icon: Activity,
      description: "Past entries",
      trend: entries.length > 0 ? "Based on recent data" : "No data yet"
    },
    {
      title: "Recent Days",
      value: [...new Set(entries.map(entry => entry.entryDate))].length.toString(),
      icon: Target,
      description: "Days with entries",
      trend: "Keep tracking!"
    }
  ]

  const handleQuickLogSymptoms = () => {
    // This will navigate to log symptoms page
  }

  const handleGenerateWeeklyReport = async () => {
    try {
      await dispatch(generateWeeklyReport()).unwrap()
      toast({
        title: "Success",
        description: "Weekly report generated successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to generate report",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection userName={user?.name} />
        <QuickActionCard />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Entries */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-ui text-foreground">Recent Entries</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/history">View All</Link>
                </Button>
              </div>
              <CardDescription className="font-body">
                Your latest symptom logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.slice(0, 3).map((entry) => (
                    <div 
                      key={entry.id} 
                      className="flex items-center justify-between p-4 bg-background-soft rounded-medical border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-ui font-medium text-foreground">
                            {new Date(entry.entryDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {entry.symptomCategory}
                          </span>
                        </div>
                        <p className="text-sm font-body text-muted-foreground">
                          {entry.symptomName}
                        </p>
                        {entry.notes && (
                          <p className="text-xs font-body text-muted-foreground mt-1 truncate">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-ui font-medium text-foreground">
                          Severity: {entry.severity}/10
                        </div>
                        <div 
                          className="w-16 h-2 bg-background rounded-full mt-1"
                        >
                          <div 
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${(entry.severity / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-body mb-4">
                    No entries yet. Start logging your symptoms!
                  </p>
                  <Button variant="medical" size="sm" asChild>
                    <Link to="/log-symptoms">
                      <Plus className="h-4 w-4 mr-2" />
                      Log First Symptom
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-ui text-foreground">Quick Actions</CardTitle>
              <CardDescription className="font-body">
                Common tasks to keep you on track
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="soft" className="w-full justify-start" asChild>
                  <Link to="/log-symptoms">
                    <Plus className="h-4 w-4 mr-3" />
                    Log Today's Symptoms
                  </Link>
                </Button>
                <Button variant="soft" className="w-full justify-start" asChild>
                  <Link to="/history">
                    <Clock className="h-4 w-4 mr-3" />
                    View Symptom History
                  </Link>
                </Button>
                <Button 
                  variant="soft" 
                  className="w-full justify-start"
                  onClick={handleGenerateWeeklyReport}
                  disabled={reportGenerating}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  {reportGenerating ? "Generating..." : "Generate Weekly Report"}
                </Button>
                <Button variant="soft" className="w-full justify-start" asChild>
                  <Link to="/reports">
                    <TrendingUp className="h-4 w-4 mr-3" />
                    View All Reports
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Health Check */}
        <Card className="mt-8 shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-ui text-foreground">Today's Health Check</CardTitle>
            <CardDescription className="font-body">
              How are you feeling today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground font-body mb-6">
                {entries.some(entry => entry.entryDate === new Date().toISOString().split('T')[0]) 
                  ? "You've logged symptoms for today. Great job staying consistent!"
                  : "You haven't logged any symptoms for today yet."
                }
              </p>
              <Button variant="medical" size="lg" asChild>
                <Link to="/log-symptoms">
                  <Plus className="h-5 w-5 mr-2" />
                  {entries.some(entry => entry.entryDate === new Date().toISOString().split('T')[0])
                    ? "Add More Symptoms"
                    : "Start Today's Log"
                  }
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}