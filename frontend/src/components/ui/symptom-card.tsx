import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  X, 
  AlertTriangle,
  Activity,
  Clock,
  MapPin
} from "lucide-react"
import { SeveritySelector } from "./severity-selector"
import { EnhancedNotes } from "./enhanced-notes"

interface SymptomCardProps {
  symptom: {
    id: number
    name: string
    severity: number
    notes: string
  }
  onUpdate: (field: 'severity' | 'notes', value: number | string) => void
  onRemove: () => void
  onEdit: () => void
  isEditing?: boolean
  className?: string
}

export function SymptomCard({ 
  symptom, 
  onUpdate, 
  onRemove, 
  onEdit, 
  isEditing = false,
  className 
}: SymptomCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const getSeverityColor = (value: number) => {
    if (value <= 3) return "bg-green-100 text-green-800 border-green-200"
    if (value <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (value <= 8) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getSeverityIcon = (value: number) => {
    if (value <= 3) return "😊"
    if (value <= 6) return "😐"
    if (value <= 8) return "😣"
    return "😫"
  }

  const getSeverityLabel = (value: number) => {
    if (value <= 3) return "Mild"
    if (value <= 6) return "Moderate"
    if (value <= 8) return "Severe"
    return "Very Severe"
  }

  const hasNotes = symptom.notes.trim().length > 0
  const isSevere = symptom.severity >= 8

  return (
    <Card className={cn("border-border transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">{getSeverityIcon(symptom.severity)}</span>
              <h4 className="font-ui font-medium text-foreground truncate">
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
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>{getSeverityLabel(symptom.severity)}</span>
          </div>
          
          {hasNotes && (
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
        {isSevere && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-ui font-medium text-red-900 text-sm mb-1">
                  Severe symptom detected
                </p>
                <p className="text-xs text-red-700">
                  Consider contacting your healthcare provider if this persists or worsens.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto font-normal"
            >
              <span className="text-sm text-muted-foreground">
                {isExpanded ? "Hide details" : "Show details"}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Severity Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium">Severity Level</h5>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="h-6 px-2 text-xs"
                >
                  {showDetails ? "Simple" : "Detailed"} view
                </Button>
              </div>
              
              <SeveritySelector
                value={symptom.severity}
                onChange={(value) => onUpdate('severity', value)}
                showSlider={showDetails}
              />
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Additional Notes</h5>
              <EnhancedNotes
                value={symptom.notes}
                onChange={(value) => onUpdate('notes', value)}
                placeholder={`Describe your ${symptom.name.toLowerCase()} in detail...`}
                maxLength={300}
                showPrompts={true}
                showTemplates={true}
                showVoiceInput={true}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
