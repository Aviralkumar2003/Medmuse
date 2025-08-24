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
  MessageSquare,
  Edit3,
  ArrowRight
} from "lucide-react"
import { SimpleNotes } from "./simple-notes"
import { UnifiedSymptom } from "./symptom-list"

interface QuickLoggingProps {
  availableSymptoms: Array<{id: number, name: string}>
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
  
  // Filter symptoms that are in quick logging mode
  const quickSymptoms = symptoms.filter(s => s.loggingType === 'quick')

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 12)

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

  const addSymptom = (symptom: {id: number, name: string}) => {
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
    if (value <= 3) return "bg-green-100 text-green-800"
    if (value <= 6) return "bg-yellow-100 text-yellow-800"
    if (value <= 8) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  // Removed unused variables - using quickSymptoms instead

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Add Symptoms</CardTitle>
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

          {/* Search and Quick Selection */}
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

      {/* Selected Symptoms */}
      {quickSymptoms.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quick Logged Symptoms ({quickSymptoms.length})</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Avg: {Math.round(quickSymptoms.reduce((sum, s) => sum + s.severity, 0) / quickSymptoms.length)}/10</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickSymptoms.map((symptom) => (
                 <div key={symptom.id} className="border rounded-lg overflow-hidden">
                   <div className="flex items-center justify-between p-3">
                     <div className="flex items-center gap-3">
                       <span className="text-lg">{getSeverityIcon(symptom.severity)}</span>
                       <div>
                         <div className="font-medium">{symptom.name}</div>
                         <div className="text-xs text-muted-foreground flex items-center gap-1">
                           <Clock className="h-3 w-3" />
                           <span>Just added</span>
                           {symptom.notes.trim().length > 0 && (
                             <>
                               <MessageSquare className="h-3 w-3" />
                               <span>Has notes</span>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                       {/* Quick Severity Buttons */}
                       <div className="flex gap-1">
                         {[3, 5, 7].map((severity) => (
                           <Button
                             key={severity}
                             variant={symptom.severity === severity ? "default" : "outline"}
                             size="sm"
                             onClick={() => updateSymptom(symptom.id, 'severity', severity)}
                             className={cn(
                               "h-8 w-8 p-0 text-xs",
                               symptom.severity === severity && getSeverityColor(severity)
                             )}
                           >
                             {severity}
                           </Button>
                         ))}
                       </div>
                       
                       <Badge variant="secondary" className={cn("text-xs", getSeverityColor(symptom.severity))}>
                         {symptom.severity}/10
                       </Badge>
                       
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
                   
                   {/* Expanded Notes Section */}
                   {expandedSymptom === symptom.id && (
                     <div className="border-t bg-muted/30 p-3">
                       <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <MessageSquare className="h-4 w-4 text-blue-500" />
                           <span className="text-sm font-medium">Additional Notes</span>
                         </div>
                         <SimpleNotes
                           value={symptom.notes}
                           onChange={(value) => updateSymptom(symptom.id, 'notes', value)}
                           placeholder={`Describe your ${symptom.name.toLowerCase()}...`}
                           maxLength={150}
                         />
                       </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      )}

      {/* No individual save button - using common save from parent */}
    </div>
  )
}
