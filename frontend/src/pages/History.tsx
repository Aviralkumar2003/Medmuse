import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/layout/Header"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getUserSymptomEntries, clearError } from "@/store/slices/symptomEntrySlice"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Filter, 
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function History() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  const { entries, isLoading, error, paginatedEntries } = useAppSelector((state) => state.symptomEntries)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    dispatch(getUserSymptomEntries({ 
      page: currentPage, 
      size: pageSize, 
      sort: "entryDate,desc" 
    }))
    return () => {
      dispatch(clearError())
    }
  }, [dispatch, currentPage])

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-secondary"
    if (severity <= 6) return "text-attention"
    return "text-warning"
  }

  const getSeverityTrend = (current: number, previous?: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-muted-foreground" />
    if (current > previous) return <TrendingUp className="h-4 w-4 text-warning" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-secondary" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const filteredEntries = entries.filter(entry => 
    entry.symptomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background-soft">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
              Symptom History
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Review and track your symptom patterns over time
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-ui text-foreground">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symptoms or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>
                <Button variant="outline" className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading symptom history...</p>
            </div>
          )}

          {/* Entries List */}
          {!isLoading && (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <Card key={entry.id} className="shadow-card border-border hover:shadow-lg transition-medical">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left side - Date, Symptoms */}
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
                          <p className="text-sm font-body text-muted-foreground">
                            {entry.notes}
                          </p>
                        )}
                      </div>

                      {/* Right side - Severity */}
                      <div className="flex flex-col items-center sm:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-ui font-bold ${getSeverityColor(entry.severity)}`}>
                            {entry.severity}/10
                          </span>
                          {getSeverityTrend(
                            entry.severity, 
                            index < filteredEntries.length - 1 ? filteredEntries[index + 1].severity : undefined
                          )}
                        </div>
                        <div className="w-20 h-2 bg-background rounded-full">
                          <div 
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${(entry.severity / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && paginatedEntries && paginatedEntries.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {paginatedEntries.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= paginatedEntries.totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <Card className="shadow-card border-border">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground font-body mb-4">
                  {searchTerm 
                    ? `No entries found matching "${searchTerm}"`
                    : "No symptom entries found"
                  }
                </p>
                <Button variant="medical" asChild>
                  <a href="/log-symptoms">Log Your First Symptom</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          {!isLoading && filteredEntries.length > 0 && (
            <Card className="mt-8 shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-ui text-foreground">Summary</CardTitle>
                <CardDescription className="font-body">
                  Overview of your recent entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-ui font-bold text-foreground">
                      {paginatedEntries?.totalElements || filteredEntries.length}
                    </div>
                    <div className="text-sm font-body text-muted-foreground">
                      Total Entries
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-ui font-bold text-foreground">
                      {(filteredEntries.reduce((sum, entry) => sum + entry.severity, 0) / filteredEntries.length).toFixed(1)}
                    </div>
                    <div className="text-sm font-body text-muted-foreground">
                      Average Severity
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-ui font-bold text-foreground">
                      {[...new Set(filteredEntries.map(entry => entry.symptomName))].length}
                    </div>
                    <div className="text-sm font-body text-muted-foreground">
                      Unique Symptoms
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}