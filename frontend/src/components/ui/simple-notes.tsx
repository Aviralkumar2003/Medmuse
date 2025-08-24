import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { Button } from "./button"
import { 
  MessageSquare, 
  Lightbulb, 
  Plus
} from "lucide-react"

const quickPrompts = [
  "How long has this been happening?",
  "What makes it better or worse?",
  "Where exactly do you feel it?",
  "Any other symptoms?"
]

const quickTemplates = [
  "Started [time] ago",
  "Located in [area]",
  "Gets worse when [activity]",
  "Also experiencing [symptoms]"
]

interface SimpleNotesProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  maxLength?: number
}

export function SimpleNotes({ 
  value, 
  onChange, 
  className,
  placeholder = "Describe your symptoms...",
  maxLength = 200
}: SimpleNotesProps) {
  const [showQuickOptions, setShowQuickOptions] = useState(false)
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

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(
            "pr-12 transition-all duration-200",
            isNearLimit && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
        
        {/* Quick Options Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowQuickOptions(!showQuickOptions)}
          className="absolute top-2 right-2 h-8 w-8 p-0"
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
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
      {showQuickOptions && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          {/* Quick Prompts */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Quick Questions</div>
            <div className="grid grid-cols-2 gap-1">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addQuickPrompt(prompt)}
                  className="justify-start text-left h-auto p-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Quick Templates</div>
            <div className="grid grid-cols-2 gap-1">
              {quickTemplates.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTemplate(template)}
                  className="justify-start text-left h-auto p-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Encouragement */}
      {characterCount < 30 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-900">
                💡 Tip: More details help with tracking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
