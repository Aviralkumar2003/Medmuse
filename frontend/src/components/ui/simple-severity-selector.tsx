import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SeverityOption {
  value: number
  emoji: string
}

const severityOptions: SeverityOption[] = [
  { value: 1, emoji: "😊" },
  { value: 2, emoji: "🙂" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "😕" },
  { value: 5, emoji: "😟" },
  { value: 6, emoji: "😣" },
  { value: 7, emoji: "😫" },
  { value: 8, emoji: "😖" },
  { value: 9, emoji: "😵" },
  { value: 10, emoji: "🤯" },
]

interface SimpleSeveritySelectorProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function SimpleSeveritySelector({ value, onChange, className }: SimpleSeveritySelectorProps) {
  const selectedOption = severityOptions.find((option) => option.value === value) || severityOptions[4]

  return (
    <div className={cn("space-y-4 w-full max-w-md mx-auto", className)}>
      {/* Slider */}
      <SliderPrimitive.Root
        value={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={(val) => onChange(val[0])}
        className="relative flex items-center select-none touch-none w-full h-6"
      >
        {/* Track with gradient */}
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
          <SliderPrimitive.Range className="absolute h-full rounded-full" />
        </SliderPrimitive.Track>

        {/* Thumb */}
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full bg-white border shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        />
      </SliderPrimitive.Root>

      {/* Emoji display */}
      <div className="flex justify-center text-4xl transition-all duration-200">
        {selectedOption.emoji}
      </div>
    </div>
  )
}
