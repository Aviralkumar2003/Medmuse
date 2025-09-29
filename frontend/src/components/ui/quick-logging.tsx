import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"
import { X, Clock, MessageSquare, Edit3, Plus } from "lucide-react"
import { SimpleNotes } from "./simple-notes"
import { UnifiedSymptom } from "./symptom-list"
import { SimpleSeveritySelector } from "./simple-severity-selector"

interface QuickLoggingProps {
  availableSymptoms: Array<{ id: number, name: string }>
  onSymptomUpdate: (symptom: UnifiedSymptom) => void
  onSymptomAdd: (symptom: UnifiedSymptom) => void
  onSymptomRemove: (symptomId: string) => void
  selectedSymptom?: UnifiedSymptom
  symptoms: UnifiedSymptom[]
  isLoading?: boolean
  date: string
}

export function QuickLogging({
  availableSymptoms,
  onSymptomUpdate,
  onSymptomAdd,
  onSymptomRemove,
  selectedSymptom,
  symptoms,
  isLoading = false,
  date
}: QuickLoggingProps) {
  const [newSymptom, setNewSymptom] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null)

  const quickSymptoms = symptoms.filter(s => s.loggingType === 'quick')

  const addSymptomByName = (symptomName: string) => {
    if (symptomName && !symptoms.some(s => s.name === symptomName)) {
      const foundSymptom = availableSymptoms.find(s => s.name.toLowerCase() === symptomName.toLowerCase())
      if (foundSymptom) {
        const newSymptom: UnifiedSymptom = {
          id: foundSymptom.id.toString(),
          name: foundSymptom.name,
          severity: 5,
          notes: "",
          loggingType: 'quick'
        }
        onSymptomAdd(newSymptom)
      }
      setNewSymptom("")
    }
  }

  const addSymptom = (symptom: { id: number, name: string }) => {
    if (!symptoms.some(s => s.id === symptom.id.toString())) {
      const newSymptom: UnifiedSymptom = {
        id: symptom.id.toString(),
        name: symptom.name,
        severity: 5,
        notes: "",
        loggingType: 'quick'
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

  return (
    <div className="space-y-6">
      {/* Symptom List Card */}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSymptoms
              .filter(symptom => symptom.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 12)
              .map((symptom) => (
                <Button
                  key={symptom.id}
                  variant="soft"
                  size="sm"
                  onClick={() => addSymptom(symptom)}
                  disabled={quickSymptoms.some(s => s.id === symptom.id.toString())}
                  className="justify-start text-left h-auto p-2"
                >
                  <div className="text-sm font-medium">{symptom.name}</div>
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Symptoms Cards */}
      {quickSymptoms.map((symptom) => (
        <Card key={symptom.id} className="border-border">
          <CardContent className="p-4">
            {/* Header with emoji and severity badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl">{getSeverityIcon(symptom.severity)}</div>
                <h4 className="font-medium text-foreground truncate">{symptom.name}</h4>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={cn("text-xs font-medium px-2 py-1 rounded-md border", getSeverityColor(symptom.severity))}>
                  {symptom.severity}/10
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSymptom(expandedSymptom === symptom.id ? null : symptom.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>

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
                <Clock className="h-3 w-3" />
                <span>Just added</span>
              </div>

              {symptom.notes.trim().length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>Has notes</span>
                </div>
              )}
            </div>

            {/* Slider */}
            <div className="space-y-3 mb-4">
              <h5 className="text-sm font-medium">Severity Level</h5>
              <SimpleSeveritySelector
                value={symptom.severity}
                onChange={(value) => updateSymptom(symptom.id, 'severity', value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Additional Notes</h5>
              <SimpleNotes
                value={symptom.notes}
                onChange={(value) => updateSymptom(symptom.id, 'notes', value)}
                placeholder={`Describe your ${symptom.name.toLowerCase()} in detail...`}
                maxLength={500}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
