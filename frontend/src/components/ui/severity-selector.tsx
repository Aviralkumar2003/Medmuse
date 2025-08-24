import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"

interface SeverityOption {
  value: number
  label: string
  emoji: string
  color: string
  description: string
}

const severityOptions: SeverityOption[] = [
  { value: 1, label: "Very Mild", emoji: "😊", color: "bg-green-100 text-green-800 border-green-200", description: "Barely noticeable" },
  { value: 2, label: "Mild", emoji: "🙂", color: "bg-green-50 text-green-700 border-green-100", description: "Slightly bothersome" },
  { value: 3, label: "Mild-Moderate", emoji: "😐", color: "bg-yellow-50 text-yellow-700 border-yellow-100", description: "Noticeable but manageable" },
  { value: 4, label: "Moderate", emoji: "😕", color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "Clearly present" },
  { value: 5, label: "Moderate-Severe", emoji: "😟", color: "bg-orange-50 text-orange-700 border-orange-100", description: "Significantly bothersome" },
  { value: 6, label: "Severe", emoji: "😣", color: "bg-orange-100 text-orange-800 border-orange-200", description: "Very uncomfortable" },
  { value: 7, label: "Very Severe", emoji: "😫", color: "bg-red-50 text-red-700 border-red-100", description: "Extremely uncomfortable" },
  { value: 8, label: "Intense", emoji: "😖", color: "bg-red-100 text-red-800 border-red-200", description: "Overwhelming" },
  { value: 9, label: "Extreme", emoji: "😵", color: "bg-red-200 text-red-900 border-red-300", description: "Nearly unbearable" },
  { value: 10, label: "Worst Possible", emoji: "🤯", color: "bg-red-300 text-red-950 border-red-400", description: "Maximum intensity" },
]

interface SeveritySelectorProps {
  value: number
  onChange: (value: number) => void
  className?: string
  showSlider?: boolean
}

export function SeveritySelector({ value, onChange, className, showSlider = true }: SeveritySelectorProps) {
  const selectedOption = severityOptions.find(option => option.value === value) || severityOptions[4]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Selection Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {severityOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center justify-center h-16 p-2 transition-all duration-200",
              value === option.value && option.color,
              "hover:scale-105 active:scale-95"
            )}
          >
            <span className="text-lg mb-1">{option.emoji}</span>
            <span className="text-xs font-medium">{option.value}</span>
          </Button>
        ))}
      </div>

      {/* Selected Severity Display */}
      <div className={cn(
        "p-4 rounded-lg border-2 transition-all duration-300",
        selectedOption.color
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedOption.emoji}</span>
            <div>
              <div className="font-semibold text-sm">{selectedOption.label}</div>
              <div className="text-xs opacity-80">{selectedOption.description}</div>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {value}/10
          </Badge>
        </div>
      </div>

      {/* Enhanced Slider */}
      {showSlider && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Very Mild</span>
            <span>Very Severe</span>
          </div>
          <div className="relative">
            <div className="h-3 bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-300"
                style={{ width: `${(value / 10) * 100}%` }}
              />
            </div>
            <div 
              className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300"
              style={{ left: `${((value - 1) / 9) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(3)}
          className="text-xs"
        >
          Mild
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(5)}
          className="text-xs"
        >
          Moderate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(7)}
          className="text-xs"
        >
          Severe
        </Button>
      </div>
    </div>
  )
}
