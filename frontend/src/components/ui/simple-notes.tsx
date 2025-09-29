import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { Button } from "./button"
import { 
  MessageSquare
} from "lucide-react"

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
 
  const characterCount = value.length
  const isNearLimit = characterCount > maxLength * 0.8

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
    </div>
  )
}
