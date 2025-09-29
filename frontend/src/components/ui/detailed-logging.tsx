import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"
import { 
  Plus, 
  X, 
  Search,
  Activity,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { SimpleSeveritySelector } from "./simple-severity-selector"
import { EnhancedNotesDetailed } from "./enhanced-notes-detailed"
import { UnifiedSymptom } from "./symptom-list"

interface DetailedLoggingProps {
  availableSymptoms: Array<{id: number, name: string}>
  onSymptomUpdate: (symptom: UnifiedSymptom) => void
  onSymptomAdd: (symptom: UnifiedSymptom) => void
  onSymptomRemove: (symptomId: string) => void
  selectedSymptom?: UnifiedSymptom
  symptoms: UnifiedSymptom[]
  isLoading?: boolean
  date: string
}

export function DetailedLogging({ 
  availableSymptoms, 
  onSymptomUpdate, 
  onSymptomAdd, 
  onSymptomRemove,
  selectedSymptom,
  symptoms,
  isLoading = false, 
  date 
}: DetailedLoggingProps) {
  const [newSymptom, setNewSymptom] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter symptoms that are in detailed logging mode
  const detailedSymptoms = symptoms.filter(s => s.loggingType === 'detailed')

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 9)

  const addSymptomByName = (symptomName: string) => {
    if (symptomName && !symptoms.some(s => s.name === symptomName)) {
      const foundSymptom = availableSymptoms.find(s => s.name.toLowerCase() === symptomName.toLowerCase())
      if (foundSymptom) {
        const newSymptom: UnifiedSymptom = {
          id: foundSymptom.id.toString(),
          name: foundSymptom.name,
          severity: 5,
          notes: "",
          loggingType: 'detailed'
        }
        onSymptomAdd(newSymptom)
      }
      setNewSymptom("")
    }
  }

  const addSymptom = (symptom: {id: number, name: string}) => {
    if (!symptoms.some(s => s.id === symptom.id.toString())) {
      const newSymptom: UnifiedSymptom = {
        id: symptom.id.toString(),
        name: symptom.name,
        severity: 5,
        notes: "",
        loggingType: 'detailed'
      }
      onSymptomAdd(newSymptom)
    }
  }

  const removeSymptom = (symptomId: string) => {
    onSymptomRemove(symptomId)
  }

  const updateSymptom = (symptomId: string, field: 'severity' | 'notes', value: number | string) => {
    const symptom = symptoms.find(s => s.id === symptomId)
    if (symptom) {
      onSymptomUpdate({
        ...symptom,
        [field]: value
      })
    }
  }

  const getSeverityIcon = (value: number) => {
    if (value <= 3) return "😊"
    if (value <= 6) return "😐"
    if (value <= 8) return "😣"
    return "😫"
  }

  const getSeverityColor = (value: number) => {
    if (value <= 3) return "bg-green-100 text-green-800 border-green-200"
    if (value <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (value <= 8) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getSeverityLabel = (value: number) => {
    if (value <= 3) return "Mild"
    if (value <= 6) return "Moderate"
    if (value <= 8) return "Severe"
    return "Very Severe"
  }

  const hasSevereSymptoms = detailedSymptoms.some(s => s.severity >= 8)
  const totalSeverity = detailedSymptoms.reduce((sum, s) => sum + s.severity, 0)
  const averageSeverity = detailedSymptoms.length > 0 ? Math.round(totalSeverity / detailedSymptoms.length) : 0

  return (
    <div className="space-y-6">
      {/* Symptom Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type a symptom..."
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSymptomByName(newSymptom)}
            />
            <Button
              onClick={() => addSymptomByName(newSymptom)}
              disabled={!newSymptom.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredSymptoms.map((symptom) => (
                <Button
                  key={symptom.id}
                  variant="soft"
                  size="sm"
                  onClick={() => addSymptom(symptom)}
                  disabled={symptoms.some(s => s.id === symptom.id.toString())}
                  className="justify-start text-left h-auto p-2"
                >
                  <div className="text-sm font-medium">{symptom.name}</div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Symptoms with Details */}
      {detailedSymptoms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Detailed Logged Symptoms ({detailedSymptoms.length})</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Avg: {averageSeverity}/10</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {detailedSymptoms.map((symptom) => (
              <Card key={symptom.id} className="border-border">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">{getSeverityIcon(symptom.severity)}</span>
                      <h4 className="font-medium text-foreground truncate">
                        {symptom.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs font-medium", getSeverityColor(symptom.severity))}
                      >
                        {symptom.severity}/10
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymptom(symptom.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{getSeverityLabel(symptom.severity)}</span>
                    </div>
                    
                    {symptom.notes.trim().length > 0 && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>Has notes</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Just added</span>
                    </div>
                  </div>

                  {/* Severe Warning */}
                  {symptom.severity >= 8 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900 text-sm mb-1">
                            Severe symptom detected
                          </p>
                          <p className="text-xs text-red-700">
                            Consider contacting your healthcare provider if this persists.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Severity Selection */}
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-medium">Severity Level</h5>
                    <SimpleSeveritySelector
                      value={symptom.severity}
                      onChange={(value) => updateSymptom(symptom.id, 'severity', value)}
                    />
                  </div>

                    {/* Notes Section */}
                   < div className="space-y-3">
                     <h5 className="text-sm font-medium">Additional Notes</h5>
                     <EnhancedNotesDetailed
                       value={symptom.notes}
                       onChange={(value) => updateSymptom(symptom.id, 'notes', value)}
                       placeholder={`Describe your ${symptom.name.toLowerCase()} in detail...`}
                       maxLength={500}
                       symptomName={symptom.name}
                     />
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No individual save button - using common save from parent */}
    </div>
  )
}
