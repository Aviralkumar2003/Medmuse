import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { 
  Clock, 
  Activity, 
  MessageSquare, 
  Edit3, 
  X,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

export interface UnifiedSymptom {
  id: string
  name: string
  severity: number
  notes: string
  loggingType: 'quick' | 'detailed'
}

interface SymptomListProps {
  symptoms: UnifiedSymptom[]
  onSymptomClick: (symptom: UnifiedSymptom) => void
  onRemoveSymptom: (symptomId: string) => void
  onConvertSymptom: (symptom: UnifiedSymptom, newType: 'quick' | 'detailed') => void
  selectedSymptomId?: string
}

export function SymptomList({ 
  symptoms, 
  onSymptomClick, 
  onRemoveSymptom, 
  onConvertSymptom,
  selectedSymptomId 
}: SymptomListProps) {
  if (symptoms.length === 0) {
    return (
      <Card className="shadow-card border-border">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No symptoms selected yet</p>
            <p className="text-xs mt-1">Add symptoms from the tabs below</p>
          </div>
        </CardContent>
      </Card>
    )
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

  const getLoggingTypeIcon = (type: 'quick' | 'detailed') => {
    return type === 'quick' ? <Clock className="h-3 w-3" /> : <Activity className="h-3 w-3" />
  }

  const getLoggingTypeColor = (type: 'quick' | 'detailed') => {
    return type === 'quick' 
      ? "bg-blue-50 text-blue-700 border-blue-200" 
      : "bg-purple-50 text-purple-700 border-purple-200"
  }

  const getLoggingTypeLabel = (type: 'quick' | 'detailed') => {
    return type === 'quick' ? "Quick" : "Detailed"
  }

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Selected Symptoms ({symptoms.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {symptoms.map((symptom) => (
          <div
            key={symptom.id}
            className={cn(
              "group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md",
              selectedSymptomId === symptom.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSymptomClick(symptom)}
          >
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveSymptom(symptom.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Main Content */}
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{symptom.name}</h4>
                <div className="flex items-center gap-2">
                  {/* Logging Type Badge */}
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getLoggingTypeColor(symptom.loggingType))}
                  >
                    {getLoggingTypeIcon(symptom.loggingType)}
                    {getLoggingTypeLabel(symptom.loggingType)}
                  </Badge>
                  
                  {/* Severity Badge */}
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getSeverityColor(symptom.severity))}
                  >
                    {getSeverityIcon(symptom.severity)} {symptom.severity}/10
                  </Badge>
                </div>
              </div>

              {/* Notes Preview */}
              {symptom.notes && (
                <div className="flex items-start gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {symptom.notes.length > 60 
                      ? `${symptom.notes.substring(0, 60)}...` 
                      : symptom.notes
                    }
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSymptomClick(symptom)
                  }}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                
                {/* Convert Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onConvertSymptom(symptom, symptom.loggingType === 'quick' ? 'detailed' : 'quick')
                  }}
                >
                  {symptom.loggingType === 'quick' ? (
                    <>
                      <Activity className="h-3 w-3 mr-1" />
                      To Detailed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      To Quick
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedSymptomId === symptom.id && (
              <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
            )}
          </div>
        ))}

        {/* Summary Stats */}
        {symptoms.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quick Logged:</span>
                <span className="font-medium">
                  {symptoms.filter(s => s.loggingType === 'quick').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Detailed Logged:</span>
                <span className="font-medium">
                  {symptoms.filter(s => s.loggingType === 'detailed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">With Notes:</span>
                <span className="font-medium">
                  {symptoms.filter(s => s.notes.trim().length > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Severity:</span>
                <span className="font-medium">
                  {Math.round(symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length)}/10
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
