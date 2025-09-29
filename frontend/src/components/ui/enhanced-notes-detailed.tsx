// import * as React from "react"
// import { useState } from "react"
// import { cn } from "@/lib/utils"
// import { Textarea } from "./textarea"
// import { Input } from "./input"
// import { Button } from "./button"
// import {
//   MessageSquare,
//   Lightbulb,
//   Plus,
//   Clock,
//   MapPin,
//   Activity,
//   AlertTriangle,
//   Thermometer,
//   X,
//   Save
// } from "lucide-react"

// interface PromptField {
//   id: string
//   label: string
//   placeholder: string
//   value: string
//   icon: React.ReactNode
// }

// interface EnhancedNotesDetailedProps {
//   value: string
//   onChange: (value: string) => void
//   className?: string
//   placeholder?: string
//   maxLength?: number
//   symptomName?: string
// }

// export function EnhancedNotesDetailed({
//   value,
//   onChange,
//   className,
//   placeholder = "Describe your symptoms in detail...",
//   maxLength = 500,
//   symptomName = "symptom"
// }: EnhancedNotesDetailedProps) {
//   const [showQuickOptions, setShowQuickOptions] = useState(false)
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [showPromptFields, setShowPromptFields] = useState(false)
//   const [promptFields, setPromptFields] = useState<PromptField[]>([
//     {
//       id: "duration",
//       label: "How long has this been happening?",
//       placeholder: "e.g., 2 days, 1 week, since yesterday",
//       value: "",
//       icon: <Clock className="h-4 w-4" />
//     },
//     {
//       id: "timing",
//       label: "When does it occur most?",
//       placeholder: "e.g., morning, evening, after meals, during stress",
//       value: "",
//       icon: <Clock className="h-4 w-4" />
//     },
//     {
//       id: "triggers",
//       label: "What makes it better or worse?",
//       placeholder: "e.g., rest helps, exercise makes it worse",
//       value: "",
//       icon: <Activity className="h-4 w-4" />
//     },
//     {
//       id: "location",
//       label: "Where exactly do you feel it?",
//       placeholder: "e.g., left side of head, lower back, chest",
//       value: "",
//       icon: <MapPin className="h-4 w-4" />
//     },
//     {
//       id: "intensity",
//       label: "How intense is the pain/discomfort?",
//       placeholder: "e.g., mild, moderate, severe, unbearable",
//       value: "",
//       icon: <Thermometer className="h-4 w-4" />
//     },
//     {
//       id: "associated",
//       label: "Any other symptoms that occur with it?",
//       placeholder: "e.g., nausea, dizziness, fatigue",
//       value: "",
//       icon: <AlertTriangle className="h-4 w-4" />
//     },
//     {
//       id: "impact",
//       label: "Does it affect your daily activities?",
//       placeholder: "e.g., can't work, difficulty sleeping, limited movement",
//       value: "",
//       icon: <Activity className="h-4 w-4" />
//     },
//     {
//       id: "triggers_noticed",
//       label: "Any triggers you've noticed?",
//       placeholder: "e.g., certain foods, stress, weather changes",
//       value: "",
//       icon: <AlertTriangle className="h-4 w-4" />
//     }
//   ])

//   const characterCount = value.length
//   const isNearLimit = characterCount > maxLength * 0.8

//   const addQuickPrompt = (prompt: string) => {
//     const newValue = value + (value ? "\n\n" : "") + prompt + "\n"
//     onChange(newValue)
//   }

//   const addTemplate = (template: string) => {
//     const newValue = value + (value ? " " : "") + template
//     onChange(newValue)
//   }

//   const addStructuredNote = () => {
//     const structuredNote = `Symptom: ${symptomName}
// Duration: 
// Location: 
// Severity: 
// Triggers: 
// Associated symptoms: 
// Impact on daily life: 
// Notes: `
//     onChange(structuredNote)
//   }

//   const updatePromptField = (id: string, newValue: string) => {
//     setPromptFields(fields =>
//       fields.map(field =>
//         field.id === id ? { ...field, value: newValue } : field
//       )
//     )
//   }

//   const generateNotesFromPrompts = () => {
//     const filledFields = promptFields.filter(field => field.value.trim() !== "")
//     if (filledFields.length === 0) return

//     const notes = filledFields.map(field =>
//       ` ${field.value}`
//     ).join("\n")

//     onChange(notes)
//     setShowPromptFields(false)
//   }

//   const clearPromptFields = () => {
//     setPromptFields(fields =>
//       fields.map(field => ({ ...field, value: "" }))
//     )
//   }

//   const detailedTemplates = [
//     "Started [time] ago",
//     "Located in [specific area]",
//     "Gets worse when [activity/condition]",
//     "Also experiencing [related symptoms]",
//     "Pain level: [1-10]",
//     "Triggers: [list triggers]",
//     "Duration: [how long each episode lasts]",
//     "Impact: [how it affects daily life]"
//   ]

//   return (
//     <div className={cn("space-y-3", className)}>
//       {/* Main Textarea */}
//       <div className="relative">
//         <Textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           rows={4}
//           className={cn(
//             "pr-12 transition-all duration-200",
//             isNearLimit && "border-yellow-500 focus-visible:ring-yellow-500"
//           )}
//         />

//       </div>

//       {/* Character Counter */}
//       <div className="flex items-center justify-between text-xs">
//         <div className="flex items-center gap-2">
//           <MessageSquare className="h-3 w-3" />
//           <span className={cn(
//             isNearLimit ? "text-yellow-500" : "text-muted-foreground"
//           )}>
//             {characterCount}/{maxLength} characters
//           </span>
//         </div>
//       </div>

//       {/* Quick Options */}
//       <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
//         {/* Structured Note Button */}
//         <div className="space-y-2">
//           <div className="text-sm font-semibold text-muted-foreground">Quick Start</div>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={addStructuredNote}
//             className="justify-start text-left h-auto p-2 text-xs"
//           >
//             <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
//             Use structured template
//           </Button>
//         </div>


//         {/* Prompt-Based Input Fields */}
//         <div className="space-y-2">
//           <div className="text-sm font-semibold text-muted-foreground">
//             Guided Questions
//           </div>

//           <div className="space-y-3 p-3 bg-background rounded-lg border">
//             <div className="grid grid-cols-1 gap-4">
//               {promptFields.map((field) => (
//                 <div key={field.id} className="space-y-2">
//                   {/* Label */}
//                   <label className="text-base font-semibold text-foreground flex items-center gap-1">
//                     {field.icon}
//                     {field.label}
//                   </label>

//                   {/* Input */}
//                   <Input
//                     value={field.value}
//                     onChange={(e) => updatePromptField(field.id, e.target.value)}
//                     placeholder={field.placeholder}
//                     className="text-sm"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Generate + Clear All buttons */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 type="button"
//                 variant="default"
//                 size="sm"
//                 onClick={generateNotesFromPrompts}
//                 className="text-xs"
//               >
//                 <Save className="h-3 w-3 mr-1" />
//                 Generate Notes
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={clearPromptFields}
//                 className="text-xs"
//               >
//                 <X className="h-3 w-3 mr-1" />
//                 Clear All
//               </Button>
//             </div>
//           </div>
//         </div>



//         {/* Quick Prompts (Legacy) */}
//         {/* <div className="space-y-2">
//             <div className="text-xs font-medium text-muted-foreground">Quick Prompts</div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
//               {promptFields.map((field, index) => (
//                 <Button
//                   key={index}
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => addQuickPrompt(field.label)}
//                   className="justify-start text-left h-auto p-2 text-xs"
//                 >
//                   <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
//                   {field.label}
//                 </Button>
//               ))}
//             </div>
//           </div> */}

//         {/* Templates Toggle */}
//         {/* <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <div className="text-xs font-medium text-muted-foreground">Quick Templates</div>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowTemplates(!showTemplates)}
//                 className="h-6 px-2 text-xs"
//               >
//                 {showTemplates ? "Hide" : "Show"}
//               </Button>
//             </div>
            
//             {showTemplates && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
//                 {detailedTemplates.map((template, index) => (
//                   <Button
//                     key={index}
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => addTemplate(template)}
//                     className="justify-start text-left h-auto p-2 text-xs"
//                   >
//                     <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
//                     {template}
//                   </Button>
//                 ))}
//               </div>
//             )}
//           </div> */}
//       </div>

//       {/* Encouragement */}
//       {/* {characterCount < 50 && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
//           <div className="flex items-start gap-2">
//             <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-xs font-medium text-blue-900">
//                 💡 Tip: Use the guided questions for comprehensive symptom tracking
//               </p>
//               <p className="text-xs text-blue-700 mt-1">
//                 Fill in the input fields to automatically generate detailed notes.
//               </p>
//             </div>
//           </div>
//         </div>
//       )} */}
//     </div>
//   )
// }


import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { Button } from "./button"
import {
  MessageSquare,
  Lightbulb,
  Plus,
  Clock,
  MapPin,
  Activity,
  AlertTriangle,
  Thermometer,
  X,
  Save
} from "lucide-react"

interface PromptField {
  id: string
  label: string
  placeholder: string
  value: string
  icon: React.ReactNode
}

interface EnhancedNotesDetailedProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  maxLength?: number
  symptomName?: string
  additionalNotes?: string
  setAdditionalNotes?: (value: string) => void
}

export function EnhancedNotesDetailed({
  value,
  onChange,
  className,
  placeholder = "Describe your symptoms in detail...",
  maxLength = 500,
  symptomName = "symptom",
  additionalNotes = "",
  setAdditionalNotes
}: EnhancedNotesDetailedProps) {
  const [showQuickOptions, setShowQuickOptions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPromptFields, setShowPromptFields] = useState(false)
  const [promptFields, setPromptFields] = useState<PromptField[]>([
    {
      id: "duration",
      label: "How long has this been happening?",
      placeholder: "e.g., 2 days, 1 week, since yesterday",
      value: "",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "timing",
      label: "When does it occur most?",
      placeholder: "e.g., morning, evening, after meals, during stress",
      value: "",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "triggers",
      label: "What makes it better or worse?",
      placeholder: "e.g., rest helps, exercise makes it worse",
      value: "",
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: "location",
      label: "Where exactly do you feel it?",
      placeholder: "e.g., left side of head, lower back, chest",
      value: "",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      id: "intensity",
      label: "How intense is the pain/discomfort?",
      placeholder: "e.g., mild, moderate, severe, unbearable",
      value: "",
      icon: <Thermometer className="h-4 w-4" />
    },
    {
      id: "associated",
      label: "Any other symptoms that occur with it?",
      placeholder: "e.g., nausea, dizziness, fatigue",
      value: "",
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: "impact",
      label: "Does it affect your daily activities?",
      placeholder: "e.g., can't work, difficulty sleeping, limited movement",
      value: "",
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: "triggers_noticed",
      label: "Any triggers you've noticed?",
      placeholder: "e.g., certain foods, stress, weather changes",
      value: "",
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ])

  const characterCount = value.length
  const isNearLimit = characterCount > maxLength * 0.8

  const addQuickPrompt = (prompt: string) => {
    const newValue = value + (value ? "\n\n" : "") + prompt + "\n"
    onChange(newValue)
  }

  const addTemplate = (template: string) => {
    const newValue = value + (value ? " " : "") + template
    onChange(newValue)
  }

  const addStructuredNote = () => {
    const structuredNote = `Symptom: ${symptomName}
Duration: 
Location: 
Severity: 
Triggers: 
Associated symptoms: 
Impact on daily life: 
Notes: `
    onChange(structuredNote + (additionalNotes ? "\n\n" + additionalNotes : ""))
  }

  const updatePromptField = (id: string, newValue: string) => {
    setPromptFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, value: newValue } : field
      )
    )
  }

  const generateNotesFromPrompts = () => {
    const filledFields = promptFields.filter(field => field.value.trim() !== "")
    if (filledFields.length === 0) return

    const notesFromPrompts = filledFields.map(field =>
      ` ${field.value}`
    ).join("\n")

    const finalNotes = notesFromPrompts + (additionalNotes ? "\n\n" + additionalNotes : "")
    
    onChange(finalNotes)
    setShowPromptFields(false)
  }

  const clearPromptFields = () => {
    setPromptFields(fields =>
      fields.map(field => ({ ...field, value: "" }))
    )
  }

  const detailedTemplates = [
    "Started [time] ago",
    "Located in [specific area]",
    "Gets worse when [activity/condition]",
    "Also experiencing [related symptoms]",
    "Pain level: [1-10]",
    "Triggers: [list triggers]",
    "Duration: [how long each episode lasts]",
    "Impact: [how it affects daily life]"
  ]

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(
            "pr-12 transition-all duration-200",
            isNearLimit && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
      </div>

      {/* Character Counter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3 w-3" />
          <span className={cn(
            isNearLimit ? "text-yellow-500" : "text-muted-foreground"
          )}>
            {characterCount}/{maxLength} characters
          </span>
        </div>
      </div>

      {/* Quick Options */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        {/* Structured Note Button */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-muted-foreground">Quick Start</div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStructuredNote}
            className="justify-start text-left h-auto p-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
            Use structured template
          </Button>
        </div>

        {/* Prompt-Based Input Fields */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-muted-foreground">
            Guided Questions
          </div>

          <div className="space-y-3 p-3 bg-background rounded-lg border">
            <div className="grid grid-cols-1 gap-4">
              {promptFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  {/* Label */}
                  <label className="text-base font-semibold text-foreground flex items-center gap-1">
                    {field.icon}
                    {field.label}
                  </label>

                  {/* Input */}
                  <Input
                    value={field.value}
                    onChange={(e) => updatePromptField(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Generate + Clear All buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={generateNotesFromPrompts}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Generate Notes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearPromptFields}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Notes Textarea */}
        {setAdditionalNotes && (
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
            className="mt-2"
          />
        )}
      </div>
    </div>
  )
}
