import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface SeveritySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SeveritySlider({
  value,
  onChange,
  className,
}: SeveritySliderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span className="font-ui font-medium text-foreground">
          Exact severity: {value}/10
        </span>
        <span>10</span>
      </div>

      <SliderPrimitive.Root
        value={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={(nextValue) => onChange(nextValue[0])}
        className="relative flex h-6 w-full items-center"
      >
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-primary/20 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
      </SliderPrimitive.Root>

      <div className="grid grid-cols-5 text-[11px] text-muted-foreground">
        <span>Very low</span>
        <span className="text-center">Mild</span>
        <span className="text-center">Moderate</span>
        <span className="text-center">Severe</span>
        <span className="text-right">Very high</span>
      </div>
    </div>
  );
}
