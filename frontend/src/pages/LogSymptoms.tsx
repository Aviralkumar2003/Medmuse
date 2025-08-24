import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/Header"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getAllSymptoms, searchSymptoms, clearSearchResults } from "@/store/slices/symptomSlice"
import { createSymptomEntries, clearError } from "@/store/slices/symptomEntrySlice"
import { 
  Plus, 
  Save, 
  Calendar,
  Clock,
  Search,
  TrendingUp,
  Activity,
  MessageSquare,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { Link } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { QuickLogging } from "@/components/ui/quick-logging"
import { DetailedLogging } from "@/components/ui/detailed-logging"
import { SymptomList, UnifiedSymptom } from "@/components/ui/symptom-list"

export default function LogSymptoms() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { symptoms: availableSymptoms, isLoading: symptomsLoading } = useAppSelector((state) => state.symptoms)
  const { isCreating: entryLoading, error } = useAppSelector((state) => state.symptomEntries)
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [symptoms, setSymptoms] = useState<UnifiedSymptom[]>([])
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("quick")

  useEffect(() => {
    dispatch(getAllSymptoms())
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



  // Unified symptom management functions
  const handleSymptomAdd = (symptom: UnifiedSymptom) => {
    setSymptoms(prev => [...prev, symptom])
  }

  const handleSymptomUpdate = (updatedSymptom: UnifiedSymptom) => {
    setSymptoms(prev => prev.map(s => s.id === updatedSymptom.id ? updatedSymptom : s))
  }

  const handleSymptomRemove = (symptomId: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== symptomId))
    if (selectedSymptomId === symptomId) {
      setSelectedSymptomId(null)
    }
  }

  const handleSymptomClick = (symptom: UnifiedSymptom) => {
    setSelectedSymptomId(symptom.id)
    // Switch to the appropriate tab
    setActiveTab(symptom.loggingType)
  }

  const handleConvertSymptom = (symptom: UnifiedSymptom, newType: 'quick' | 'detailed') => {
    const updatedSymptom = { ...symptom, loggingType: newType }
    handleSymptomUpdate(updatedSymptom)
    setActiveTab(newType)
    toast({
      title: `Converted to ${newType === 'quick' ? 'Quick' : 'Detailed'} Mode`,
      description: `${symptom.name} has been converted to ${newType} logging mode.`,
    })
  }

  const handleSaveAll = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom before saving.",
        variant: "destructive",
      })
      return
    }

    const entries = symptoms.map(symptom => ({
      symptomId: parseInt(symptom.id),
      severity: symptom.severity,
      notes: symptom.notes,
      entryDate: date
    }))

    try {
      await dispatch(createSymptomEntries({ entries })).unwrap()
      toast({
        title: "Success",
        description: `${symptoms.length} symptom${symptoms.length !== 1 ? 's' : ''} logged successfully!`,
      })
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in useEffect
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
              Log Your Symptoms
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Record how you're feeling today to track your health over time
            </p>
          </div>

          {/* Date and Time */}
          <Card className="shadow-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-ui text-foreground text-lg">Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-ui">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10 font-body"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="font-ui">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-10 font-body"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptom List */}
          <SymptomList
            symptoms={symptoms}
            onSymptomClick={handleSymptomClick}
            onRemoveSymptom={handleSymptomRemove}
            onConvertSymptom={handleConvertSymptom}
            selectedSymptomId={selectedSymptomId}
          />

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="quick" className="flex items-center gap-2 data-[state=active]:border-2 data-[state=active]:border-primary">
                <Clock className="h-4 w-4" />
                Quick Logging
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2 data-[state=active]:border-2 data-[state=active]:border-primary">
                <Activity className="h-4 w-4" />
                Detailed Logging
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-6">
              <QuickLogging
                availableSymptoms={availableSymptoms}
                onSymptomUpdate={handleSymptomUpdate}
                onSymptomAdd={handleSymptomAdd}
                onSymptomRemove={handleSymptomRemove}
                selectedSymptom={symptoms.find(s => s.id === selectedSymptomId)}
                symptoms={symptoms}
                isLoading={entryLoading}
                date={date}
              />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <DetailedLogging
                availableSymptoms={availableSymptoms}
                onSymptomUpdate={handleSymptomUpdate}
                onSymptomAdd={handleSymptomAdd}
                onSymptomRemove={handleSymptomRemove}
                selectedSymptom={symptoms.find(s => s.id === selectedSymptomId)}
                symptoms={symptoms}
                isLoading={entryLoading}
                date={date}
              />
            </TabsContent>
          </Tabs>

          {/* Common Save Button */}
          {symptoms.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSaveAll}
                disabled={entryLoading}
                size="lg"
                className="px-8"
              >
                {entryLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {entryLoading ? 'Saving...' : `Save All ${symptoms.length} Symptom${symptoms.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          )}

          {/* Quick Tips */}
          <Card className="shadow-card border-border mt-6">
            <CardHeader>
              <CardTitle className="font-ui text-foreground text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-blue-500" />
                  <span>Be specific about location and timing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span>Note what makes it better or worse</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-orange-500" />
                  <span>Log symptoms as soon as you notice them</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}