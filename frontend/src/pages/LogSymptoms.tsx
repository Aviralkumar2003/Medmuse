import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/layout/Header"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getAllSymptoms, searchSymptoms, clearSearchResults } from "@/store/slices/symptomSlice"
import { createSymptomEntries, clearError } from "@/store/slices/symptomEntrySlice"
import { 
  Plus, 
  X, 
  Save, 
  Calendar,
  Clock,
  AlertTriangle
} from "lucide-react"
import { Link } from "react-router-dom"

export default function LogSymptoms() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { symptoms: availableSymptoms, isLoading: symptomsLoading } = useAppSelector((state) => state.symptoms)
  const { isCreating: entryLoading, error } = useAppSelector((state) => state.symptomEntries)
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<{id: number, name: string}[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [severity, setSeverity] = useState([5])
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))

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

  const addSymptomByName = (symptomName: string) => {
    if (symptomName && !selectedSymptoms.some(s => s.name === symptomName)) {
      // Find the symptom in available symptoms or create a new one
      const foundSymptom = availableSymptoms.find(s => s.name.toLowerCase() === symptomName.toLowerCase())
      if (foundSymptom) {
        setSelectedSymptoms([...selectedSymptoms, { id: foundSymptom.id, name: foundSymptom.name }])
      }
      setNewSymptom("")
    }
  }

  const addSymptom = (symptom: {id: number, name: string}) => {
    if (!selectedSymptoms.some(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const removeSymptom = (symptomId: number) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId))
  }

  const handleSave = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom",
        variant: "destructive",
      })
      return
    }

    const entries = selectedSymptoms.map(symptom => ({
      symptomId: symptom.id,
      severity: severity[0],
      notes,
      entryDate: date
    }))

    try {
      await dispatch(createSymptomEntries({ entries })).unwrap()
      toast({
        title: "Success",
        description: "Symptoms logged successfully!",
      })
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in useEffect
    }
  }

  const getSeverityColor = (value: number) => {
    if (value <= 3) return "text-secondary"
    if (value <= 6) return "text-attention"
    return "text-warning"
  }

  const getSeverityLabel = (value: number) => {
    if (value <= 3) return "Mild"
    if (value <= 6) return "Moderate"
    return "Severe"
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
              Log Your Symptoms
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Record how you're feeling today to track your health over time
            </p>
          </div>

          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-ui text-foreground">Today's Entry</CardTitle>
              <CardDescription className="font-body">
                Fill out the details below to log your current symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time */}
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

              {/* Symptoms Selection */}
              <div className="space-y-4">
                <Label className="font-ui">Symptoms</Label>
                
                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSymptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-center bg-accent text-accent-foreground px-3 py-1 rounded-medical text-sm font-ui"
                      >
                        {symptom.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeSymptom(symptom.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Symptom */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a symptom..."
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSymptomByName(newSymptom)}
                    className="font-body"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSymptomByName(newSymptom)}
                    disabled={!newSymptom.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Available Symptoms */}
                <div>
                  <Label className="text-sm font-ui text-muted-foreground mb-2 block">
                    Or select from available symptoms:
                  </Label>
                  {symptomsLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSymptoms.slice(0, 12).map((symptom) => (
                        <Button
                          key={symptom.id}
                          type="button"
                          variant="soft"
                          size="sm"
                          onClick={() => addSymptom(symptom)}
                          disabled={selectedSymptoms.some(s => s.id === symptom.id)}
                          className="justify-start text-left"
                        >
                          {symptom.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Severity Rating */}
              <div className="space-y-4">
                <Label className="font-ui">Severity Level</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-body text-muted-foreground">Mild</span>
                    <span className="text-sm font-body text-muted-foreground">Severe</span>
                  </div>
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className={`text-2xl font-ui font-bold ${getSeverityColor(severity[0])}`}>
                      {severity[0]}/10
                    </span>
                    <span className={`ml-2 text-sm font-ui ${getSeverityColor(severity[0])}`}>
                      ({getSeverityLabel(severity[0])})
                    </span>
                  </div>
                </div>
              </div>


              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="font-ui">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about your symptoms, triggers, or context..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="font-body"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="medical"
                  size="lg"
                  onClick={handleSave}
                  disabled={selectedSymptoms.length === 0 || entryLoading}
                  className="flex-1"
                >
                  {entryLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {entryLoading ? 'Saving...' : 'Save Entry'}
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">Cancel</Link>
                </Button>
              </div>

              {/* Warning for severe symptoms */}
              {severity[0] >= 8 && (
                <div className="bg-warning/10 border border-warning/20 rounded-medical p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-ui font-medium text-foreground mb-1">
                      Severe symptoms detected
                    </p>
                    <p className="text-sm font-body text-muted-foreground">
                      If you're experiencing severe symptoms, consider contacting your healthcare provider or seeking immediate medical attention.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}