import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"

interface SeverityOption {
  value: number
  label: string
  emoji: string
  color: string
}

const severityOptions: SeverityOption[] = [
  { value: 1, label: "Very Mild", emoji: "😊", color: "bg-green-100 text-green-800 border-green-200" },
  { value: 2, label: "Mild", emoji: "🙂", color: "bg-green-50 text-green-700 border-green-100" },
  { value: 3, label: "Mild-Moderate", emoji: "😐", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  { value: 4, label: "Moderate", emoji: "😕", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: 5, label: "Moderate-Severe", emoji: "😟", color: "bg-orange-50 text-orange-700 border-orange-100" },
  { value: 6, label: "Severe", emoji: "😣", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: 7, label: "Very Severe", emoji: "😫", color: "bg-red-50 text-red-700 border-red-100" },
  { value: 8, label: "Intense", emoji: "😖", color: "bg-red-100 text-red-800 border-red-200" },
  { value: 9, label: "Extreme", emoji: "😵", color: "bg-red-200 text-red-900 border-red-300" },
  { value: 10, label: "Worst", emoji: "🤯", color: "bg-red-300 text-red-950 border-red-400" },
]

interface SimpleSeveritySelectorProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function SimpleSeveritySelector({ value, onChange, className }: SimpleSeveritySelectorProps) {
  const selectedOption = severityOptions.find(option => option.value === value) || severityOptions[4]

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quick Selection Buttons */}
      <div className="grid grid-cols-5 gap-1">
        {severityOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
                         className={cn(
               "flex flex-col items-center justify-center h-12 p-1 transition-all duration-200",
               value === option.value ? option.color : "",
               "hover:scale-105 active:scale-95"
             )}
          >
            <span className="text-sm">{option.emoji}</span>
            <span className="text-xs font-medium">{option.value}</span>
          </Button>
        ))}
      </div>

      {/* Selected Severity Display */}
      <div className={cn(
        "p-3 rounded-lg border-2 transition-all duration-300",
        selectedOption.color
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedOption.emoji}</span>
            <div>
              <div className="font-semibold text-sm">{selectedOption.label}</div>
              <div className="text-xs opacity-80">{value}/10</div>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm font-bold">
            {value}/10
          </Badge>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex gap-2 justify-center">
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
