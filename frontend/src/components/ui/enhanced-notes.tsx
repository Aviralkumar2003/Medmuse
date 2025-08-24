import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { Button } from "./button"
import { Badge } from "./badge"
import { Card, CardContent } from "./card"
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Lightbulb, 
  Clock, 
  Activity,
  Thermometer,
  MapPin,
  Plus,
  X
} from "lucide-react"

interface NotePrompt {
  id: string
  icon: React.ReactNode
  question: string
  placeholder: string
  category: string
}

const notePrompts: NotePrompt[] = [
  {
    id: "duration",
    icon: <Clock className="h-4 w-4" />,
    question: "How long has this been happening?",
    placeholder: "e.g., Started 2 hours ago, Been going on for 3 days...",
    category: "timing"
  },
  {
    id: "triggers",
    icon: <Activity className="h-4 w-4" />,
    question: "What makes it better or worse?",
    placeholder: "e.g., Gets worse when I move, Better when I rest...",
    category: "triggers"
  },
  {
    id: "location",
    icon: <MapPin className="h-4 w-4" />,
    question: "Where exactly do you feel it?",
    placeholder: "e.g., Upper right abdomen, Behind my left eye...",
    category: "location"
  },
  {
    id: "intensity",
    icon: <Thermometer className="h-4 w-4" />,
    question: "How does the intensity change?",
    placeholder: "e.g., Comes and goes, Constant but varying intensity...",
    category: "intensity"
  }
]

const noteTemplates = [
  "Started [time] ago and has been [constant/intermittent] since then.",
  "Located in [specific area] and feels like [description].",
  "Gets worse when I [activity] and better when I [activity].",
  "Also experiencing [related symptoms] along with this.",
  "This is [similar/different] to previous episodes I've had."
]

interface EnhancedNotesProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  maxLength?: number
  showPrompts?: boolean
  showTemplates?: boolean
  showVoiceInput?: boolean
}

export function EnhancedNotes({ 
  value, 
  onChange, 
  className,
  placeholder = "Describe your symptoms in detail...",
  maxLength = 500,
  showPrompts = true,
  showTemplates = true,
  showVoiceInput = true
}: EnhancedNotesProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [activePrompts, setActivePrompts] = useState<string[]>([])
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(false)

  const characterCount = value.length
  const isNearLimit = characterCount > maxLength * 0.8
  const isOverLimit = characterCount > maxLength

  const handleTemplateInsert = (template: string) => {
    const newValue = value + (value ? " " : "") + template
    onChange(newValue)
  }

  const togglePrompt = (promptId: string) => {
    setActivePrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    )
  }

  const insertPromptAnswer = (prompt: NotePrompt, answer: string) => {
    const newValue = value + (value ? "\n\n" : "") + `${prompt.question}\n${answer}`
    onChange(newValue)
    setActivePrompts(prev => prev.filter(id => id !== prompt.id))
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    // In a real implementation, you would integrate with Web Speech API
    // For now, we'll simulate it
    setTimeout(() => {
      setIsRecording(false)
      // Simulate adding voice input
      onChange(value + (value ? " " : "") + "Voice input would be added here.")
    }, 2000)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(
            "pr-12 transition-all duration-200",
            isOverLimit && "border-red-500 focus-visible:ring-red-500",
            isNearLimit && !isOverLimit && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
        
        {/* Voice Input Button */}
        {showVoiceInput && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={startVoiceRecording}
            disabled={isRecording}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            {isRecording ? (
              <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Character Counter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3 w-3" />
          <span className={cn(
            isOverLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-muted-foreground"
          )}>
            {characterCount}/{maxLength} characters
          </span>
        </div>
        
        {showTemplates && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplateSuggestions(!showTemplateSuggestions)}
            className="h-6 px-2 text-xs"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Templates
          </Button>
        )}
      </div>

      {/* Template Suggestions */}
      {showTemplateSuggestions && showTemplates && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Quick Templates</span>
            </div>
            <div className="space-y-2">
              {noteTemplates.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateInsert(template)}
                  className="w-full justify-start text-left h-auto p-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                  {template}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guided Prompts */}
      {showPrompts && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Guided Questions</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {notePrompts.map((prompt) => {
              const isActive = activePrompts.includes(prompt.id)
              return (
                <div key={prompt.id} className="space-y-2">
                  <Button
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrompt(prompt.id)}
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="flex items-center gap-2">
                      {prompt.icon}
                      <span className="text-xs">{prompt.question}</span>
                    </div>
                  </Button>
                  
                  {isActive && (
                    <div className="space-y-2 pl-4">
                      <Textarea
                        placeholder={prompt.placeholder}
                        rows={2}
                        className="text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            const target = e.target as HTMLTextAreaElement
                            if (target.value.trim()) {
                              insertPromptAnswer(prompt, target.value)
                              target.value = ''
                            }
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement
                            if (textarea?.value.trim()) {
                              insertPromptAnswer(prompt, textarea.value)
                              textarea.value = ''
                            }
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePrompt(prompt.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Encouragement */}
      {characterCount < 50 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                💡 Tip: More details help with tracking
              </p>
              <p className="text-xs text-blue-700">
                Include timing, triggers, location, and any related symptoms for better health insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
